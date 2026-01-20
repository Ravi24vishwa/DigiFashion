# Filter & Search Implementation Documentation

This document outlines the implementation of the advanced filtering system in the DigiFashion application, specifically within the `CategoryProductsScreen`.

## 1. API Integration

### Filter Options (`filter-listing`)
- **Service**: `productService.getFilters()`
- **Endpoint**: `/filter-listing`
- **Purpose**: Fetches dynamic configuration for:
  - **Sort Options**: Labels and values (e.g., `newest`, `high_to_low`).
  - **Price Range**: Minimum and maximum boundaries for the current category.
  - **Brands**: List of available brands in the system.

### Filtered Product Retrieval (`shop`)
- **Service**: `productService.getProducts(params)`
- **Endpoint**: `/shop`
- **Parameters**:
  - `category_ids`: Array of selected category IDs.
  - `sort_by`: String value (e.g., "high_to_low").
  - `price_range`: Formatted string `min-max` (e.g., "500-2000").
  - `brand`: Comma-separated string of brand names.

---

## 2. UI Components

### Custom Price Range Slider
Built using `react-native-reanimated` and `react-native-gesture-handler` for high performance.
- **Dual Thumbs**: Allows selecting both minimum and maximum price.
- **Interactive Labels**: Displays real-time price updates as the user drags.
- **Responsive Track**: Highlighted area between thumbs updates dynamically.
- **Sync Logic**: Automatically resets thumb positions when category-specific price boundaries change.

### Brand Filter
- **Multi-select**: Users can select multiple brands.
- **Responsive Badge**: The "Brand" tab in the filter drawer shows a highlight color when filters are active.

---

## 3. State Management & Logic

### Re-fetching Logic
Filters are **server-side**. Any change in Sort, Price, or Brand triggers an optimized re-fetch via `useCallback` and `useEffect` hooks. This ensures the user always sees the most accurate "live" data from the database.

### State Reset
- **Clear All**: Resets `selectedFilters` state, which automatically triggers a fresh API call for the default view.

---

## 4. Error & Edge Case Handling

### Empty Data ("Shop Data not found")
If the API returns a logical error (like "Shop Data not found" when filter combinations yield zero results):
- The app catches the error gracefully.
- **Console Optimization**: This specific message is suppressed in `console.error` logs to avoid noise, as it is treated as a normal "Empty Results" state.
- The product list is reset to an empty state (`[]`).
- A user-friendly "No products found" message is displayed via `ListEmptyComponent` with a "Clear All Filters" recovery button.

### Common Issues Resolved
1. **Reanimated Rendering**: Fixed a crash where Shared Values were directly rendered in the React tree. Now using React state synchronized via `runOnJS`.
2. **Synchronization**: Fixed an issue where the slider wouldn't update when the price range from the API changed.

---

## 5. Visual Theme
- **Primary Color**: `#A855F7` (Vibrant Violet).
- **Aesthetics**: Premium shadows, smooth transitions, and rounded interactive elements following the DigiFashion design system.
