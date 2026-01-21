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
*   **State Redundancy**: Ongoing stabilization (Jan 20, 2026). The "Favorites" logic has been consolidated into an optimized Redux flow, though some overlapping hooks like `useAppCart` still exist and are slated for cleanup.
*   **Documentation Suite**: The project now includes a robust documentation set, including `FAVORITE_LOGIC.md`, `MARKDOWN_FILES_LIST.md`, and several stability reports in the root directory.
*   **Asset Paths**: Asset import paths have been corrected project-wide (`../assets` to `../../assets` or `../../../assets`) to ensure reliable resource bundling.
*   **Expo Status**: This is a **Bare React Native** project (not Managed Expo), giving full control over native folders but requiring manual management of native dependencies and build scripts.
