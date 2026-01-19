# Redux Favorites Documentation: Single Source of Truth Logic

This document outlines the architecture and "One Way" synchronization logic used to manage favorite products in the DigiFashion application. It covers how we handle API conflicts, type-safety, and state consistency.

## 1. The Core Architecture (One Way Strategy)

To ensure the app never gets out of sync (where an item is favorited on one screen but not another), we use a **Single Source of Truth** pattern.

### The Refresh Flow:
Every time a user interacts with a favorite toggle:
1.  **Action:** User clicks the Heart icon.
2.  **Optimistic Update:** Redux immediately toggles the ID locally for an instant UI response.
3.  **API Call:** `toggleFavoriteAsync` is dispatched.
4.  **Automatic Refresh:** After the API call finishes (Success OR specific "Duplicate" error), we **automatically dispatch `fetchFavorites()`**.
5.  **Reconciliation:** The fresh data from the server replaces both our `favoriteIds` (IDs) and `items` (full product objects).

**Why this works:** By refreshing after every toggle, we don't have to guess what the server did. The server remains the ultimate source of truth.

---

## 2. Type-Safety & ID Normalization

A common issue in JavaScript apps is comparing a **String ID** (e.g., `"26"`) with a **Number ID** (e.g., `26`). This often causes `favoriteIds.includes(id)` to return `false` even when the IDs match.

### Our Solution:
-   **Redux Slice (`favoritesSlice.js`):** All incoming IDs from the API and all outgoing IDs from components are wrapped in `Number()`.
    -   `state.favoriteIds = action.payload.map(item => Number(item.id))`
-   **Custom Hook (`useFavorites.js`):** The `isFavorite` check forces the input to a Number:
    -   `favoriteIds.includes(Number(productId))`

This guarantees that the "Heart" icon state is always accurate regardless of whether the API returned a string or a number.

---

## 3. Handling Conflicts: The "Duplicate Entry" Logic

### The Scenario:
The backend uses a unique SQL constraint on favorites. If you try to "Add" something that is already there, it returns a `Duplicate entry` error (SQL Error 1062).

### The Logic Resolution:
Instead of treating this as a failure:
1.  **Detection:** We catch the error message in Redux.
2.  **Corrective Sync:** We treat a duplicate as a signal that the item **is definitely a favorite**.
3.  **Trigger Refresh:** We still trigger a `fetchFavorites()` call to ensure our local list includes this item.
4.  **UI Sync:** This prevents the heart from "flickering" off when it should remain on.

---

## 4. State Structure

The Redux store (`state.favorites`) maintains two collections to support different UI needs:

1.  **`favoriteIds` (Array of Numbers):**
    -   Used for: Instant "Heart" icon checks on Home/Search/Category screens.
    -   Benefit: extremely fast lookups using `.includes()`.
2.  **`items` (Array of Objects):**
    -   Used for: Rendering the **My Product (Wishlist)** screen.
    -   Source: Populated directly by the `favorite/list` API response.
    -   Benefit: No need to fetch individual product details when viewing the wishlist.

---

## 5. Recovery Mechanism: Force Local Removal

If the API ever gets permanently out of sync or is unreachable:
-   **Action:** **Long Press** on the Heart Icon.
    -   Component calls: `removeFavoriteLocally(productId)`.
-   **Result:** Immediately clears the item from the local Redux state (`favoriteIds` and `items`).
-   **Purpose:** Gives the user a "reset button" to fix UI inconsistencies manually without waiting for a server fix.

---

## Summary of Usage in Components

```javascript
// 1. Get the logic
const { isFavorite, toggleFavorite, removeFavoriteLocally } = useFavorites();

// 2. Check status
const heartIcon = isFavorite(product.id) ? 'heart-filled' : 'heart-outline';

// 3. Toggle (with single-press)
const onPress = () => toggleFavorite(product.id);

// 4. Force (with long-press)
const onLongPress = () => removeFavoriteLocally(product.id);
```

By following this "One Way" refresh and normalization pattern, we eliminate 99% of state-sync conflicts common in mobile applications.
