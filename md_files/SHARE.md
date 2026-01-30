# Share Functionality Documentation (DigiFashion)

This document outlines the current state, implementation details, and future recommendations for the "Share" functionality within the DigiFashion project.

## Overview

Currently, the "Share" functionality in DigiFashion is primarily in a **simulated** or **placeholder** state. While UI elements exist across various screens to trigger sharing, the integration with the native device sharing sheet (via `Share.share`) is either simulated internally or currently disabled.

## Current Implementations

### 1. Order Details Screen
**File:** `src/screens/home/Order/OrderDetailScreen.jsx`

*   **Trigger:** A "Share" button located in the Order Tracking or Actions section.
*   **Current Behavior:** 
    *   The share action is **simulated**.
    *   It sets a local flag (`IsShared = true`) on the order object.
    *   Displays an `Alert` confirming the action: *"Product shared and added to Shared tab!"*.
    *   Provides an option to navigate to the `MyProduct` screen (specifically the 'Shared' tab).
*   **Code Reference:**
    ```javascript
    const handleShare = () => {
        if (order?.id) {
            // Simulated Logic
            order.IsShared = true;
            Alert.alert('Shared', 'Product shared and added to Shared tab!', [
                { text: 'View', onPress: () => navigation.navigate('MyProduct', { tab: 'Shared' }) },
                { text: 'OK' }
            ]);
        }
    };
    ```

### 2. Product Detail Screen
**File:** `src/screens/products/ProductDetailScreen.jsx`

*   **Trigger:** 
    *   `CommonHeader` allows for a share icon via the `showShare` prop.
    *   `ProductInfo` component has a dedicated "Share" button.
*   **Current Behavior:** 
    *   The functionality is currently **commented out** in the code.
    *   The UI is ready but disabled (`// onSharePress={handleSharePress}`).

### 3. Settings Screen
**File:** `src/screens/profile/Settings.jsx`

*   **Feature:** A "Share Settings" section exists.
*   **Option:** "Include text as image while sharing".
*   **Current Behavior:** 
    *   There is a `Switch` component that toggles a local state variable.
    *   *Note:* The state variable is currently named `showStockOnly`, which suggests a copy-paste mismatch that needs refactoring. It does not yet influence actual sharing behavior.

## User Interface Guidelines

### CommonHeader Component
**File:** `src/components/layout/CommonHeader.js`

The `CommonHeader` is designed to support sharing out-of-the-box.
*   **Props:**
    *   `showShare` (boolean): Set to `true` to display the share icon.
    *   `onSharePress` (function): Callback function to execute when the icon is pressed.

### ProductInfo Component
**File:** `src/components/features/products/ProductInfo.jsx`

*   **Props:**
    *   `onShare` (function): Callback receiving the `item` object.

## Recommendation for Full Implementation

To enable actual sharing capabilities, it is recommended to implement a centralized utility function using React Native's `Share` API.

### Proposed Utility: `src/utils/shareUtils.js`

```javascript
import { Share, Alert } from 'react-native';

/**
 * Opens the native share sheet.
 * @param {Object} content - The content to share.
 * @param {string} content.message - The main text message.
 * @param {string} [content.url] - URL to share (iOS primarily).
 * @param {string} [content.title] - Title of the content.
 */
export const shareContent = async ({ message, url, title }) => {
  try {
    const result = await Share.share({
      message: url ? `${message}\n${url}` : message,
      title: title,
      url: url, // iOS only
    });
    
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared with activity type of result.activityType
      } else {
        // Shared
      }
    } else if (result.action === Share.dismissedAction) {
      // Dismissed
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

### Integration Plan
1.  **Refactor Settings**: Fix the variable naming in `Settings.jsx` and persist the "image mode" preference using AsyncStorage or Redux.
2.  **Enable in Product Detail**: Uncomment the share handlers in `ProductDetailScreen` and connect them to the proposed `shareContent` utility.
3.  **Update Order Detail**: Replace the simulated alert in `OrderDetailScreen` with the actual `shareContent` call.
