#  PROJECT ANALYSIS: MISSING & PENDING FEATURES

This document outlines the current gaps and missing functionalities identified in the **DigiFashion** project. These are categorized into Core Product Flow, User Experience, and Technical Robustness.

---

## 1. Core Commerce Flow (Critical)
While the UI for many screens exists, the end-to-end purchasing logic is incomplete.

- **[ ] Full Checkout Integration**: 
    - The `CartScreen` has steps for Address and Payment, but they are UI placeholders.
    - Missing integration with `CHECKOUT`, `ADDRESS_LIST`, and `ADDRESS_ADD` endpoints.
- **[ ] Address Management**: 
    - No dedicated screen for a user to manage (Add/Edit/Delete) their saved addresses in the Profile section.
- **[ ] Real Payment Gateways**: 
    - Payment steps only show static icons for Razorpay, PayPal, etc.
    - Missing actual SDK integration or Webview flow for processing real payments.
- **[ ] Order Submission**: 
    - `handlePlaceOrder` in `CartScreen` currently just clears the cart and shows a success screen.
    - Missing call to `ORDER_SUBMIT` API to record the transaction on the backend.
- **[ ] Order Tracking**:
    - `OrderScreen` and `OrderDetailScreen` exist but need validation against real live data for status updates (Processing, Shipped, Delivered).

## 2. Product Features
- **[ ] Real Review Submission**:
    - `ProductDetailScreen` has a "Send Review" feature that only updates local state.
    - Needs integration with `ORDER_REVIEW_ADD` API.
- **[ ] Product Variants (Active Support)**:
    - UI allows selecting Size/Color, but the `addToCart` API call doesn't currently persist these selections (per comments in `ProductDetailScreen`).
- **[ ] Coupon & Discount System**:
    - Endpoints for `COUPON_LIST` and `COUPON_APPLY` are defined in `endpoints.js`.
    - UI is missing in `CartScreen` to enter and validate coupon codes.
- **[ ] Product Search Filters**:
    - While `FilterScreen` logic might be defined, integration with the `SEARCH` API's filter parameters needs to be verified as fully functional.

## 3. User Experience & Aesthetics
As per the project's goal for "Rich Aesthetics":
- **[ ] Skeleton Loaders**: 
    - Currently using basic `ActivityIndicator`. For a premium feel, "Skeleton" views should be implemented for Home and Product lists.
- **[ ] Empty States**: 
    - Need better "Wow" factor designs for Empty Cart, No Orders, and Search Not Found.
- **[ ] Dark Mode Support**: 
    - Modern apps often require a Dark Mode toggle or system preference sync.
- **[ ] Micro-Animations**: 
    - Add Lottie animations for "Success" (Order Placed), "Error", and "Empty Bag".
    - Heart animation for Adding to Wishlist.

## 4. Technical & Infrastructure
- **[ ] Push Notifications**: 
    - No implementation of FCM or OneSignal for order updates, promotions, or cart abandonment.
- **[ ] Deep Linking**: 
    - Missing ability to open specific products or categories from external links (Shared products).
- **[ ] Token Refresh Logic**: 
    - `apiService.js` handles requests but doesn't seem to have a mechanism to automatically refresh the JWT token if it expires during a session.
- **[ ] Offline Mode / Caching**: 
    - Basic local caching for Home and Filters is planned/started but needs to be robust for a seamless offline-to-online transition.
- **[ ] Global Error Boundary**: 
    - Need a fallback UI for when the app crashes or API returns a 500 error to prevent a blank screen.

## 5. Profile & Settings
- **[ ] Contact Us Logic**: 
    - `HelpCentre.jsx` has the UI, but the "Submit Message" functionality needs to connect to the `CONTACT_US` API.
- **[ ] FAQs & Pages**: 
    - Integration with `FAQS` and `PAGES` API to show dynamic content for "Privacy Policy" and "Terms of Service".
- **[ ] Account Deletion**: 
    - Often required for App Store/Play Store compliance.

---
*Last Updated: January 12, 2026*
