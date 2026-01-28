# Structural Observations & Risks

This document identifies architectural patterns and potential risks within the current project structure.

## Facts

*   **Redux and Context Co-existence**: The project uses Redux Toolkit for state management (Auth, Cart, Favorites, UI) but also implements multiple React Context providers for similar domains in `App.jsx`.
*   **Duplicate Logic**: Significant progress has been made in consolidating the "Favorites" logic into a single optimized Redux flow (`favoritesSlice.js` + `useFavorites.js`). Other domains (like Cart) still have parallel implementations that require further attention.
*   **Heavy Screens**: Some screens (like `HomeScreen.jsx`) handle multiple responsibilities including data fetching, local state management, complex data mapping, and rendering.
*   **Disabled Native Screens**: `enableScreens(false)` is present in `App.jsx`, which prevents the use of native navigation optimization.
*   **Manual Mapping**: Data from APIs is often manually mapped or transformed within the component's render cycle. Recent improvements in `useOrders.js` demonstrate a shift towards doing this mapping in the service/hook layer.

## Assumptions

*   The project is successfully transitioning to an asynchronous Redux state with Optimistic UI updates.
*   Specific compatibility issues (possibly related to React 19 or library version mismatches) necessitated the disabling of native screens.

## Risks (No Fixes Prescribed)

### Tight Coupling
*   **API and Logic in Components**: Screens depend directly on the `api` service and specific data shapes from the backend. Changes to API responses would require direct modifications to multiple screens.
*   **Navigation and State**: `MainNavigation` is responsible for session restoration using `AsyncStorage` and `dispatch`, making the navigation layer heavily dependent on the Auth state implementation.

### Mixed Responsibilities
*   **Utility vs Business Logic**: Components in `src/components/features` sometimes include domain-specific logic rather than being purely presentational.
*   **State Split**: Having functionality split between Redux and Context makes it harder to trace the "source of truth" for debugging state transitions.

### Maintenance Risks
*   **Inconsistent Hook Usage**: Developers might use `useAppCart` in one screen and `useCart` in another, leading to inconsistent behavior (e.g., one updating local state and the other triggering API calls).
*   **Complexity in App.jsx**: The increasing number of nested providers in `App.jsx` makes the entry point harder to manage and could lead to performance bottlenecks during re-renders.
*   **Mapping Overhead**: Large mapping functions inside the `map()` loop in screens can become a performance bottleneck as the data size grows.
