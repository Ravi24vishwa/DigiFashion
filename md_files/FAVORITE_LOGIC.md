# Favorite Logic Documentation: DigiFashion

This document outlines the implementation of the "Favorites" (Wishlist) logic across the DigiFashion project, detailing the current architecture, observed issues, and a suggested path for a simpler, more robust implementation.

## 1. Project-Wide Implementation

### A. Data Layer (Redux & API)
- **`src/store/slices/favoritesSlice.js`**: The central brain of the favorite logic.
  - **`fetchFavorites`**: Asynchronous thunk that calls `favorite/list`. It populates two states: `items` (full product objects for the Wishlist screen) and `favoriteIds` (a simple array of IDs for quick lookups on Category/Home screens).
  - **`toggleFavoriteAsync`**: Asynchronous thunk for `favorite/` toggle. 
    - **Observed Behavior**: It currently dispatches a full `fetchFavorites()` refresh immediately after a successful toggle to ensure the local state is in sync with the server.
    - **Error Handling**: It specifically catches SQL error `1062` (Duplicate entry) and treats it as a "soft success," triggering a list refresh.
- **`src/api/endpoints.js`**: Defines the routes `favorite` (toggle) and `favorite/list`.

### B. Hook Layer
- **`src/hooks/useFavorites.js`**: A custom hook that consumes the Redux state.
  - Normalizes all IDs to `Number` to prevent type mismatches (e.g., `'102'` vs `102`).
  - Provides `isFavorite(id)`, `toggleFavorite(id)`, and `refreshFavorites()`.

### C. UI Layer
- **`src/components/features/products/ProductCard.js`**: Displays a heart icon. It checks for both an `isfavorite` prop and an internal `item.isFavorite` property.
- **`src/screens/products/MyProduct.jsx` (Wishlist Screen)**:
  - Refreshes the favorites list every time the screen is focused using `useFocusEffect`.
  - Maps API response items to the UI model (handling field variations like `product_name` vs `title`).
- **`src/screens/products/ProductDetailScreen.jsx`**: Integrates the `useFavorites` hook to show/toggle state on the product info section and similar products grid.

---

## 2. Current Status

### What is Working ✅
- **Server Synchronization**: The app successfully pulls the user's wishlist from the database.
- **Cross-Component Sync**: Since it uses Redux, adding a favorite in the `ProductDetailScreen` correctly reflects in the `HomeScreen` and `MyProduct` (Wishlist) screen.
- **Deduplication**: The logic prevents double-adding by handling "Duplicate entry" errors.
- **ID Normalization**: Using `Number(id)` prevents common JS bugs where string IDs don't match numeric IDs.

### What is Not Working / Areas of Risk ⚠️
- **Performance Overhead**: Calling `fetchFavorites()` (a full API request) after every single toggle is inefficient. If a user quickly likes/unlikes 5 products, 5 heavy list-fetch calls are initiated.
- **Race Conditions**: If a toggle request takes long, and a subsequent list fetch returns before the toggle finishes, the UI might "flicker" between favorite states.
- **Complexity**: The slice is doing "Optimistic" updates but then immediately discarding them in favor of a full fetch.
- **Incomplete Implementations**: Some functions (like `handleFavoritePress` in `ProductDetailScreen`) contain placeholder logic or empty blocks that need cleanup.

---

## 3. Current Implementation (Optimized)

The "Suggested Improved Approach" has been fully implemented as of January 20, 2026:

### A. Pure Optimistic UI Update ✅
The Redux state is now updated immediately in the `extraReducers` for `toggleFavoriteAsync`. 
- **Pending/Fulfilled**: We handle the `favoriteIds` array locally before/during the API call.
- **Result**: Heart icons respond instantly without waiting for network round-trips.

### B. Standardized Logic ✅
- Removed the redundant `fetchFavorites()` call from the `toggleFavoriteAsync` thunk.
- Logic now relies on Redux state persistence and smart error handling for "Duplicate entry" (SQL 1062).

### C. UI Bug Fixes ✅
- **ProductDetailScreen**: Fixed a non-functional favorite button and added Toast feedback.
- **ViewAllScreen**: Added missing `isFavorite` mapping to ensure consistent UI across all lists.

### D. Logout Security ✅
- Added a listener to the `favoritesSlice` that automatically clears the wishlist state when `auth/logout` is dispatched.
