# 🚀 API INTEGRATION & FEATURE EXECUTION PLAN

This plan outlines the systematic implementation of missing features and API integrations based on the project's requirements and the `babyapi_instructions`.

---

## phase 1: Checkout & Address Management (Priority)
**Goal**: Complete the end-to-end checkout flow from Cart to Order Confirmation.

### 1.1 Checkout API Service
- Create `src/api/checkoutService.js`.
- Implement:
    - `getStates()`: `GET /checkout/address/state`
    - `getAddresses()`: `GET /checkout/address/list`
    - `addAddress(data)`: `POST /checkout/address/add`
    - `applyAddress(id)`: `POST /checkout/address/apply`
    - `initiateCheckout(shopId)`: `POST /checkout`
    - `applyCoupon(couponId)`: `POST /coupon-discount`

### 1.2 Address Management UI
- Create `AddressListScreen` (if not exists) for profile.
- Create/Update `AddAddressScreen` for adding/editing addresses.
- Integrate with `checkoutService`.

### 1.3 Checkout Flow in Cart
- Update `CartScreen` to use real address data in Step 2.
- Implement Coupon selection logic.
- Connect "Place Order" to `ORDER_SUBMIT` API.

---

## Phase 2: Order & Reviews
**Goal**: Handle post-purchase experience.

### 2.1 Order API Service
- Create `src/api/orderService.js`.
- Implement:
    - `getOrders()`: `GET /order/list`
    - `getOrderDetails(id)`: `POST /order/details`
    - `submitOrder(data)`: `POST /order/submit`
    - `addReview(data)`: `POST /order/review/add`

### 2.2 Order UI Updates
- Connect `OrderScreen` and `OrderDetailScreen` to `orderService`.
- Implement real "Send Review" logic in `ProductDetailScreen` or `OrderDetailScreen`.

---

## Phase 3: Enhanced Product Features
**Goal**: Robust product interactions.

### 3.1 Cart Persistence
- Update `cartSlice` and `ProductDetailScreen` to correctly send `device_id` and handle shop selection.
- Ensure `qty` updates are synced correctly with the API.

### 3.2 Advanced Search & Filters
- Update `productService` to support filter parameters: `brand`, `price_range`, `category_ids`.
- Integrate `FilterListing` API to populate the filter UI dynamically.

---

## Phase 4: UI/UX & Polish
**Goal**: Premium feel and robustness.

### 4.1 Skeleton Loaders
- Create `SkeletonLoader` component in `src/components/common/`.
- Apply to `HomeScreen` and `CategoryProductsScreen`.

### 4.2 Support & Information
- Implement Contact Us API call in `HelpCentre`.
- Implement dynamic Pages & FAQs in `Settings` or dedicated screens.

---

## Technical Tasks (Across Phases)
- **Token Handling**: Ensure `apiService` handles 401 errors gracefully.
- **Consistent Data Mapping**: Ensure all API responses are mapped to a consistent UI model (handling camelCase vs snake_case).
- **Offline Sync**: Implement `AsyncStorage` caching for Home & Categories as per `APP_SPEED_GUIDE.md`.

---
*Generated: January 12, 2026*
