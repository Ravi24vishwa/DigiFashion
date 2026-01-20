# Internal File Behavior Documentation

This document explains how data flows and how different parts of the application interact internally.

## Screen Composition

Screens in this project serve as the orchestrators. A typical screen execution flow (e.g., `HomeScreen`) involves:
1.  **State Initialization**: defining local `useState` for loading and data.
2.  **Lifecycle Hook**: using `useEffect` to trigger data fetching on mount.
3.  **Data Fetching**:
    *   Check `AsyncStorage` for cached data.
    *   Trigger `api.get()` calls to fetch fresh data.
    *   Update local state and cache.
4.  **Data Transformation**: Mapping raw API arrays into a format expected by feature components (e.g., renaming fields like `product_name` to `title`).
5.  **Rendering**: Composing `ScrollView`, `BannerCarousel`, and `ProductList` components.

## Component Architecture

The project follows a tiered component structure:
*   **Common Components**: Stateless, purely visual elements (e.g., in `src/components/common`).
*   **Feature Components**: Specialized components that may accept complex data objects and handle internal interactions (e.g., `BannerCarousel` handles its own pagination/scrolling logic).
*   **Layout Components**: Define the shell of the page, like headers and safe area management.

## State Flow

### Redux State
*   **Auth**: Managed via `authSlice`. It stores the user token and profile. It is updated during login/logout and restored in `MainNavigation`.
*   **Cart/Favorites**: Managed via `cartSlice` and `favoritesSlice`. These slices contain "AsyncThunks" for API synchronization and standard reducers for local updates.
*   **UI**: Managed via `uiSlice`, primarily tracking visual state like tab bar visibility.

### Context State
*   Context providers (like `CartProvider`) wrapped in `App.jsx` provide another layer of state. In some cases, these may wrap or duplicate Redux logic for consistency across components that are not directly connected to Redux.

## API Service Usage

The `src/api/apiService.js` provides a centralized `api` object with standard HTTP methods (`get`, `post`, `put`, `delete`).
*   **Token Injection**: It automatically retrieves the `USER_TOKEN` from `AsyncStorage` and adds it to the `Authorization` header.
*   **Error Handling**: It converts non-200 responses or "logical errors" (where the status is 200 but the body contains success: false) into thrown Errors.
*   **JSON Parsing**: It automatically parses response bodies using `response.json()`.

## Data Interaction Pattern

1.  **Screen** calls a method from a **Hook** (e.g., `useCart`).
2.  **Hook** dispatches an **AsyncThunk** (from a Slice).
3.  **AsyncThunk** calls an **API Service**.
4.  **API Service** uses the **Base API Wrapper** to hit the endpoint.
5.  **Base API Wrapper** injects the token and performs the fetch.
6.  **Redux State** is updated based on the result.
7.  **Hook** returns the updated state to the **Screen**.
8.  **Screen** re-renders with the new data.
