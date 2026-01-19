# Order Screen Documentation

## Overview
The `OrderScreen` is a core component of the DigiFashion application, providing users with a comprehensive view of their purchase history. It serves as the primary interface for tracking current orders and reviewing past transactions.

---

## 1. Project Integration & Navigation
The `OrderScreen` is integrated into the main application flow as one of the primary tabs in the **Bottom Navigation Bar**.

- **File Path**: `src/screens/home/Order/OrderScreen.jsx`
- **Navigation Type**: Bottom Tab Member
- **Parent Container**: `BottomNavigation.jsx`
- **Route Name**: `"Order"`
- **Access Point**: Accessible from the bottom tab bar using the "Orders" icon (referenced as `Buy.png` in assets).

---

## 2. Architecture & Data Flow

### Custom Hooks
The screen relies on two primary custom hooks for its data management:
- **`useOrders`**: 
    - Fetches order data from the backend via `orderService`.
    - Manages loading states and provides a `fetchOrders` function for refreshing.
    - Maps raw API data into a UI-friendly model (standardizing fields like `id`, `title`, `price`, and `status`).
- **`useCart`**: 
    - Used to retrieve the current cart item count, which is displayed as a badge in the header.

### API Integration
- **Service**: `src/api/orderService.js`
- **Functionality**: Retrieves the authenticated user's order list and specific order details.

---

## 3. Key Features

### Filtering & Search
- **Status Filters**: Users can filter orders by their lifeycle status: `All`, `Pending`, `Processing`, `Shipped`, `Delivered`, and `Cancelled`.
- **Search Functionality**: A search bar allows users to find specific orders by their **Order ID** or **Product Title**.

### UI Components
- **CommonHeader**: Provides a consistent look with a title ("My Orders"), a search icon, and a cart icon with a dynamic badge.
- **OrderCard**: A stylized component that displays:
    - Order ID & Store Name (Sold to).
    - Primary product image.
    - Product title and price.
    - Variants (Size & Quantity).
- **PromoBanner**: Displays promotional content within the order list area.
- **Empty State**: A dedicated UI (`emptyContainer`) that appears when no orders are found, guiding the user back to shopping.

---

## 4. User Interaction Flow
1. **Entry**: User taps the "Orders" tab in the bottom navigation.
2. **Loading**: An `ActivityIndicator` is shown while `fetchOrders` is executing.
3. **Display**: The `FlatList` renders all orders.
4. **Interaction**:
    - **Filter**: Tapping a filter chip updates the `activeFilter` state and re-renders the list.
    - **Search**: Typing in the search bar filters the results in real-time.
    - **Detail View**: Tapping an `OrderCard` navigates the user to the `OrderDetailScreen`, passing the order object as a navigation parameter.
    - **Refresh**: Pull-to-refresh functionality is integrated via the `FlatList` `onRefresh` prop.

---

## 5. Styling & Responsiveness
- **Style System**: Uses `StyleSheet.create` with a clean, modern aesthetic.
- **Premium Design**: Features card-based layouts with subtle shadows (`elevation: 5`), rounded corners (`borderRadius: 18`), and a curated color palette (Primary: `#637BDD`).
- **Responsiveness**: Utilizes `react-native-responsive-dimensions` to ensure consistent sizing across different screen sizes.

---

## 6. Dependencies
- `@react-navigation/native` & `@react-navigation/bottom-tabs`
- `react-native-responsive-dimensions`
- `react-redux` (via hooks)
- Custom Components (`CommonHeader`, `PromoBanner`)
- Custom Hooks (`useOrders`, `useCart`)
