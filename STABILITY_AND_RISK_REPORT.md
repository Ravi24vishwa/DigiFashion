# Stability & Crash Risk Documentation

This document identifies areas within the project that are sensitive to failure or could potentially cause stability issues.

## Facts

*   **Bleeding Edge Versions**: The project uses React 19 and React Native 0.80.2, which are very recent releases. Compatibility between these versions and some transitive dependencies might not be fully mature.
*   **Disabled Native Optimization**: The explicit use of `enableScreens(false)` indicates a known conflict with native view controllers, which can impact performance and memory usage in large navigation stacks.
*   **Parallel Fetching**: The use of `Promise.all` in `HomeScreen.jsx` for fetching sliders, banners, and home data simultaneously is efficient but can lead to "cascade failures" where one slow or failing request causes the entire page construction to fail if not handled correctly.
*   **Data Parsing Reliability**: Data transformation logic (e.g., `parseFloat(p.product_price || 0)`) assumes specific data types from the API. Unexpected `null` values or strings in unexpected formats could lead to `NaN` or runtime errors during rendering.
*   **Storage Reliance**: The app relies heavily on `AsyncStorage` for session persistence. If storage becomes corrupted or reaches its limit, the app may fail to log users in or crash during the boot sequence.

## Critical Risk Areas

### 1. Version Compatibility
*   **Risk**: React 19 introduced breaking changes in how certain internal hooks and refs work. Older libraries (like `react-native-responsive-dimensions` or `react-native-popup-menu`) might exhibit unexpected behavior or crashes if they rely on deprecated React features.

### 2. Async Data Streams
*   **Risk**: Screens that trigger multiple async actions (Redux thunks + local API calls) are susceptible to race conditions. If a user navigates away from a screen before a fetch completes, a call to `setState` on an unmounted component or a stale data update could occur.

### 3. Deeply Nested Providers
*   **Risk**: In `App.jsx`, there are 6+ nested providers. Each provider change can trigger a re-render down the entire tree. Combined with Redux updates, this can lead to "render loops" or performance degradation on lower-end devices.

### 4. Image Resource Loading
*   **Risk**: Static image requires (e.g., `require('../../assets/icons/Heart1.png')`) must exist at build time. Missing assets will cause immediate crashes or red-screen errors in development and could cause the app to fail to load in production if resources are not correctly bundled.

### 5. API Response Schema Changes
*   **Risk**: The app uses manual mapping (e.g., `p.product_thumbnail_image_url`). If the backend changes a field name even slightly (e.g., to `product_image_url`), the app will display broken images or empty lists because there is no robust schema validation layer (like Zod or TypeScript interfaces for runtime checks).

## Performance Sensitive Sections
*   **HomeScreen Rendering**: Iterating over `homeData` and rendering `ProductList` for each section involves significant UI work.
*   **Image Overload**: Loading large numbers of high-resolution product images in a single ScrollView without optimization (like `FlatList` with `windowSize` settings) can lead to memory pressure and UI stutters.
