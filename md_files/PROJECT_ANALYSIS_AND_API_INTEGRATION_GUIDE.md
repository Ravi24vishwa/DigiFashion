# DigiFashion Project Analysis & Improvement Guide
## Comprehensive Project Assessment with BabyAPI Integration Recommendations

**Date:** January 12, 2026  
**Project:** DigiFashion - React Native E-commerce Application  
**Status:** In Development (Authentication phase ~70% complete)

---

## 📋 Executive Summary

DigiFashion is a React Native e-commerce application designed for baby products. The project has:
- **Foundation:** Well-structured React Native setup with Redux state management
- **Progress:** Authentication screens mostly completed, basic navigation configured
- **Challenge:** API integration with BabyAPI not yet fully implemented
- **Opportunity:** Clear roadmap to integrate comprehensive BabyAPI endpoints

### Current Status: 🟡 In Progress
- ✅ 4 Git commits with authentication work
- ✅ Redux store configured (auth, cart, favorites, UI)
- ✅ Base navigation structure (bottom tabs, stacks)
- ⏳ Auth screens partially implemented
- ⚠️ API services exist but endpoints not fully utilized
- ❌ Product browsing not connected to backend
- ❌ Cart operations not connected to backend
- ❌ Checkout flow not integrated

---

## 1. PROJECT STRUCTURE ANALYSIS

### Current Architecture

```
DigiFashion/
├── src/
│   ├── api/                 ✅ Basic service layer
│   │   └── apiService.js    (Generic API wrapper)
│   ├── screens/             🟡 Partially connected
│   │   ├── Auth/            (Login, SignUp, verification)
│   │   ├── Home/            (Home, Cart, Category, Profile)
│   │   └── CommonScreen/    (Product details)
│   ├── components/          🟡 Needs API integration
│   │   ├── CommonHelper/
│   │   └── Cart/
│   ├── navigation/          ✅ Well configured
│   ├── store/               ✅ Redux slices (auth, cart, favorites)
│   ├── contexts/            ⚠️ Legacy (should migrate to Redux)
│   └── hooks/               ✅ Good foundation
├── android/                 ✅ Configured
├── ios/                     ✅ Configured
└── package.json             ✅ All dependencies present
```

### Key Technology Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Frontend Framework** | React Native 0.80.2 | ✅ Latest |
| **State Management** | Redux Toolkit | ✅ Configured |
| **Navigation** | React Navigation 7.x | ✅ Configured |
| **Async Storage** | AsyncStorage | ✅ Setup |
| **HTTP Client** | Fetch API | ⚠️ Should add error retry |
| **Forms** | Custom (no validation lib) | 🔴 Needs improvement |
| **Authentication** | Firebase + Custom API | 🟡 Partial |

---

## 2. CURRENT FUNCTIONALITY ANALYSIS

### 2.1 Working Features ✅

#### Authentication System
```
Status: 70% Complete
├── Sign Up Screen
│   ├── UI: ✅ Built
│   ├── OTP: ✅ Input component exists
│   ├── API Integration: 🟡 Partially done
│   └── Validation: 🔴 Needs improvement
├── Login Screen
│   ├── UI: ✅ Built
│   ├── API Integration: ✅ Connected to /login
│   └── Token Storage: ✅ Working
└── Password Reset
    ├── UI: ✅ Screens exist
    └── API Integration: 🟡 Partial
```

#### State Management
```
Redux Store: ✅ Well organized
├── authSlice.js      ✅ Login/register async thunks
├── cartSlice.js      ✅ Basic cart operations
├── favoritesSlice.js ✅ Favorites state
└── uiSlice.js        ✅ UI state management
```

#### Navigation
```
Bottom Tabs: ✅ Configured
├── Home Stack
├── Category Stack
├── Cart Stack
├── Profile Stack
└── Auth Stack (overlay)

Status: ✅ Structure ready, screens need content
```

### 2.2 Partially Implemented Features 🟡

#### Product Browsing
```
Current: Dummy data only
├── HomeScreen.jsx      - Shows banners (placeholder)
├── CategoryScreen      - Lists categories (static)
├── ProductCard.jsx     - UI exists but no API calls
└── ProductGrid.js      - Grid rendering (no data source)

Needed:
✅ Connect to /homedata endpoint
✅ Connect to /categories endpoint
✅ Connect to /shop endpoint for product listing
✅ Connect to /product/ for details
```

#### Cart Management
```
Current: Redux store setup only
├── Redux: cartSlice.js - State structure ready
├── UI: CartScreen.jsx  - UI components exist
└── API: Not connected

Needed:
✅ Connect to /cart/add endpoint
✅ Connect to /cart/listing endpoint
✅ Connect to /cart/delete endpoint
✅ Persist cart to user account (not device-only)
```

#### Search & Filtering
```
Current: SearchBar UI exists
├── Component: SearchBar.js exists
├── FilterBar.js exists
└── FilterBottomSheet.js exists

Needed:
✅ Connect to /product/search endpoint
✅ Connect to /shop with filter parameters
✅ Implement filter persistence
```

### 2.3 Not Yet Implemented Features ❌

#### Checkout & Payment
```
Files exist but no API:
├── CartScreen.jsx      - UI only
├── AddressStep.jsx     - UI only
├── PaymentStep.jsx     - UI only
└── SuccessStep.jsx     - UI only

Needed:
✅ /checkout endpoint
✅ /checkout/address/* endpoints
✅ /coupon-discount endpoint
✅ /order/submit endpoint
✅ Payment gateway integration
```

#### User Management
```
Missing:
✅ /order/list endpoint
✅ /order/details endpoint
✅ /order/review/add endpoint
✅ Profile edit integration
✅ Address management
```

#### Social Features
```
Missing:
✅ Reviews implementation (UI exists)
✅ Ratings system
✅ Wishlist sync to backend

Available:
✅ /order/review/add endpoint exists in API
✅ /favorite endpoints available
```

---

## 3. BabyAPI OVERVIEW

### Base Endpoints
```
Development:  http://192.168.0.108:2205/api/
Production:   https://project.spanchemicalsindia.com/digi/api/
```

### API Structure (28 Core Endpoints)

#### Authentication (4 endpoints)
- POST /sendOtp - Start registration
- POST /verifyOtp - Complete registration
- POST /login - User login
- POST /forgot-password - Password reset
- POST /google-login - Google authentication

#### Content (7 endpoints)
- GET /homedata - Home page content
- POST /categories - Product categories
- GET /brands - Available brands
- GET /sliders - Promotional banners
- GET /banners - Banner images
- GET /filter-listing - Filter options
- GET /panel-setting - App configuration

#### Product Browsing (4 endpoints)
- POST /shop - Browse/filter products
- POST /product/search - Search products
- POST /product/ - Product details
- GET /pages - Static pages (About, Terms, etc.)

#### Cart Operations (3 endpoints)
- POST /cart/add - Add to cart
- GET /cart/listing - View cart
- POST /cart/delete - Remove from cart

#### Checkout (5 endpoints)
- POST /checkout - Initiate checkout
- POST /checkout/address/add - Save address
- POST /checkout/address/apply - Select address
- GET /checkout/address/state - Get states
- GET /checkout/address/list - View addresses

#### Orders (4 endpoints)
- POST /order/submit - Place order
- GET /order/list - View orders
- POST /order/details - Order details
- POST /order/review/add - Add review

#### Favorites (2 endpoints)
- POST /favorite - Add/remove favorite
- GET /favorite/list - View favorites

#### Utilities (2 endpoints)
- POST /contact_us - Contact form
- GET /faqs - FAQ content

---

## 4. INTEGRATION STATUS MATRIX

### Authentication Integration

```
Endpoint              | Implemented | Connected | Tested
---------------------|-------------|-----------|--------
POST /sendOtp         | 🟡 Partial  | ❌ No    | ❌ No
POST /verifyOtp       | 🟡 Partial  | ❌ No    | ❌ No
POST /login           | ✅ Yes      | ✅ Yes   | ❌ No
POST /forgot-password | 🟡 Partial  | ❌ No    | ❌ No
POST /google-login    | ✅ Yes      | ✅ Yes   | ❌ No
```

### Content & Product Integration

```
Endpoint              | Implemented | Connected | Tested
---------------------|-------------|-----------|--------
GET /homedata         | ❌ No       | ❌ No    | ❌ No
POST /categories      | ❌ No       | ❌ No    | ❌ No
GET /brands           | ❌ No       | ❌ No    | ❌ No
POST /shop            | ❌ No       | ❌ No    | ❌ No
POST /product/search  | ❌ No       | ❌ No    | ❌ No
POST /product/        | ❌ No       | ❌ No    | ❌ No
```

### Cart & Checkout Integration

```
Endpoint                    | Implemented | Connected | Tested
----------------------------|-------------|-----------|--------
POST /cart/add              | ❌ No       | ❌ No    | ❌ No
GET /cart/listing           | ❌ No       | ❌ No    | ❌ No
POST /cart/delete           | ❌ No       | ❌ No    | ❌ No
POST /checkout              | ❌ No       | ❌ No    | ❌ No
POST /checkout/address/*    | ❌ No       | ❌ No    | ❌ No
POST /coupon-discount       | ❌ No       | ❌ No    | ❌ No
POST /order/submit          | ❌ No       | ❌ No    | ❌ No
```

---

## 5. DETAILED IMPROVEMENT RECOMMENDATIONS

### Phase 1: Foundation (Weeks 1-2) 🟢 HIGH PRIORITY

#### 1.1 Enhance API Service Layer

**Current Issue:** Basic fetch wrapper without error retry, interceptors, or logging

**Recommendation:**
```javascript
// Create: src/api/apiClient.js
// Features needed:
- ✅ Automatic token injection
- ✅ Error retry mechanism
- ✅ Request/response logging
- ✅ Error standardization
- ✅ Request timeout handling
- ✅ Concurrent request limiting

// Implementation:
export const createApiClient = () => {
  return {
    request: async (endpoint, options) => {
      // Add request interceptor
      // Add response interceptor
      // Handle token refresh
      // Log all requests/responses
      // Retry failed requests (max 3 times)
    }
  }
}
```

**Files to Create:**
- `src/api/apiClient.js` - Enhanced HTTP client
- `src/api/endpoints.js` - Centralized endpoint definitions
- `src/api/errorHandler.js` - Standardized error handling
- `src/utils/retryPolicy.js` - Retry logic

**Impact:** 
- Better error handling
- Easier debugging
- Consistent error format across app
- Automatic token refresh

---

#### 1.2 Implement Form Validation

**Current Issue:** SignUp and Login forms have minimal validation

**Recommendation:**
```javascript
// Create: src/utils/validators.js
export const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  password: (pwd) => pwd.length >= 6,
  phone: (phone) => /^\d{10}$/.test(phone),
  otp: (otp) => /^\d{6}$/.test(otp),
  // etc...
}

// Usage in screens:
const [errors, setErrors] = useState({});
const validateForm = () => {
  const newErrors = {};
  if (!validators.email(email)) newErrors.email = 'Invalid email';
  if (!validators.password(password)) newErrors.password = 'Min 6 chars';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}
```

**Files to Create:**
- `src/utils/validators.js` - Validation functions
- `src/hooks/useForm.js` - Form state hook

**Impact:**
- Better UX with real-time validation
- Prevent invalid API calls
- Consistent validation rules

---

#### 1.3 Create Service Layer for API Endpoints

**Current Issue:** No separation between API calls and UI components

**Recommendation:**
```javascript
// Create: src/api/services/
// ├── authService.js      - Auth endpoints
// ├── productService.js   - Product endpoints
// ├── cartService.js      - Cart endpoints
// ├── orderService.js     - Order endpoints
// ├── checkoutService.js  - Checkout endpoints
// └── favoriteService.js  - Favorite endpoints

// Example: src/api/services/authService.js
export const authService = {
  sendOtp: (email) => 
    api.post('/sendOtp', { email }),
    
  verifyOtp: (credentials) => 
    api.post('/verifyOtp', credentials),
    
  login: (credentials) => 
    api.post('/login', credentials),
    
  // ... etc
}

// Usage in Redux thunk:
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
```

**Files to Create:**
- `src/api/services/authService.js`
- `src/api/services/productService.js`
- `src/api/services/cartService.js`
- `src/api/services/orderService.js`
- `src/api/services/checkoutService.js`
- `src/api/services/favoriteService.js`

**Impact:**
- Cleaner code organization
- Easy to mock for testing
- Reusable across components
- Better maintainability

---

### Phase 2: Authentication Completion (Weeks 2-3) 🟡 HIGH PRIORITY

#### 2.1 Complete OTP Registration Flow

**Current:** Screens exist but not fully integrated

**Implementation Steps:**

```javascript
// 1. Update src/screens/Auth/SignUpScreen.jsx
- Implement sendOtp integration
- Show OTP input after email verification
- Implement verifyOtp with complete registration

// 2. Create proper state management
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.sendOtp(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(credentials);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, response.Data.token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.Data.user));
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message || 'OTP verification failed');
    }
  }
);

// 3. Add to authSlice.js
// Handle loading, error states for both thunks
// Store OTP sent status
// Handle OTP timeout (60 seconds)
```

**Checklist:**
- [ ] Implement sendOtp endpoint call
- [ ] Show loading state while sending
- [ ] Display OTP input screen conditionally
- [ ] Implement OTP resend logic (60 sec timer)
- [ ] Validate OTP format (6 digits)
- [ ] Call verifyOtp endpoint
- [ ] Handle errors (invalid OTP, expired OTP)
- [ ] Store token on success
- [ ] Navigate to home on success
- [ ] Add proper error messages to UI

---

#### 2.2 Add Password Reset Flow

**Current:** Screens exist but not connected

**Implementation:**

```javascript
// Create async thunk for forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

// Update ForgotPassScreen.jsx to call this
// Show success message after submission
```

**Checklist:**
- [ ] Implement forgot password screen
- [ ] Call /forgot-password endpoint
- [ ] Show success feedback
- [ ] Implement reset token handling
- [ ] Create set new password flow
- [ ] Validate new password
- [ ] Show confirmation

---

### Phase 3: Product Browsing Integration (Weeks 3-4) 🟠 CRITICAL

#### 3.1 Implement Home Screen Data

**Current:** Hardcoded banners and categories

**Changes Needed:**

```javascript
// File: src/screens/Home/HomeScreen.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeData } from '../../store/slices/productSlice';

export const HomeScreen = () => {
  const dispatch = useDispatch();
  const { homeData, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorComponent message={error} />;

  return (
    <ScrollView>
      {/* Render actual data from homeData */}
      <BannerCarousel banners={homeData?.sliders} />
      <FeaturedProducts products={homeData?.featured_products} />
      <Categories categories={homeData?.categories} />
      {/* ... more sections */}
    </ScrollView>
  );
};
```

**New Redux Slice:**

```javascript
// Create: src/store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../api/services/productService';

export const fetchHomeData = createAsyncThunk(
  'products/fetchHomeData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getHomeData();
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const productSlice = createSlice({
  name: 'products',
  initialState: {
    homeData: null,
    categories: [],
    brands: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.homeData = action.payload;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
```

**API Service Method:**

```javascript
// Add to src/api/services/productService.js
export const productService = {
  getHomeData: (store_id = 8) =>
    api.get(`/homedata?store_id=${store_id}`),
    
  getCategories: (params = {}) =>
    api.post('/categories', {
      device_id: deviceId,
      per_page: params.per_page || 20,
      isParent: params.isParent || '0',
    }),
    
  getBrands: () =>
    api.get('/brands'),
};
```

**Checklist:**
- [ ] Create productSlice with home data state
- [ ] Implement fetchHomeData async thunk
- [ ] Add to store/index.js
- [ ] Update HomeScreen to dispatch action
- [ ] Add loading/error states in UI
- [ ] Update banner carousel with real data
- [ ] Update featured products section
- [ ] Update categories section
- [ ] Handle API errors gracefully

---

#### 3.2 Implement Product Listing (Shop)

**Current:** CategoryProductsScreen shows dummy data

**Changes Needed:**

```javascript
// File: src/screens/Home/Category/CategoryProductsScreen.jsx
import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilters } from '../../../store/slices/productSlice';

export const CategoryProductsScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { categoryId } = route.params;
  
  const { products, loading, filters } = useSelector(state => state.products);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    // Fetch products for this category
    dispatch(fetchProducts({
      category_ids: [categoryId],
      page: 1,
      per_page: 20,
      sort_by: sortBy,
    }));
  }, [categoryId, sortBy]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts({
      ...newFilters,
      page: 1,
      per_page: 20,
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <SafeAreaView>
      <FilterBar onFiltersChange={handleFilterChange} />
      <SortOption value={sortBy} onChange={setSortBy} />
      <ProductGrid 
        products={products}
        onEndReached={loadMore}
      />
    </SafeAreaView>
  );
};
```

**Redux Updates:**

```javascript
// Add to productSlice.js
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await productService.shopProducts(filters);
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

// Add cases for pagination
// Handle filter state
```

**Checklist:**
- [ ] Implement fetchProducts async thunk
- [ ] Add filters state to productSlice
- [ ] Connect CategoryProductsScreen to Redux
- [ ] Implement sorting options
- [ ] Implement filtering UI
- [ ] Add pagination support
- [ ] Show product count
- [ ] Handle empty results

---

#### 3.3 Implement Product Details

**Current:** ProductDetailScreen UI exists but no API calls

**Changes Needed:**

```javascript
// File: src/screens/CommonScreen/ProductDetailScreen.jsx
export const ProductDetailScreen = ({ route, navigation }) => {
  const { productSlug, shopId } = route.params;
  const dispatch = useDispatch();
  const { productDetail, loading } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProductDetail({ slug: productSlug, shop_id: shopId }));
  }, [productSlug, shopId]);

  if (loading) return <LoadingSpinner />;
  if (!productDetail) return <ErrorComponent />;

  const handleAddToCart = (quantity) => {
    dispatch(addToCart({
      product_id: productDetail.id,
      shop_id: shopId,
      qty: quantity,
    })).then(() => {
      showSuccessToast('Added to cart');
    });
  };

  const handleAddToFavorite = () => {
    dispatch(toggleFavorite(productDetail.id));
  };

  return (
    <ScrollView>
      <ImageCarousel images={productDetail.images} />
      <ProductInfo product={productDetail} />
      <PriceSection price={productDetail.price} discount={productDetail.discount} />
      <RatingsSection 
        rating={productDetail.rating}
        reviews={productDetail.review_count}
      />
      <DescriptionSection description={productDetail.description} />
      <ReviewsSection reviews={productDetail.reviews} />
      <BottomBar 
        price={productDetail.price}
        onAddCart={handleAddToCart}
        onAddFavorite={handleAddToFavorite}
      />
    </ScrollView>
  );
};
```

**Redux Thunk:**

```javascript
export const fetchProductDetail = createAsyncThunk(
  'products/fetchProductDetail',
  async ({ slug, shop_id }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductDetail(slug, shop_id);
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);
```

**Checklist:**
- [ ] Implement fetchProductDetail thunk
- [ ] Update ProductDetailScreen component
- [ ] Display product images with carousel
- [ ] Show product details (name, price, description)
- [ ] Show ratings and reviews
- [ ] Implement quantity selector
- [ ] Add to cart button (working)
- [ ] Add to favorites button
- [ ] Show related products
- [ ] Handle out of stock

---

### Phase 4: Cart & Favorites Integration (Weeks 4-5) 🟠 CRITICAL

#### 4.1 Complete Cart Operations

**Current:** Redux cart state exists but not connected to API

**Changes Needed:**

```javascript
// Create: src/store/slices/cartSlice.js (enhanced)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../api/services/cartService';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCartList();
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ product_id, shop_id, qty }, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart({
        product_id,
        shop_id,
        qty,
        device_id: deviceId,
      });
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (cart_item_id, { rejectWithValue }) => {
    try {
      const response = await cartService.deleteFromCart(cart_item_id);
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

// Reducer
export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totals: { subtotal: 0, tax: 0, discount: 0, total: 0 },
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totals = action.payload.totals || {};
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totals = action.payload.totals;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totals = action.payload.totals;
      });
      // Add pending/rejected cases
  },
});
```

**Cart Service:**

```javascript
// Create: src/api/services/cartService.js
export const cartService = {
  getCartList: () =>
    api.get('/cart/listing'),
    
  addToCart: (data) =>
    api.post('/cart/add', data),
    
  deleteFromCart: (cart_item_id) =>
    api.post('/cart/delete', { cart_item_id }),
};
```

**Cart Screen Update:**

```javascript
// File: src/screens/Home/Cart/CartScreen.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeFromCart } from '../../../store/slices/cartSlice';

export const CartScreen = () => {
  const dispatch = useDispatch();
  const { items, totals, loading } = useSelector(state => state.cart);
  const isLoggedIn = useSelector(state => state.auth.token);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn]);

  const handleRemoveItem = (cart_item_id) => {
    dispatch(removeFromCart(cart_item_id));
  };

  if (!isLoggedIn) {
    return <LoginPrompt />;
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <SafeAreaView>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <CartItem 
            item={item}
            onRemove={handleRemoveItem}
          />
        )}
      />
      <PriceDetails totals={totals} />
      <CheckoutButton totals={totals} />
    </SafeAreaView>
  );
};
```

**Checklist:**
- [ ] Implement fetchCart thunk
- [ ] Implement addToCart thunk
- [ ] Implement removeFromCart thunk
- [ ] Update cartSlice with all cases
- [ ] Update CartScreen to fetch on mount
- [ ] Show loading states
- [ ] Display cart items properly
- [ ] Show price breakdown
- [ ] Handle empty cart
- [ ] Show login prompt if needed
- [ ] Implement quantity update

---

#### 4.2 Complete Favorites System

**Current:** Redux state exists but not connected to API

**Changes Needed:**

```javascript
// Create: src/store/slices/favoritesSlice.js (enhanced)
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoriteService.getFavoriteList();
      return response.Data || [];
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggle',
  async (product_id, { rejectWithValue }) => {
    try {
      const response = await favoriteService.toggleFavorite(product_id);
      return { product_id, success: response.success };
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

// Slice with reducers
export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    isFetched: false,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isFetched = true;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { product_id } = action.payload;
        const index = state.items.findIndex(item => item.id === product_id);
        if (index > -1) {
          state.items.splice(index, 1);
        } else {
          state.items.push({ id: product_id });
        }
      });
  },
});
```

**Favorite Service:**

```javascript
// Create: src/api/services/favoriteService.js
export const favoriteService = {
  getFavoriteList: () =>
    api.get('/favorite/list'),
    
  toggleFavorite: (product_id) =>
    api.post('/favorite', { product_id }),
};
```

**Usage in Components:**

```javascript
// Use hook to check if favorited
export const useFavorite = (productId) => {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.favorites);
  const isFavorited = items.some(item => item.id === productId);

  const toggle = () => {
    dispatch(toggleFavorite(productId));
  };

  return { isFavorited, toggle };
};

// In ProductCard or ProductDetail
const { isFavorited, toggle } = useFavorite(product.id);
return (
  <HeartButton 
    filled={isFavorited}
    onPress={toggle}
  />
);
```

**Checklist:**
- [ ] Implement fetchFavorites thunk
- [ ] Implement toggleFavorite thunk
- [ ] Create custom hook useFavorite
- [ ] Add heart button to ProductCard
- [ ] Add heart button to ProductDetail
- [ ] Create Favorites/Wishlist screen
- [ ] Show favorites count in tab
- [ ] Handle empty favorites

---

### Phase 5: Checkout & Orders (Weeks 5-6) 🔴 CRITICAL

#### 5.1 Complete Checkout Flow

**New Slice Needed:**

```javascript
// Create: src/store/slices/checkoutSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkoutService } from '../../api/services/checkoutService';

export const initiateCheckout = createAsyncThunk(
  'checkout/initiate',
  async ({ shop_id, delivery_type }, { rejectWithValue }) => {
    try {
      const response = await checkoutService.initiateCheckout({
        shop_id,
        delivery_type,
      });
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const fetchAddresses = createAsyncThunk(
  'checkout/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkoutService.getAddressList();
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const fetchStates = createAsyncThunk(
  'checkout/fetchStates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkoutService.getStates();
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const saveAddress = createAsyncThunk(
  'checkout/saveAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await checkoutService.addAddress(addressData);
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const applyAddress = createAsyncThunk(
  'checkout/applyAddress',
  async ({ user_address_id, is_remove }, { rejectWithValue }) => {
    try {
      const response = await checkoutService.applyAddress({
        user_address_id,
        is_remove,
      });
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const applyCoupon = createAsyncThunk(
  'checkout/applyCoupon',
  async ({ coupon_id, is_remove }, { rejectWithValue }) => {
    try {
      const response = await checkoutService.applyCoupon({
        coupon_id,
        is_remove,
      });
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const submitOrder = createAsyncThunk(
  'checkout/submitOrder',
  async ({ delivery_type, store_id }, { rejectWithValue }) => {
    try {
      const response = await checkoutService.submitOrder({
        delivery_type,
        store_id,
      });
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    checkoutData: null,
    addresses: [],
    selectedAddress: null,
    states: [],
    appliedCoupon: null,
    coupons: [],
    loading: false,
    error: null,
    orderPlaced: false,
    orderId: null,
  },
  reducers: {
    clearCheckout: (state) => {
      state.checkoutData = null;
      state.selectedAddress = null;
      state.appliedCoupon = null;
      state.orderPlaced = false;
    },
  },
  extraReducers: (builder) => {
    // Handle all async thunks
    builder
      .addCase(initiateCheckout.fulfilled, (state, action) => {
        state.checkoutData = action.payload;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.states = action.payload;
      })
      .addCase(saveAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.orderPlaced = true;
        state.orderId = action.payload.order_id;
      });
      // Add all pending/rejected cases
  },
});
```

**Checkout Service:**

```javascript
// Create: src/api/services/checkoutService.js
export const checkoutService = {
  initiateCheckout: (data) =>
    api.post('/checkout', data),
    
  getAddressList: () =>
    api.get('/checkout/address/list'),
    
  getStates: () =>
    api.get('/checkout/address/state'),
    
  addAddress: (data) =>
    api.post('/checkout/address/add', data),
    
  applyAddress: (data) =>
    api.post('/checkout/address/apply', data),
    
  applyCoupon: (data) =>
    api.post('/coupon-discount', data),
    
  submitOrder: (data) =>
    api.post('/order/submit', data),
};
```

**Checkout Screen (Stepper):**

```javascript
// Update: src/screens/Home/Cart/CartScreen.jsx or create CheckoutScreen.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const CheckoutScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Confirm
  const dispatch = useDispatch();
  
  const { 
    addresses, 
    selectedAddress, 
    appliedCoupon,
    checkoutData 
  } = useSelector(state => state.checkout);

  // Step 1: Address Selection
  const AddressStep = () => (
    <View>
      <Text>Select Delivery Address</Text>
      {addresses.map(addr => (
        <AddressCard 
          key={addr.id}
          address={addr}
          selected={selectedAddress?.id === addr.id}
          onSelect={() => applyAddressHandler(addr.id)}
        />
      ))}
      <AddNewAddressButton />
      <NextButton onPress={() => setCurrentStep(2)} />
    </View>
  );

  // Step 2: Payment & Coupon
  const PaymentStep = () => (
    <View>
      <Text>Order Summary</Text>
      <PriceBreakdown totals={checkoutData?.totals} />
      <CouponInput onApply={applyCouponHandler} />
      {appliedCoupon && <CouponBadge coupon={appliedCoupon} />}
      <PaymentMethodSelector />
      <NextButton onPress={() => setCurrentStep(3)} />
    </View>
  );

  // Step 3: Confirmation
  const ConfirmStep = () => (
    <View>
      <Text>Confirm Your Order</Text>
      <OrderSummary 
        address={selectedAddress}
        coupon={appliedCoupon}
        totals={checkoutData?.totals}
      />
      <ConfirmButton onPress={submitOrderHandler} />
    </View>
  );

  return (
    <SafeAreaView>
      <CheckoutStepper currentStep={currentStep} />
      {currentStep === 1 && <AddressStep />}
      {currentStep === 2 && <PaymentStep />}
      {currentStep === 3 && <ConfirmStep />}
    </SafeAreaView>
  );
};
```

**Checklist:**
- [ ] Create checkoutSlice with all thunks
- [ ] Create checkoutService with all endpoints
- [ ] Create multi-step checkout screen
- [ ] Implement address selection/add
- [ ] Implement coupon application
- [ ] Implement order submission
- [ ] Show order confirmation
- [ ] Navigate to order details on success

---

#### 5.2 Orders Management

**New Thunks:**

```javascript
// Add to store/slices/orderSlice.js (new)
export const fetchOrderList = createAsyncThunk(
  'orders/fetchList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderList();
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const fetchOrderDetail = createAsyncThunk(
  'orders/fetchDetail',
  async (order_id, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderDetail(order_id);
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'orders/addReview',
  async ({ product_id, rating, review }, { rejectWithValue }) => {
    try {
      const response = await orderService.addReview({
        product_id,
        rating,
        review,
      });
      return response.Data;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);
```

**Order Service:**

```javascript
// Create: src/api/services/orderService.js
export const orderService = {
  getOrderList: () =>
    api.get('/order/list'),
    
  getOrderDetail: (order_id) =>
    api.post('/order/details', { order_id }),
    
  addReview: (data) =>
    api.post('/order/review/add', data),
    
  getReviews: (params) =>
    api.post('/order/review/list', params),
};
```

**Order Screens:**

```javascript
// Update: src/screens/Home/Order/OrderScreen.jsx
export const OrderScreen = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrderList());
  }, []);

  return (
    <SafeAreaView>
      <FlatList
        data={orders}
        renderItem={({ item }) => (
          <OrderCard 
            order={item}
            onPress={() => navigateToDetail(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
};

// Create: src/screens/Home/Order/OrderDetailScreen.jsx
export const OrderDetailScreen = ({ route }) => {
  const { orderId } = route.params;
  const dispatch = useDispatch();
  const { orderDetail, loading } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetail(orderId));
  }, [orderId]);

  return (
    <ScrollView>
      <OrderHeader order={orderDetail} />
      <OrderItems items={orderDetail?.items} />
      <ShippingDetails address={orderDetail?.address} />
      <ReviewSection items={orderDetail?.items} />
    </ScrollView>
  );
};
```

**Checklist:**
- [ ] Create orderSlice with thunks
- [ ] Create orderService
- [ ] Update OrderScreen to fetch from API
- [ ] Update OrderDetailScreen
- [ ] Implement review submission
- [ ] Show rating stars
- [ ] Display review text
- [ ] Show review date

---

### Phase 6: Error Handling & Edge Cases (Week 6) 🟡 IMPORTANT

#### 6.1 Global Error Boundary

```javascript
// Create: src/components/ErrorBoundary.jsx
import React from 'react';
import { View, Text, Button } from 'react-native';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text>Something went wrong!</Text>
          <Button 
            title="Reload App" 
            onPress={() => this.setState({ hasError: false })}
          />
        </View>
      );
    }

    return this.props.children;
  }
}
```

#### 6.2 Network Error Handling

```javascript
// Enhance src/api/apiClient.js
const handleNetworkError = (error) => {
  if (!error.response) {
    return {
      type: 'NETWORK_ERROR',
      message: 'No internet connection. Please check your connection.',
      retryable: true,
    };
  }
  
  const status = error.response.status;
  
  if (status === 401) {
    // Handle token expiry - refresh or logout
    return {
      type: 'UNAUTHORIZED',
      message: 'Session expired. Please login again.',
      retryable: false,
    };
  }
  
  if (status === 422) {
    // Validation error
    return {
      type: 'VALIDATION_ERROR',
      message: error.response.data?.message || 'Invalid input',
      retryable: false,
      errors: error.response.data?.errors,
    };
  }
  
  if (status >= 500) {
    // Server error
    return {
      type: 'SERVER_ERROR',
      message: 'Server error. Please try again later.',
      retryable: true,
    };
  }
};
```

#### 6.3 Token Refresh Logic

```javascript
// Add to src/api/apiClient.js
export const createApiClient = () => {
  const handleResponse = async (response) => {
    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry original request
        return retryRequest(response.config);
      } else {
        // Redirect to login
        dispatch(logout());
      }
    }
    return response;
  };

  return {
    request: async (endpoint, options) => {
      // Add request interceptor
      // Add response interceptor with refresh logic
    }
  };
};
```

**Checklist:**
- [ ] Add error boundary at app root
- [ ] Implement network error detection
- [ ] Show appropriate error messages
- [ ] Implement retry logic
- [ ] Handle token expiration
- [ ] Redirect to login on 401
- [ ] Log errors to service
- [ ] Show user-friendly messages

---

### Phase 7: Testing & Optimization (Week 7) 🟡 IMPORTANT

#### 7.1 API Testing

```javascript
// Create: src/__tests__/api/authService.test.js
import { authService } from '../../api/services/authService';

describe('Auth Service', () => {
  it('should call /login endpoint with credentials', async () => {
    const mockResponse = { success: true, token: 'token123' };
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await authService.login({
      email: 'test@test.com',
      password: 'pass123',
    });

    expect(result).toEqual(mockResponse);
  });
});
```

#### 7.2 Performance Optimization

```javascript
// Use React.memo for ProductCard to prevent unnecessary re-renders
export const ProductCard = React.memo(({ product, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {/* Card content */}
    </TouchableOpacity>
  );
});

// Use useMemo for expensive computations
const filteredProducts = useMemo(
  () => products.filter(p => p.price <= maxPrice),
  [products, maxPrice]
);

// Implement FlatList pagination
<FlatList
  data={products}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>
```

#### 7.3 Caching Strategy

```javascript
// Create: src/utils/cache.js
export const cacheManager = {
  set: async (key, data, ttl = 3600000) => {
    await AsyncStorage.setItem(
      key,
      JSON.stringify({
        data,
        expiry: Date.now() + ttl,
      })
    );
  },
  
  get: async (key) => {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;
    
    const { data, expiry } = JSON.parse(cached);
    if (Date.now() > expiry) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return data;
  },
};
```

**Checklist:**
- [ ] Write unit tests for services
- [ ] Write integration tests for API calls
- [ ] Optimize component re-renders
- [ ] Implement list virtualization
- [ ] Add caching for frequently accessed data
- [ ] Profile app performance
- [ ] Optimize bundle size

---

## 6. PRIORITY TIMELINE

### Week 1-2: Foundation 🟢
```
[ ] Enhanced API client
[ ] Service layer creation
[ ] Form validation utilities
[ ] Error handling setup
```

### Week 2-3: Auth Completion 🟡
```
[ ] OTP registration flow
[ ] Password reset flow
[ ] Auth error handling
[ ] Session management
```

### Week 3-4: Product Browsing 🟠
```
[ ] Home screen data integration
[ ] Product listing with filters
[ ] Product details page
[ ] Search implementation
```

### Week 4-5: Cart & Favorites 🟠
```
[ ] Cart operations (add, remove, update)
[ ] Cart persistence
[ ] Favorites system
[ ] Wishlist features
```

### Week 5-6: Checkout & Orders 🔴
```
[ ] Address management
[ ] Checkout flow
[ ] Order placement
[ ] Order tracking
```

### Week 6-7: Polish 🟡
```
[ ] Error handling
[ ] Performance optimization
[ ] Testing
[ ] Code review & cleanup
```

---

## 7. IMPLEMENTATION CHECKLIST

### API Service Layer
```
[ ] Create apiClient.js with retry logic
[ ] Create endpoints.js with all URLs
[ ] Create error handler
[ ] Create services:
  [ ] authService.js
  [ ] productService.js
  [ ] cartService.js
  [ ] checkoutService.js
  [ ] orderService.js
  [ ] favoriteService.js
```

### Redux Slices
```
[ ] Enhance authSlice with all thunks
[ ] Create productSlice
[ ] Enhance cartSlice
[ ] Enhance favoritesSlice
[ ] Create checkoutSlice
[ ] Create orderSlice
```

### Screens to Update
```
[ ] SignUpScreen - OTP flow
[ ] LoginScreen - Complete
[ ] HomeScreen - Real data
[ ] CategoryProductsScreen - Filters
[ ] ProductDetailScreen - Full details
[ ] CartScreen - Real cart
[ ] CheckoutScreen - Multi-step
[ ] OrderScreen - Order list
[ ] OrderDetailScreen - Order details
[ ] ProfileScreen - Address management
```

### Components to Fix
```
[ ] ProductCard - Add to favorites heart
[ ] ProductGrid - Handle real data
[ ] FilterBar - Connect to filters
[ ] SearchBar - Connect to search API
[ ] CartItem - Update quantity
[ ] AddressForm - Validation
```

### Utilities to Create
```
[ ] src/utils/validators.js
[ ] src/utils/cache.js
[ ] src/utils/storage.js
[ ] src/utils/deviceId.js
[ ] src/hooks/useForm.js
[ ] src/hooks/useFavorite.js
[ ] src/hooks/useCart.js
```

---

## 8. COMMON ISSUES & SOLUTIONS

### Issue: Token Not Persisting
**Solution:** Ensure AsyncStorage is properly initialized before making API calls
```javascript
useEffect(() => {
  // Restore token from storage on app launch
  AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN).then(token => {
    if (token) {
      dispatch(validateToken(token));
    }
  });
}, []);
```

### Issue: Cart Emptying After Logout
**Solution:** Clear cart state on logout
```javascript
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    dispatch(clearCart());
    return null;
  }
);
```

### Issue: Slow Product Loading
**Solution:** Implement pagination and lazy loading
```javascript
<FlatList
  data={products}
  onEndReached={loadMoreProducts}
  onEndReachedThreshold={0.5}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
/>
```

### Issue: Filters Not Applying
**Solution:** Ensure filters are reset when navigating to new category
```javascript
useFocusEffect(
  useCallback(() => {
    dispatch(resetFilters());
  }, [])
);
```

---

## 9. SUCCESS METRICS

Track these metrics as you implement:

| Metric | Target | Current |
|--------|--------|---------|
| Auth Tests Passing | 100% | - |
| API Integration | 100% | 20% |
| Error Handling | 100% | 30% |
| Code Coverage | >80% | - |
| App Performance | <200ms API calls | - |
| Bundle Size | <30MB | - |
| Crash Rate | 0% | - |

---

## 10. NEXT STEPS

1. **Start Phase 1:** Enhance API client and create service layer
2. **Complete Auth:** Finish OTP and password reset
3. **Implement Core Features:** Home, products, cart
4. **Add Checkout:** Address, payment, orders
5. **Polish & Deploy:** Testing, optimization, release

---

## 📞 Quick Reference Commands

```bash
# Check current git status
git status

# View staging area
git diff --staged

# Commit progress
git commit -m "Integrated auth endpoints"

# Test build
npm run android
# or
npm run ios

# Run tests
npm test

# Lint code
npm run lint
```

---

**Document Generated:** January 12, 2026  
**Project Status:** Ready for Phase 1 implementation  
**Estimated Completion:** 7-8 weeks with consistent effort

---

## Summary

The DigiFashion project has a solid foundation with Redux, navigation, and component structure already in place. The main work now is to:

1. **Connect all screens to the BabyAPI** - Most of the heavy lifting
2. **Implement proper error handling** - Critical for UX
3. **Add form validation** - Prevent bad data
4. **Optimize performance** - Ensure smooth user experience
5. **Test thoroughly** - Catch issues early

With this phased approach and clear implementation guidelines, you can systematically integrate the complete BabyAPI and build a fully functional e-commerce app.

**Focus on Phase 1 & 2 first to get the foundation solid, then scale through Phases 3-7.**

Good luck with development! 🚀
