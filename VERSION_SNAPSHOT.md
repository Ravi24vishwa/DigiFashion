# Version & Compatibility Snapshot

This document provides a point-in-time snapshot of the environment and dependency versions for the DigiFashion project.

## Environment Summary

*   **Node.js**: >= 18 (as per package.json)
*   **Platform Support**: Android and iOS
*   **Package Manager**: npm/yarn

## Core Framework Versions

| Library | Version |
| :--- | :--- |
| React | 19.1.0 |
| React Native | 0.80.2 |
| Redux Toolkit | 2.11.2 |
| React Navigation | 7.x |

## Key Native Modules

| Library | Version |
| :--- | :--- |
| react-native-reanimated | 3.19.4 |
| react-native-gesture-handler | 2.28.0 |
| @react-native-async-storage/async-storage | 2.2.0 |
| @react-native-firebase/app | 23.7.0 |
| react-native-screens | 4.14.0 |
| react-native-safe-area-context | 5.6.2 |

## Known Compatibility Sensitivities

*   **React 19 & React Native**: This project is using one of the first versions of React Native (0.80) to officially support/target React 19. This is an experimental frontier for many libraries.
*   **Nav-Native Conflict**: The presence of `enableScreens(false)` in `App.jsx` suggests a conflict between `react-native-screens` and the current navigation implementation or the React 19 architectural changes.
*   **State Redundancy**: The project contains both older synchronous Redux hooks (`useAppCart` in `useAppData.js`) and newer asynchronous logic (`useCart` in `useCart.js`).
*   **Asset Paths**: The project recently underwent a refactoring of asset import paths (e.g., updating `../assets` to `../../assets`), making the asset management layer sensitive to file relocation.
*   **Expo Status**: This is a **Bare React Native** project (not Managed Expo), giving full control over native folders but requiring manual management of native dependencies and build scripts.
