# API Services Architecture & Flow Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture Layers](#architecture-layers)
3. [Core API Infrastructure](#core-api-infrastructure)
4. [Service Layer Organization](#service-layer-organization)
5. [State Management Integration](#state-management-integration)
6. [Data Flow Patterns](#data-flow-patterns)
7. [Error Handling Strategy](#error-handling-strategy)
8. [Caching & Optimization](#caching--optimization)
9. [Best Practices](#best-practices)

---

## Overview

The DigiFashion project implements a **layered API architecture** that separates concerns across multiple levels:

- **API Layer**: Low-level HTTP communication
- **Service Layer**: Domain-specific API operations
- **State Management Layer**: Redux integration with async thunks
- **Hook Layer**: React component interface
- **UI Layer**: Component consumption

This architecture ensures:
- ✅ **Separation of Concerns**: Each layer has a single responsibility
- ✅ **Reusability**: Services and hooks can be reused across components
- ✅ **Testability**: Each layer can be tested independently
- ✅ **Maintainability**: Changes in one layer don't cascade to others
- ✅ **Type Safety**: Consistent data structures across layers

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    UI Components                        │
│              (Screens, Components)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Custom Hooks Layer                     │
│   (useCart, useFavorites, useCheckout, useOrders)      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Redux State Management                     │
│        (Slices with AsyncThunks)                        │
│   authSlice, cartSlice, favoritesSlice, uiSlice        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Service Layer                          │
│  categoryService, productService, checkoutService,      │
│  orderService, miscService                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Core API Layer                          │
│        (index.js - Axios Instance)                      │
│        (apiService.js - Fetch Wrapper)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend API                            │
│     https://project.spanchemicalsindia.com/digi/api/    │
└─────────────────────────────────────────────────────────┘
```

---

## Core API Infrastructure

### 1. **Dual API Client Approach**

The project uses **two complementary API clients**:

#### **A. Axios-based Client** (`src/api/index.js`)
- Used primarily for **Redux integration**
- Provides interceptor-based authentication
- Automatic error transformation

```javascript
// Configuration
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});
```

**Key Features:**
- **Request Interceptor**: Automatically injects Bearer token from AsyncStorage
- **Response Interceptor**: Handles logical errors (Status 400/500 in response body)
- **Error Enhancement**: Enriches errors with status codes and data

#### **B. Fetch-based Client** (`src/api/apiService.js`)
- Used for **direct service calls**
- Better FormData handling
- More granular control

```javascript
const apiRequest = async (endpoint, options = {}) => {
    // Handles both JSON and FormData
    // Automatic token injection
    // Comprehensive error handling
}

export const api = {
    get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body }),
    put: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
    delete: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};
```

**Key Features:**
- **Smart Body Handling**: Detects FormData vs JSON automatically
- **Performance Logging**: Tracks request duration
- **Token Management**: Reads from AsyncStorage on every request

---

### 2. **Centralized Endpoint Management** (`src/api/endpoints.js`)

All API endpoints are defined in a single constants file:

```javascript
export const API_ENDPOINTS = {
    // Authentication
    LOGIN: 'login',
    LOGOUT: 'logout',
    SEND_OTP: 'sendOtp',
    VERIFY_OTP: 'verifyOtp',
    GOOGLE_LOGIN: 'google-login',
    
    // Products & Categories
    HOME_DATA: 'homedata',
    CATEGORIES: 'categories',
    SHOP: 'shop',
    PRODUCT_DETAILS: 'product/',
    
    // Cart Management
    CART_LIST: 'cart/listing',
    CART_ADD: 'cart/add',
    CART_DELETE: 'cart/delete',
    
    // Favorites
    FAVORITE_TOGGLE: 'favorite',
    FAVORITE_LIST: 'favorite/list',
    
    // Checkout & Orders
    CHECKOUT: 'checkout',
    ADDRESS_LIST: 'checkout/address/list',
    ORDER_SUBMIT: 'order/submit',
    // ... more endpoints
};
```

**Benefits:**
- Single source of truth for all endpoints
- Easy to update when backend changes
- Prevents typos and inconsistencies
- Enables IDE autocomplete

---

### 3. **Server Health Monitoring** (`src/api/serverHealth.js`)

Proactive server availability checking:

```javascript
export const checkServerHealth = async (timeout = 5000) => {
    // Returns: { isAlive, responseTime, status }
}

export const wakeUpServer = () => {
    // Async ping to wake up sleeping servers
}
```

**Use Cases:**
- Pre-flight checks before critical operations
- User feedback for slow/down servers
- Wake-up calls for serverless backends

---

## Service Layer Organization

Each service module encapsulates domain-specific API operations:

### **1. Category Service** (`src/api/categoryService.js`)

```javascript
export const categoryService = {
    getCategories: async (params = {}) => {
        const body = {
            device_id: params.device_id || 'UP1A.231005.007',
            per_page: params.per_page || 20,
            isParent: params.isParent || "0",
        };
        return await api.post(API_ENDPOINTS.CATEGORIES, body);
    }
};
```

**Responsibilities:**
- Fetch product categories
- Handle pagination
- Filter parent/child categories

---

### **2. Product Service** (`src/api/productService.js`)

```javascript
export const productService = {
    getProducts: async (params = {}) => {
        // Supports: pagination, filtering, sorting, search
        // Handles category_ids array normalization
    },
    
    getProductDetails: async (slug, shop_id = 1) => {
        // Fetch single product by slug
    },
    
    getFilters: async () => {
        // Get available filter options (brands, price ranges)
    }
};
```

**Key Features:**
- **Smart Parameter Handling**: Normalizes category_ids to array
- **Error Suppression**: Silences predictable "No Data" errors
- **Default Values**: Provides sensible defaults for all parameters

---

### **3. Checkout Service** (`src/api/checkoutService.js`)

```javascript
export const checkoutService = {
    getAddresses: async () => { /* ... */ },
    saveAddress: async (addressData) => { /* ... */ },
    applyAddress: async (addressId, isRemove = false) => { /* ... */ },
    initiateCheckout: async (checkoutData) => { /* ... */ },
    getCoupons: async () => { /* ... */ },
    applyCoupon: async (couponId, isRemove = false) => { /* ... */ }
};
```

**Responsibilities:**
- Address management (CRUD operations)
- Coupon application/removal
- Checkout initialization

---

### **4. Order Service** (`src/api/orderService.js`)

```javascript
export const orderService = {
    getOrders: async () => { /* Get all user orders */ },
    getOrderDetails: async (orderId) => { /* Get specific order */ },
    submitOrder: async (orderData) => { /* Submit final order */ },
    addReview: async (reviewData) => { /* Submit product review */ },
    getReviews: async (params) => { /* Get product reviews */ }
};
```

---

### **5. Misc Service** (`src/api/miscService.js`)

```javascript
export const miscService = {
    getFaqs: async () => { /* ... */ },
    getPages: async () => { /* Static pages */ },
    contactUs: async (data) => { /* Contact form submission */ }
};
```

---

## State Management Integration

### **Redux Slice Pattern**

Each Redux slice follows a consistent pattern:

```javascript
// 1. Define AsyncThunks
export const fetchData = createAsyncThunk(
    'domain/fetchData',
    async (params, { rejectWithValue }) => {
        try {
            const data = await serviceMethod(params);
            return data;
        } catch (error) {
            return rejectWithValue(error.data || { message: error.message });
        }
    }
);

// 2. Define Initial State
const initialState = {
    items: [],
    isLoading: false,
    error: null,
};

// 3. Create Slice
const domainSlice = createSlice({
    name: 'domain',
    initialState,
    reducers: {
        // Synchronous actions
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message;
            });
    }
});
```

---

### **Example: Auth Slice** (`src/store/slices/authSlice.js`)

**AsyncThunks:**
- `login`: Email/password authentication
- `googleLogin`: Google OAuth authentication
- `sendOtp`: Request OTP for email verification
- `verifyOtp`: Verify OTP and register user

**Key Features:**
1. **Token Persistence**: Automatically saves token to AsyncStorage
2. **User Data Caching**: Stores user object for offline access
3. **Error Normalization**: Consistent error message extraction
4. **FormData Support**: Uses FormData for OTP endpoints

**Flow Example:**
```javascript
// User initiates login
dispatch(login({ email, password }))

// AsyncThunk executes:
// 1. Calls api.post(API_ENDPOINTS.LOGIN, credentials)
// 2. Extracts token and user from response
// 3. Saves to AsyncStorage
// 4. Returns data to reducer

// Reducer updates state:
// - Sets token and user
// - Clears loading state
// - Handles errors if any
```

---

### **Example: Cart Slice** (`src/store/slices/cartSlice.js`)

**AsyncThunks:**
- `fetchCart`: Get current cart items
- `addToCartAsync`: Add product to cart
- `removeFromCartAsync`: Remove item from cart
- `updateQuantityAsync`: Update item quantity

**Key Pattern - Refresh After Mutation:**
```javascript
export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, shopId, qty, deviceId, color, size }, { dispatch }) => {
        const response = await api.post('cart/add', {
            product_id: productId,
            shop_id: shopId,
            qty: qty,
            device_id: deviceId,
            color: color,
            size: size
        });
        
        // Automatically refresh cart after mutation
        dispatch(fetchCart());
        
        return response;
    }
);
```

**Benefits:**
- Always shows latest cart state
- Prevents stale data issues
- Server is source of truth

---

### **Example: Favorites Slice** (`src/store/slices/favoritesSlice.js`)

**Optimistic UI Updates:**

```javascript
export const toggleFavoriteAsync = createAsyncThunk(
    'favorites/toggleFavorite',
    async (productId, { dispatch, rejectWithValue }) => {
        const normalizedId = Number(productId);
        
        try {
            await api.post(API_ENDPOINTS.FAVORITE_TOGGLE, { product_id: normalizedId });
            
            // No fetchFavorites() call - optimistic update in reducer
            return normalizedId;
        } catch (error) {
            // Handle "Duplicate entry" as soft success
            if (error.message.includes('Duplicate entry')) {
                return normalizedId;
            }
            return rejectWithValue(error.data);
        }
    }
);

// Reducer handles optimistic toggle
.addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
    const productId = Number(action.payload);
    const idx = state.favoriteIds.indexOf(productId);
    
    if (idx === -1) {
        state.favoriteIds.push(productId); // Add
    } else {
        state.favoriteIds.splice(idx, 1); // Remove
        state.items = state.items.filter(item => Number(item.id) !== productId);
    }
})
```

**Key Features:**
- **Optimistic Updates**: UI updates immediately without waiting for server
- **Duplicate Handling**: Treats "already favorited" as success
- **ID Normalization**: Converts all IDs to numbers for consistency
- **Logout Cleanup**: Clears favorites on auth/logout action

---

## Data Flow Patterns

### **Pattern 1: Standard Fetch Flow**

```
User Action (Click)
    ↓
Component calls hook method
    ↓
Hook dispatches Redux AsyncThunk
    ↓
AsyncThunk calls Service method
    ↓
Service calls API client
    ↓
API client makes HTTP request
    ↓
Response flows back up
    ↓
Redux state updated
    ↓
Component re-renders with new data
```

**Example:**
```javascript
// Component
const { refreshCart } = useCart();
useEffect(() => {
    refreshCart();
}, []);

// Hook (useCart.js)
const refreshCart = useCallback(() => {
    return dispatch(fetchCart());
}, [dispatch]);

// Redux Slice (cartSlice.js)
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async () => {
        const response = await api.get('cart/listing');
        return response.Data || response.data || [];
    }
);
```

---

### **Pattern 2: Mutation with Auto-Refresh**

```
User Action (Add to Cart)
    ↓
Component calls addToCart hook
    ↓
AsyncThunk executes mutation
    ↓
On success, dispatches fetchCart()
    ↓
Cart state refreshed from server
    ↓
UI updates with latest cart
```

**Benefits:**
- Server is always source of truth
- No manual state synchronization
- Handles concurrent mutations gracefully

---

### **Pattern 3: Optimistic Updates**

```
User Action (Toggle Favorite)
    ↓
Immediately update local state
    ↓
Make API call in background
    ↓
If success: keep optimistic update
If failure: revert state
```

**Use Cases:**
- Favorite/like buttons
- Quick toggles
- Actions where instant feedback matters

---

### **Pattern 4: Cached Data with Stale-While-Revalidate**

```
Component mounts
    ↓
Check AsyncStorage for cached data
    ↓
If found: Display cached data immediately
    ↓
Fetch fresh data from API in background
    ↓
Update cache and UI when fresh data arrives
```

**Implementation** (`src/utils/storage.js`):
```javascript
export const storage = {
    setItem: async (key, value) => {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await AsyncStorage.setItem(key, stringValue);
    },
    
    getItem: async (key) => {
        const value = await AsyncStorage.getItem(key);
        if (!value) return null;
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
};
```

**Used for:**
- Home screen data (`CACHE_HOME_DATA`)
- Filter options (`CACHE_FILTERS`)

---

## Error Handling Strategy

### **Multi-Layer Error Handling**

#### **Layer 1: API Client Level**

**Axios Interceptor** (`src/api/index.js`):
```javascript
api.interceptors.response.use(
    (response) => {
        const data = response.data;
        
        // Check for logical errors in response body
        const logicalErrorCode = data?.Status || data?.status;
        if (logicalErrorCode === 400 || logicalErrorCode === 500 || data?.success === false) {
            const error = new Error(data.Message || data.message || 'API request failed');
            error.status = logicalErrorCode;
            error.data = data;
            return Promise.reject(error);
        }
        
        return data;
    },
    (error) => {
        // Handle HTTP errors (401, 404, 500, etc.)
        if (error.response) {
            const { status, data } = error.response;
            const message = data?.Message || data?.message || 'Something went wrong';
            const enhancedError = new Error(message);
            enhancedError.status = status;
            enhancedError.data = data;
            return Promise.reject(enhancedError);
        }
        return Promise.reject(error);
    }
);
```

**Fetch Wrapper** (`src/api/apiService.js`):
```javascript
const response = await fetch(url, options);
const data = await response.json();

// Check both HTTP status and logical status
const logicalErrorCode = data?.Status || data?.status;
if (!response.ok || logicalErrorCode === 400 || logicalErrorCode === 500) {
    const error = new Error(data.Message || data.message || 'Verification failed');
    error.status = response.status || logicalErrorCode;
    error.data = data;
    throw error;
}
```

---

#### **Layer 2: Service Level**

Services can add domain-specific error handling:

```javascript
export const productService = {
    getProducts: async (params = {}) => {
        try {
            const response = await api.post(API_ENDPOINTS.SHOP, body);
            return response;
        } catch (error) {
            // Suppress predictable errors
            if (error.message !== 'Shop Data not found') {
                console.error('Error fetching products:', error);
            }
            throw error;
        }
    }
};
```

---

#### **Layer 3: Redux AsyncThunk Level**

```javascript
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await api.post(API_ENDPOINTS.LOGIN, credentials);
            return data;
        } catch (error) {
            const errorData = error.data || {};
            let message = errorData.Message || errorData.message || error.message || 'Login failed';
            
            // Extract nested validation errors
            if (errorData.Data && typeof errorData.Data === 'object') {
                const details = Object.values(errorData.Data).flat().join(' ');
                if (details) message = `${message}: ${details}`;
            }
            
            return rejectWithValue({ ...errorData, message });
        }
    }
);
```

---

#### **Layer 4: Component Level**

Components can access error state from Redux:

```javascript
const { error, isLoading } = useSelector(state => state.auth);

{error && <Text style={styles.error}>{error}</Text>}
```

---

### **Error Message Normalization**

The project handles multiple error response formats:

```javascript
// Format 1: { Message: "Error text" }
// Format 2: { message: "Error text" }
// Format 3: { Data: { email: ["Invalid email"] } }
// Format 4: { error: "Error text" }

// Unified extraction:
const message = 
    errorData.Message || 
    errorData.message || 
    error.message || 
    'Default error message';
```

---

## Caching & Optimization

### **1. AsyncStorage Caching**

**Storage Keys** (`src/constants/index.js`):
```javascript
export const STORAGE_KEYS = {
    USER_TOKEN: 'userToken',
    USER_DATA: 'userData',
    CACHE_HOME_DATA: 'cache_home_data',
    CACHE_FILTERS: 'cache_filters',
};
```

**Usage Pattern:**
```javascript
// Save to cache
await storage.setItem(STORAGE_KEYS.CACHE_HOME_DATA, homeData);

// Read from cache
const cachedData = await storage.getItem(STORAGE_KEYS.CACHE_HOME_DATA);
if (cachedData) {
    // Use cached data immediately
    displayData(cachedData);
}

// Fetch fresh data in background
const freshData = await api.get('homedata');
await storage.setItem(STORAGE_KEYS.CACHE_HOME_DATA, freshData);
displayData(freshData);
```

---

### **2. Redux State Persistence**

**Token Restoration on App Launch:**
```javascript
// On app startup
const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

if (token && userData) {
    dispatch(restoreToken({ token, user: JSON.parse(userData) }));
}
```

---

### **3. Memoization in Hooks**

**useCart Hook** (`src/hooks/useCart.js`):
```javascript
export const useCart = () => {
    const dispatch = useDispatch();
    const { items, isLoading, error } = useSelector((state) => state.cart, shallowEqual);
    
    // Memoize callbacks to prevent unnecessary re-renders
    const addToCart = useCallback((productInfo) => {
        return dispatch(addToCartAsync(productInfo));
    }, [dispatch]);
    
    const calculateTotal = useCallback(() => {
        return items.reduce((total, item) => {
            const price = parseFloat(item.product_price || item.price) || 0;
            const quantity = parseInt(item.qty || item.quantity, 10) || 1;
            return total + (price * quantity);
        }, 0);
    }, [items]);
    
    // Return memoized object
    return useMemo(() => ({
        cartItems: items,
        isLoading,
        error,
        addToCart,
        calculateTotal,
    }), [items, isLoading, error, addToCart, calculateTotal]);
};
```

**Benefits:**
- Prevents unnecessary re-renders
- Stable function references
- Optimized dependency tracking

---

### **4. Selective Re-rendering with shallowEqual**

```javascript
const { items, isLoading } = useSelector((state) => state.cart, shallowEqual);
```

Only re-renders when `items` or `isLoading` actually change (shallow comparison).

---

## Best Practices

### **1. Consistent Naming Conventions**

| Layer | Pattern | Example |
|-------|---------|---------|
| **Endpoints** | SCREAMING_SNAKE_CASE | `CART_ADD`, `FAVORITE_TOGGLE` |
| **Services** | camelCase with domain prefix | `categoryService`, `productService` |
| **AsyncThunks** | camelCase with action suffix | `fetchCart`, `addToCartAsync` |
| **Hooks** | camelCase with `use` prefix | `useCart`, `useFavorites` |
| **Redux Actions** | camelCase | `clearCart`, `toggleFavorite` |

---

### **2. Parameter Normalization**

Always normalize IDs and arrays:

```javascript
// Convert to Number for API consistency
const normalizedId = Number(productId);

// Ensure array format
if (params.category_ids && !Array.isArray(params.category_ids)) {
    body.category_ids = [params.category_ids];
}
```

---

### **3. Default Values**

Provide sensible defaults for all parameters:

```javascript
const body = {
    per_page: params.per_page || 20,
    page: params.page || 1,
    store_id: params.store_id || 1,
    device_id: params.device_id || 'UP1A.231005.007',
};
```

---

### **4. Error Suppression for Expected Errors**

```javascript
catch (error) {
    // Don't log predictable "No Data" errors
    if (error.message !== 'Shop Data not found') {
        console.error('Error fetching products:', error);
    }
    throw error;
}
```

---

### **5. Automatic Cleanup on Logout**

```javascript
// In favoritesSlice.js
extraReducers: (builder) => {
    builder
        // ... other cases
        .addCase('auth/logout', (state) => {
            state.favoriteIds = [];
            state.items = [];
            state.error = null;
        });
}
```

---

### **6. FormData for File Uploads**

```javascript
const formData = new FormData();
formData.append('email', email);
formData.append('otp', otp);

// API client auto-detects FormData and skips JSON.stringify
const response = await api.post(API_ENDPOINTS.VERIFY_OTP, formData);
```

---

### **7. Robust Response Extraction**

Handle multiple response formats:

```javascript
// Try multiple possible locations
const token = 
    data.Data?.token || 
    data.token || 
    data.access_token;

const items = 
    response?.Data || 
    response?.data || 
    [];
```

---

### **8. Loading State Management**

Always track loading state for better UX:

```javascript
.addCase(fetchCart.pending, (state) => {
    state.isLoading = true;
})
.addCase(fetchCart.fulfilled, (state, action) => {
    state.isLoading = false;
    state.items = action.payload;
})
.addCase(fetchCart.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
})
```

---

### **9. Server Health Checks**

Use health checks before critical operations:

```javascript
const health = await checkServerHealth();
if (!health.isAlive) {
    showAlert('Server is currently unavailable. Please try again later.');
    return;
}
```

---

### **10. Centralized Constants**

Never hardcode values:

```javascript
// ❌ Bad
const response = await fetch('https://api.example.com/cart/add');

// ✅ Good
const response = await api.post(API_ENDPOINTS.CART_ADD, data);
```

---

## ⚠️ Risks, Bad Practices & Code Quality Issues

This section identifies **critical risks**, **bad practices**, and **duplications** found in the current API architecture. Addressing these issues will improve security, maintainability, and reliability.

---

### **🔴 CRITICAL RISKS**

#### **1. Hardcoded Production URL**

**Location**: `src/constants/index.js`

```javascript
export const BASE_URL = 'https://project.spanchemicalsindia.com/digi/api/';
```

**Risk Level**: 🔴 **CRITICAL**

**Issues**:
- ❌ No environment-based configuration (dev/staging/production)
- ❌ Cannot switch between environments without code changes
- ❌ Makes testing and development difficult
- ❌ Violates 12-factor app principles

**Impact**:
- Developers must modify source code to test against different environments
- Risk of accidentally deploying with wrong API URL
- Cannot use local development servers
- Difficult to run automated tests

**Recommended Fix**:
```javascript
// Use environment variables
const ENV = process.env.NODE_ENV || 'development';

const API_URLS = {
    development: 'http://localhost:3000/api/',
    staging: 'https://staging.spanchemicalsindia.com/digi/api/',
    production: 'https://project.spanchemicalsindia.com/digi/api/',
};

export const BASE_URL = API_URLS[ENV] || API_URLS.production;

// Or use react-native-config for better environment management
```

---

#### **2. Unhandled AsyncStorage Promises in Logout**

**Location**: `src/store/slices/authSlice.js` (lines 175-176)

```javascript
logout: (state) => {
    state.token = null;
    state.user = null;
    state.otpSent = false;
    state.receivedOtp = null;
    AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);  // ❌ Not awaited
    AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);   // ❌ Not awaited
},
```

**Risk Level**: 🔴 **HIGH**

**Issues**:
- ❌ AsyncStorage operations are not awaited
- ❌ Logout may complete before storage is cleared
- ❌ User may be logged out in UI but token still exists in storage
- ❌ Potential race condition if user logs in immediately after logout

**Impact**:
- User appears logged out but token persists
- Next app launch may auto-login with stale credentials
- Security risk: sensitive data may remain in storage

**Recommended Fix**:
```javascript
// Convert to async thunk
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
            await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
            // Also clear cache
            await AsyncStorage.removeItem(STORAGE_KEYS.CACHE_HOME_DATA);
            await AsyncStorage.removeItem(STORAGE_KEYS.CACHE_FILTERS);
            return true;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Or use storage utility
logout: async (state) => {
    state.token = null;
    state.user = null;
    await storage.removeItem(STORAGE_KEYS.USER_TOKEN);
    await storage.removeItem(STORAGE_KEYS.USER_DATA);
},
```

---

#### **3. No Token Expiration Handling**

**Risk Level**: 🔴 **HIGH**

**Issues**:
- ❌ No JWT expiration checking
- ❌ No automatic token refresh mechanism
- ❌ No handling of 401 Unauthorized responses globally
- ❌ Users may use expired tokens indefinitely

**Impact**:
- Security vulnerability: expired tokens remain valid in app
- Poor UX: API calls fail with cryptic errors
- No automatic re-authentication flow

**Recommended Fix**:
```javascript
// Add to axios interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // Clear auth state and redirect to login
            store.dispatch(logout());
            // Navigate to login screen
            navigationRef.navigate('Login');
            
            return Promise.reject(new Error('Session expired. Please login again.'));
        }
        
        return Promise.reject(error);
    }
);
```

---

#### **4. No Request Timeout Configuration**

**Risk Level**: 🟡 **MEDIUM**

**Issues**:
- ❌ No timeout set for axios instance
- ❌ Requests may hang indefinitely
- ❌ Poor UX on slow/unstable networks

**Recommended Fix**:
```javascript
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});
```

---

### **🟠 BAD PRACTICES**

#### **1. Duplicate API_ENDPOINTS Definition**

**Locations**:
- `src/constants/index.js` (lines 15-20) - **Partial definition**
- `src/api/endpoints.js` (lines 1-47) - **Complete definition**

**Issue**: Same constant defined in two places with different content

```javascript
// src/constants/index.js
export const API_ENDPOINTS = {
    LOGIN: 'login',
    SEND_OTP: 'sendOtp',
    VERIFY_OTP: 'verifyOtp',
    GOOGLE_LOGIN: 'google-login',
};

// src/api/endpoints.js
export const API_ENDPOINTS = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    SEND_OTP: 'sendOtp',
    VERIFY_OTP: 'verifyOtp',
    GOOGLE_LOGIN: 'google-login',
    // ... 40+ more endpoints
};
```

**Problems**:
- ❌ Violates DRY (Don't Repeat Yourself) principle
- ❌ Confusing for developers: which one to use?
- ❌ Risk of inconsistency if one is updated but not the other
- ❌ Import confusion: some files import from `constants`, others from `api/endpoints`

**Impact**:
- Maintenance nightmare
- Potential bugs if definitions diverge
- Code smell indicating poor architecture

**Recommended Fix**:
```javascript
// DELETE from src/constants/index.js

// Keep ONLY in src/api/endpoints.js
// Update all imports to use:
import { API_ENDPOINTS } from '../api/endpoints';
```

---

#### **2. Inconsistent JSDoc Comments**

**Location**: `src/constants/index.js` (lines 9-14)

```javascript
/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
export const API_ENDPOINTS = {
    LOGIN: 'login',
    // ...
};
```

**Issues**:
- ❌ Copy-pasted JSDoc from a different context (book?)
- ❌ Misleading documentation
- ❌ Indicates lack of code review

**Recommended Fix**:
```javascript
/**
 * API endpoint constants for authentication
 * @deprecated Use API_ENDPOINTS from 'src/api/endpoints.js' instead
 */
```

---

#### **3. Dual API Client Confusion**

**Issue**: Two different API clients with similar names

```javascript
// src/api/index.js - Axios instance
import api from './index';

// src/api/apiService.js - Fetch wrapper
import { api } from './apiService';
```

**Problems**:
- ❌ Confusing naming: both called `api`
- ❌ No clear guidance on when to use which
- ❌ Different import patterns (default vs named)
- ❌ Inconsistent usage across codebase

**Current Usage**:
- Redux slices use `apiService.js` (fetch-based)
- Service files use `index.js` (axios-based)

**Recommended Fix**:
```javascript
// Rename for clarity
// src/api/axiosClient.js
export const axiosClient = axios.create({ /* ... */ });

// src/api/fetchClient.js
export const fetchClient = {
    get: (endpoint, options) => apiRequest(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => apiRequest(endpoint, { ...options, method: 'POST', body }),
    // ...
};

// Or consolidate to single client
```

---

#### **4. Commented-Out Code Pollution**

**Locations**:
- `src/api/apiService.js` - Multiple commented console.logs
- `src/store/slices/favoritesSlice.js` - Large commented-out function (lines 5-27)
- `src/store/slices/authSlice.js` - Commented debug logs throughout

**Example**:
```javascript
// console.log(`[API-STEP 1] Starting ${options.method || 'GET'} request for: ${endpoint}`);
// console.log(`[API-STEP 2] Request completed in ${duration}ms. Status: ${response.status}`);
// console.log(`[REDUX-STEP 1] login thunk started`, credentials.email);
```

**Issues**:
- ❌ Clutters codebase
- ❌ Makes code harder to read
- ❌ Should use proper logging library or remove entirely
- ❌ Indicates debugging code left in production

**Recommended Fix**:
```javascript
// Use a proper logging utility
import { logger } from '../utils/logger';

// With environment-based logging
if (__DEV__) {
    logger.debug(`[API] Starting ${method} request for: ${endpoint}`);
}

// Or use a library like react-native-logs
```

---

#### **5. Inconsistent Error Message Extraction**

**Issue**: Multiple different patterns for extracting error messages

```javascript
// Pattern 1
const message = errorData.Message || errorData.message || error.message || 'Login failed';

// Pattern 2
const message = data?.Message || data?.message || 'Something went wrong';

// Pattern 3
error.data?.Message || error.data?.message || error.message

// Pattern 4
action.payload?.Message || action.payload?.message || 'Failed'
```

**Problems**:
- ❌ Inconsistent across codebase
- ❌ Hard to maintain
- ❌ Easy to miss a case

**Recommended Fix**:
```javascript
// Create utility function
export const extractErrorMessage = (error, defaultMessage = 'An error occurred') => {
    return (
        error?.response?.data?.Message ||
        error?.response?.data?.message ||
        error?.data?.Message ||
        error?.data?.message ||
        error?.message ||
        defaultMessage
    );
};

// Use everywhere
const message = extractErrorMessage(error, 'Login failed');
```

---

#### **6. Magic Numbers and Strings**

**Examples**:
```javascript
// src/api/categoryService.js
device_id: params.device_id || 'UP1A.231005.007', // ❌ Magic string

// src/store/slices/cartSlice.js
const DEFAULT_DEVICE_ID = 'BE2A.250530.026.D1xx'; // ❌ Different default!

// src/api/productService.js
per_page: params.per_page || 20, // ❌ Magic number
store_id: params.store_id || 1,  // ❌ Magic number
```

**Issues**:
- ❌ Different default device IDs in different files
- ❌ No centralized configuration
- ❌ Hard to update globally

**Recommended Fix**:
```javascript
// src/constants/defaults.js
export const DEFAULT_VALUES = {
    DEVICE_ID: 'UP1A.231005.007',
    STORE_ID: 1,
    PER_PAGE: 20,
    PAGE: 1,
    REQUEST_TIMEOUT: 30000,
};

// Use everywhere
import { DEFAULT_VALUES } from '../constants/defaults';
device_id: params.device_id || DEFAULT_VALUES.DEVICE_ID,
```

---

#### **7. No Request Cancellation**

**Issue**: No AbortController usage for cancelling requests

**Problems**:
- ❌ Component unmounts but requests continue
- ❌ Memory leaks
- ❌ State updates on unmounted components
- ❌ Wasted bandwidth

**Recommended Fix**:
```javascript
// In hooks
useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
        try {
            const data = await api.get('endpoint', {
                signal: abortController.signal
            });
            setData(data);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
            }
        }
    };
    
    fetchData();
    
    return () => abortController.abort();
}, []);
```

---

#### **8. Inconsistent Response Data Extraction**

**Issue**: Multiple patterns for extracting data from responses

```javascript
// Pattern 1
const items = data.Data || data.data || [];

// Pattern 2
const token = data.Data?.token || data.token;

// Pattern 3
return response.Data || response.data || [];

// Pattern 4
const response = await api.get('cart/listing');
return response.Data || response.data || [];
```

**Problems**:
- ❌ Backend inconsistency not properly abstracted
- ❌ Repeated logic across files
- ❌ Easy to forget a case

**Recommended Fix**:
```javascript
// Create response normalizer
export const normalizeResponse = (response) => {
    return {
        data: response?.Data || response?.data || null,
        message: response?.Message || response?.message || '',
        status: response?.Status || response?.status || 200,
    };
};

// Use in interceptor
api.interceptors.response.use((response) => {
    return normalizeResponse(response.data);
});
```

---

### **🟡 CODE QUALITY ISSUES**

#### **1. No TypeScript or PropTypes**

**Issue**: No type checking anywhere in the codebase

**Problems**:
- ❌ No compile-time error detection
- ❌ Easy to pass wrong data types
- ❌ Poor IDE autocomplete
- ❌ Harder to refactor

**Recommended Fix**:
```javascript
// Add JSDoc type annotations at minimum
/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @param {LoginCredentials} credentials
 * @returns {Promise<{token: string, user: Object}>}
 */
export const login = async (credentials) => {
    // ...
};

// Or migrate to TypeScript
```

---

#### **2. No Request/Response Logging in Production**

**Issue**: All logging is commented out or console-based

**Problems**:
- ❌ No visibility into production issues
- ❌ Cannot debug user-reported errors
- ❌ No analytics on API performance

**Recommended Fix**:
```javascript
// Implement proper logging service
import analytics from '@react-native-firebase/analytics';

const logApiCall = async (endpoint, method, duration, status) => {
    await analytics().logEvent('api_call', {
        endpoint,
        method,
        duration,
        status,
    });
};
```

---

#### **3. No Retry Logic**

**Issue**: Failed requests are not automatically retried

**Problems**:
- ❌ Poor UX on unstable networks
- ❌ Transient errors cause permanent failures

**Recommended Fix**:
```javascript
// Add axios-retry
import axiosRetry from 'axios-retry';

axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
               error.response?.status === 429; // Rate limit
    },
});
```

---

#### **4. No Request Deduplication**

**Issue**: Multiple identical requests can be made simultaneously

**Problems**:
- ❌ Wasted bandwidth
- ❌ Unnecessary server load
- ❌ Race conditions

**Example Scenario**:
```javascript
// Component renders multiple times quickly
useEffect(() => {
    dispatch(fetchCart()); // Called 3 times in 100ms
}, [dispatch]);
```

**Recommended Fix**:
```javascript
// Implement request deduplication
const pendingRequests = new Map();

const dedupedRequest = async (key, requestFn) => {
    if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
    }
    
    const promise = requestFn();
    pendingRequests.set(key, promise);
    
    try {
        const result = await promise;
        return result;
    } finally {
        pendingRequests.delete(key);
    }
};
```

---

#### **5. No Rate Limiting Protection**

**Issue**: No client-side rate limiting

**Problems**:
- ❌ Can overwhelm backend
- ❌ May trigger server-side rate limits
- ❌ Poor battery life on mobile

**Recommended Fix**:
```javascript
// Implement debouncing for search
import { debounce } from 'lodash';

const debouncedSearch = debounce((query) => {
    dispatch(searchProducts(query));
}, 300);

// Implement throttling for scroll events
import { throttle } from 'lodash';

const throttledFetch = throttle(() => {
    dispatch(fetchMoreProducts());
}, 1000);
```

---

### **📊 DUPLICATION SUMMARY**

| Issue | Occurrences | Impact | Priority |
|-------|-------------|--------|----------|
| API_ENDPOINTS defined twice | 2 files | High | 🔴 Critical |
| Error message extraction | 15+ locations | Medium | 🟡 High |
| Response data extraction | 20+ locations | Medium | 🟡 High |
| Default device ID | 2 different values | Medium | 🟡 High |
| Console.log statements | 50+ commented | Low | 🟢 Low |
| Try-catch error handling | Every service | Low | 🟢 Low |

---

### **🎯 PRIORITY FIXES**

#### **Immediate (Week 1)**
1. ✅ Remove duplicate `API_ENDPOINTS` from `constants/index.js`
2. ✅ Fix async logout issue
3. ✅ Add environment-based BASE_URL configuration
4. ✅ Add 401 handling in axios interceptor

#### **Short-term (Week 2-3)**
5. ✅ Consolidate error message extraction
6. ✅ Centralize default values
7. ✅ Add request timeout
8. ✅ Remove commented code

#### **Medium-term (Month 1)**
9. ✅ Implement request retry logic
10. ✅ Add proper logging service
11. ✅ Implement request cancellation
12. ✅ Add request deduplication

#### **Long-term (Month 2+)**
13. ✅ Migrate to TypeScript
14. ✅ Consolidate to single API client
15. ✅ Implement comprehensive error tracking
16. ✅ Add API performance monitoring

---

## Summary

The DigiFashion API architecture demonstrates **enterprise-grade patterns** with a well-structured layered approach:

### **✅ Strengths**

1. **Layered Architecture**: Clear separation between API, services, state, and UI
2. **Dual API Clients**: Axios for Redux, Fetch for flexibility
3. **Centralized Configuration**: Single source of truth for endpoints and constants
4. **Robust Error Handling**: Multi-layer error catching and normalization
5. **Optimistic Updates**: Instant UI feedback for better UX
6. **Smart Caching**: Stale-while-revalidate for performance
7. **Type Safety**: Consistent data normalization across layers
8. **Memoization**: Optimized re-rendering with hooks
9. **Server Health**: Proactive availability monitoring
10. **Best Practices**: Consistent naming, defaults, and cleanup

### **⚠️ Critical Issues Identified**

However, this analysis has also identified **significant risks and code quality issues** that require immediate attention:

1. **🔴 Security Risks**:
   - Hardcoded production URL (no environment configuration)
   - Unhandled async logout (token persistence vulnerability)
   - No token expiration handling
   - No 401 unauthorized handling

2. **🟠 Code Quality Issues**:
   - Duplicate `API_ENDPOINTS` definitions (DRY violation)
   - Inconsistent error message extraction patterns
   - Magic numbers and strings scattered throughout
   - Commented-out code pollution
   - No TypeScript or type checking

3. **🟡 Performance & Reliability**:
   - No request timeout configuration
   - No retry logic for failed requests
   - No request cancellation (memory leaks)
   - No request deduplication
   - No rate limiting protection

### **📈 Recommended Action Plan**

To transform this from a **good architecture** to an **excellent, production-ready architecture**, follow the priority fixes outlined in the "Risks, Bad Practices & Code Quality Issues" section:

- **Week 1**: Address critical security issues
- **Week 2-3**: Fix code quality and duplication issues
- **Month 1**: Implement reliability improvements
- **Month 2+**: Long-term architectural enhancements

### **Final Assessment**

**Current State**: The architecture is **functional and well-organized** but has **critical security and reliability gaps** that must be addressed before production deployment.

**Potential State**: With the recommended fixes implemented, this architecture can become **production-grade, scalable, and maintainable** while providing an excellent user experience.

---

**Document Version**: 1.1  
**Last Updated**: January 29, 2026  
**Author**: DigiFashion Development Team  
**Status**: ⚠️ Requires Critical Updates Before Production Deployment

