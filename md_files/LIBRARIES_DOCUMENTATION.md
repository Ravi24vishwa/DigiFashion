# Dependency & Library Documentation

This document lists the primary dependencies of the DigiFashion project and their purposes.

## Core Dependencies

*   **react (19.1.0)**: The foundational library for building the user interface.
*   **react-native (0.80.2)**: The framework for building native mobile applications using React.
*   **@react-navigation/native & stacks/tabs (7.x)**: The routing and navigation library for the app.
*   **@reduxjs/toolkit (2.11.2)**: The official, opinionated toolset for efficient Redux development. Used for global state management.
*   **react-redux (9.2.0)**: React bindings for Redux.

## UI & Animation Libraries

*   **react-native-reanimated (3.19.4)**: Provides a powerful system for creating smooth animations at 60fps.
*   **react-native-gesture-handler (2.28.0)**: Native-driven gesture management.
*   **@gorhom/bottom-sheet (4.6.1)**: A highly performant and flexible bottom sheet component.
*   **react-native-reanimated-carousel (4.0.3)**: Carousel component built on top of Reanimated.
*   **react-native-vector-icons (10.3.0)**: Library for using various icon sets (e.g., FontAwesome, Ionicons).
*   **react-native-responsive-dimensions & fontsize**: Utility libraries for creating responsive layouts across different screen sizes.

## Data & Networking

*   **axios (1.13.2)**: Promise-based HTTP client for the browser and node.js, used for API requests.
*   **@react-native-async-storage/async-storage (2.2.0)**: Unencrypted, asynchronous, persistent, key-value storage system for the app. Used for tokens and caching.
*   **@react-native-firebase/app, auth, firestore (23.7.0)**: Firebase integration for authentication and database services.

## Utilities & Feedback

*   **react-native-safe-area-context (5.6.2)**: A library for handling "safe area" insets (notches, status bars) on modern devices.
*   **react-native-toast-message (2.3.3)**: A customizable toast notification component. **Crucial for providing feedback during cart operations, wishlist toggles, and checkout validation.**
*   **react-native-popup-menu (0.18.0)**: Extensible popup menu for React Native.

## Developer Dependencies

*   **eslint (8.19.0)**: Pluggable linting utility for Javascript and JSX.
*   **jest (29.6.3)**: Javascript testing framework.
*   **typescript (5.0.4)**: Static type checker (used for configuration and type support).
*   **prettier (2.8.8)**: Opinionated code formatter.
