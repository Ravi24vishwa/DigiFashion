# Project Structure Documentation

This document describes the current folder structure and the responsibilities of each directory in the DigiFashion React Native project.

## Root Directory

*   **android/**: Contains the native Android project files, including Gradle configurations, activity definitions, and manifest files.
*   **ios/**: Contains the native iOS project files, including CocoaPods configurations and Xcode project files.
*   **src/**: The primary directory for all Javascript/React source code.
*   **node_modules/**: Contains all project dependencies installed via npm/yarn.
*   **App.jsx**: The entry point of the application, responsible for setting up providers (Redux, Contexts) and initializing the navigation.
*   **index.js**: Register the main application component with the React Native bridge.
*   **package.json**: Lists project dependencies, scripts, and basic metadata.
*   **FAVORITE_LOGIC.md**: Detailed documentation of the optimized wishlist implementation.
*   **MARKDOWN_FILES_LIST.md**: A categorized and date-sorted list of all project documentation.
*   **CURRENT_STATE_SUMMARY.md**: High-level overview of project health and progress.
*   **babel.config.js**: Configuration for Babel transpilation.
*   **metro.config.js**: Configuration for the Metro bundler.
*   **tsconfig.json**: Basic TypeScript configuration (the project mostly uses .jsx but has TS support).

## Source Directory (src/)

### api/
*   **Responsibility**: Contains logic for communicating with external services.
*   **Key Files**:
    *   `apiService.js`: A base wrapper around the `fetch` API for making network requests.
    *   `endpoints.js`: Centralized list of API URLs and paths.
    *   `productService.js`, `orderService.js`, etc.: Specialized services for specific data domains.

### assets/
*   **Responsibility**: Stores static resources such as images, icons, and fonts used throughout the app.

### components/
*   **Responsibility**: Reusable UI elements.
*   **Subdirectories**:
    *   `common/`: Basic atoms like buttons, inputs, and loaders.
    *   `features/`: Complex components tied to specific app features (e.g., `BannerCarousel`, `ProductList`).
    *   `layout/`: Components related to structural layout (e.g., headers).

### constants/
*   **Responsibility**: Stores immutable values used across the app.
*   **Content**: Theme colors, storage keys, and mock data for development.

### context/
*   **Responsibility**: React Context providers for lightweight state management that doesn't necessarily belong in Redux.
*   **Content**: Cart, Favorites, Data, and UI visibility contexts.

### hooks/
*   **Responsibility**: Encapsulates reusable logic and state interactions.
*   **Content**: Hooks for accessing Redux state and API functions (e.g., `useCart`, `useFavorites`).

### navigation/
*   **Responsibility**: Defines the application's navigation flows.
*   **Content**:
    *   `MainNavigation.jsx`: The top-level navigator orchestrating Auth vs. Main app state.
    *   `BottomNavigation.jsx`: Logic for the bottom tab bar.
    *   `stacks/`: Individual stack navigators for different sections (Auth, Home, etc.).

### screens/
*   **Responsibility**: Full-page components that tie together UI and business logic.
*   **Subdirectories**:
    *   `auth/`: Screens for login, registration, and password recovery.
    *   `home/`: The main dashboard, search, and category-specific screens.
    *   `products/`: Detailed product views and lists.
    *   `profile/`: User account management and settings.

### store/
*   **Responsibility**: Redux Toolkit state management.
*   **Subdirectories**:
    *   `slices/`: Redux slices defining state, reducers, and asynchronous actions (thunks).
    *   `index.js`: Store configuration and combined reducers.

### utils/
*   **Responsibility**: Generic utility functions.
*   **Content**: Helpers for storage, formatting, and validation.

## Relationships Between Files

1.  **Entry Point**: `App.jsx` wraps the app in Redux and Context providers.
2.  **Navigation**: `App.jsx` renders `MainNavigation.jsx`, which uses `AsyncStorage` to decide whether to show the Auth or Main stack.
3.  **Data Fetching**: Screens call Hooks or Services. Services use the `apiService` to communicate with the backend.
4.  **State Management**: Hooks generally wrap Redux `useDispatch` and `useSelector` calls to provide a cleaner API to Screens.
5.  **UI Construction**: Screens compose Components (Common and Features) to build the user interface.
