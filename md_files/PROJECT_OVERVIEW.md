# 📱 DigiFashion Project Guide

**DigiFashion** is a React Native e-commerce app specialized for fashion and baby products. It features a modern, animated UI with full user authentication, shopping cart management, and product browsing.

---

## 🏗️ Project Structure
Here is where you can find everything:

### 📱 Screens (`src/screens/`)
*   **🔐 Authentication** (`/auth`)
    *   `IntroScreen`, `PreSignInScreen`: Onboarding flows.
    *   `SignInScreen`, `SignUpScreen`: User login and registration.
    *   `EmailVerificationScreen`, `VerifyOTPScreen`: Security checks.
    *   `ForgotPassScreen`, `SetNewPassword`: Account recovery.
*   **🏠 Home & Shopping** (`/home`, `/products`)
    *   `HomeScreen`: Main landing page with featured items.
    *   `Category/`: Product categories.
    *   `CartScreen`: Shopping cart management.
    *   `ProductDetailScreen`: Detailed view of a single product.
    *   `Order/`: Order history and tracking.
*   **👤 User Profile** (`/profile`)
    *   `ProfileScreen`: User dashboard.
    *   `EditProfile`: Update user details.
    *   `Settings`, `HelpCentre`: App configuration and support.

### 🧠 State Management (`src/store/slices/`)
We use **Redux Toolkit** to manage global app state:
*   `authSlice`: Handles user login state, tokens, and user info.
*   `cartSlice`: Manages items added to the cart.
*   `favoritesSlice`: Manages the user's wishlist/favorites.
*   `uiSlice`: Controls global UI elements (modals, loading states).

### 🧭 Navigation (`src/navigation/`)
*   `MainNavigation`: The root navigator handling the switch between Auth and App stacks.
*   `BottomNavigation`: The main tab bar for logged-in users (Home, Cart, Profile, etc.).

---

## 🛠️ Key Technologies
*   **React Native** (v0.80) & **React (v19)**
*   **Styling**: Custom themes in `src/theme/`.
*   **Icons**: `react-native-vector-icons`.
*   **Network**: `Axios` for API calls.
*   **Backend Integration**: Firebase Auth & Google Sign-In.

---

## 🚀 Quick Start Commands

**1. Install Dependencies**
```bash
npm install
```

**2. Start the Metro Bundler**
```bash
npm start
```

**3. Run on Android**
```bash
npm run android
```

**4. Run on iOS**
```bash
npm run ios
```
