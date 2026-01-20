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

## 3. Suggested Improved Approach

For a simpler, more understandable, and high-performance favorites system, the following approach is recommended:

### A. Pure Optimistic UI Update
Instead of fetching the whole list after a toggle, update the Redux state immediately:
```javascript
// In favoritesSlice.js
.addCase(toggleFavoriteAsync.pending, (state, action) => {
    const productId = Number(action.meta.arg);
    const index = state.favoriteIds.indexOf(productId);
    if (index === -1) {
        state.favoriteIds.push(productId); // Assume liked
    } else {
        state.favoriteIds.splice(index, 1); // Assume unliked
    }
})
```
*If the API fails, roll back the change in `.rejected`.*

### B. Standardized Response Model
The backend should ideally return the current "liked" status or the updated list in the response of the `POST /favorite` call. This would remove the need for a second `fetchFavorites()` call.

### C. Shared Identifier
Stick to a single naming convention for IDs. Currently, the code checks `item.id`, `item.product_id`, and `item.order_id`.
- **Recommendation**: Map all API items to a standard UI model `{ id, title, price, image }` as soon as they are received in the API service/hook layer.

### D. Better Hook Logic
Simplify `useFavorites` to handle the complexity internally:
```javascript
const toggleFavorite = (product) => {
    // 1. Dispatch toggle
    dispatch(toggleFavoriteAsync(product.id));
    // 2. No need for fetchFavorites() here! 
    // Redux should have already updated favoriteIds optimistically.
};
```

### E. Manual Maintenance Doc
Always clear favorites Redux state on **Logout** to prevent the next user on the same device from seeing the previous user's wishlist. (Add `clearFavorites` to the logout thunk).
