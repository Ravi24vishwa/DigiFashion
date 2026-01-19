# Complete Product Lifecycle Guide - DigiFashion App

**Generated:** January 13, 2026  
**Focus:** The Product object from creation to order completion

---

## 📑 Table of Contents
1. [What is a Product?](#what-is-a-product)
2. [Product Data Structure](#product-data-structure)
3. [Product Journey (Complete Flow)](#product-journey-complete-flow)
4. [Stage 1: Product Origin (API)](#stage-1-product-origin-api)
5. [Stage 2: Product Discovery (Home/Search)](#stage-2-product-discovery-homesearch)
6. [Stage 3: Product Details](#stage-3-product-details)
7. [Stage 4: Product in Cart](#stage-4-product-in-cart)
8. [Stage 5: Product Review](#stage-5-product-review)
9. [Stage 6: Product in Order](#stage-6-product-in-order)
10. [Simplified Understanding](#simplified-understanding)
11. [Visual Flowcharts](#visual-flowcharts)
12. [Code Walkthrough](#code-walkthrough)

---

## What is a Product?

A **Product** is an item for sale in the DigiFashion store. It's the core data object that flows through the entire app.

### Simple Definition
```
PRODUCT = Fashion Item (Dress, Shirt, Pants, etc.)
        + Price
        + Images
        + Details
        + Reviews
        + Availability
```

### Real-World Analogy
Think of a product like a clothing item in a physical store:
- **Store Display (Home)** → See the item with price and photo
- **Detailed Look (Product Detail)** → Try it on, read reviews
- **Try On (Add to Cart)** → Put in shopping bag
- **Checkout** → Pay and get delivery address
- **Delivery** → Item arrives
- **Feedback (Review)** → Rate your experience

---

## Product Data Structure

### What Data Does a Product Have?

#### **Raw API Format** (From Backend)
```javascript
{
  // Identity
  id: 101,
  product_slug: "blue-casual-dress",
  
  // Basic Info
  product_name: "Blue Casual Dress",
  product_brand: "FashionBrand",
  product_description: "A comfortable casual dress...",
  
  // Pricing
  product_price: 999,          // Current selling price
  product_mrp: 1299,           // Original price
  product_discount: 23,        // Discount percentage
  
  // Media
  product_thumbnail_image_url: "https://..../thumb.jpg",
  product_images_url: ["https://..../img1.jpg", "https://..../img2.jpg"],
  
  // Quality Metrics
  product_rating: 4.5,         // Average rating (0-5)
  product_reviews_count: 125,  // Number of reviews
  
  // Stock & Variants
  shop_id: 1,
  product_stock: 50,           // Available quantity
  sizes: ["S", "M", "L", "XL"],
  colors: ["Blue", "Red", "Black"]
}
```

#### **Normalized Format** (Used in App)
```javascript
{
  // Standardized names (easier to use)
  id: 101,
  title: "Blue Casual Dress",
  brand: "FashionBrand",
  
  // Numbers (ready for display)
  price: 999,                  // ₹999
  oldPrice: 1299,              // ₹1299 (strike-through)
  discount: 23,                // -23%
  rating: 4.5,                 // ⭐⭐⭐⭐☆
  
  // Media (ready for <Image />)
  imageUrl: "https://..../thumb.jpg",
  images: ["https://..../img1.jpg"],
  
  // Status (user-specific)
  isFavorite: false,           // Is in wishlist?
  inCart: false,               // Is in shopping cart?
  
  // URLs
  slug: "blue-casual-dress",
  
  // Metadata
  stock: 50,
  shop_id: 1
}
```

### Why Two Formats?
- **API Format**: What the backend sends (fixed structure)
- **App Format**: What the frontend needs (simplified names, parsed numbers, added flags)

---

## Product Journey (Complete Flow)

### Visual Timeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      COMPLETE PRODUCT LIFECYCLE                             │
└─────────────────────────────────────────────────────────────────────────────┘

1️⃣  CREATION (Backend)
    └─→ Product created in database with all details

2️⃣  DISCOVERY (Home/Search)
    └─→ Fetched from API
    └─→ Displayed in product lists
    └─→ User sees with price, image, rating

3️⃣  EXPLORATION (Product Detail)
    └─→ User clicks to see full details
    └─→ Sees all images, reviews, ratings
    └─→ Can select size/color

4️⃣  ADDITION (Add to Cart)
    └─→ User adds product to shopping cart
    └─→ Quantity selected (1, 2, 3...)
    └─→ Stored in cart state + API

5️⃣  CHECKOUT (Cart Review)
    └─→ Product listed with selected quantity
    └─→ Price calculated
    └─→ Can increase/decrease quantity
    └─→ Can remove from cart

6️⃣  ORDERING (Place Order)
    └─→ Product confirmed in order
    └─→ Selected size/color recorded
    └─→ Final price calculated

7️⃣  DELIVERY (Order Status)
    └─→ Product status tracked (Processing → Shipped → Delivered)
    └─→ User can see in "My Orders"

8️⃣  FEEDBACK (Review)
    └─→ User can rate (1-5 stars)
    └─→ User can write review text
    └─→ Submitted back to API

TIME: API → Seconds for fetch → Minutes for delivery → Weeks for complete journey
```

---

## Stage 1: Product Origin (API)

### Where Products Come From?

**3 Main Sources:**

#### **Source 1: Home Screen Products**
```
API Endpoint: GET /homedata
Returns: HomeScreen sections with featured products

Example Response:
{
  Status: 200,
  Data: [
    {
      id: 1,
      flag_name: "Trending Now",
      products: [
        { id: 101, product_name: "Blue Dress", ... },
        { id: 102, product_name: "Red Shirt", ... }
      ]
    },
    {
      id: 2,
      flag_name: "New Arrivals",
      products: [...]
    }
  ]
}

When: App loads HomeScreen
Why: To populate home screen sections
Return Time: 1-3 seconds
```

**Code Location:** [src/screens/home/HomeScreen.jsx](src/screens/home/HomeScreen.jsx#L30)

#### **Source 2: Search/Shop Products**
```
API Endpoint: POST /shop
Request Body:
{
  per_page: 20,
  page: 1,
  store_id: 1,
  device_id: "...",
  category_ids: [5],      // Optional: filter by category
  search: "dress",        // Optional: search keyword
  price_range: "0-5000"   // Optional: price filter
}

Returns: Array of matching products with pagination

When: User searches, browsesCategory, or clicks "View All"
Why: To show relevant products
Return Time: 1-2 seconds
```

**Code Location:** [src/api/productService.js](src/api/productService.js#L6)

#### **Source 3: Single Product Details**
```
API Endpoint: POST /product/{slug}
Request Body:
{
  slug: "blue-casual-dress",
  shop_id: 1
}

Returns: Single product with full details + reviews

When: User clicks on a product card
Why: To show complete product information
Return Time: 1-2 seconds
```

**Code Location:** [src/api/productService.js](src/api/productService.js#L29)

### Flow Diagram: How Product Reaches App

```
┌──────────────────────┐
│   Backend Database   │
│  (Product stored)    │
└──────────────┬───────┘
               │
               ▼
┌──────────────────────────────────────┐
│  API Server (REST Endpoint)          │
│  POST /shop    GET /homedata         │
│  POST /product/{slug}                │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Network (HTTP Request)              │
│  DigiFashion App makes request       │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  API Response (JSON with products)   │
│  {Status: 200, Data: [...]}          │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  App Receives & Validates            │
│  (apiService.js checks status)       │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Save to Cache (AsyncStorage)        │
│  CACHE_HOME_DATA, CACHE_PRODUCTS     │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Transform to App Format             │
│  normalizeProduct()                  │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  Store in State/Redux                │
│  setHomeData([...])                  │
│  store.products.items                │
└──────────────┬───────────────────────┘
               │
               ▼
        ✅ Ready to Display
```

---

## Stage 2: Product Discovery (Home/Search)

### How Does User Discover Products?

#### **Path 1: Home Screen Browse**
```
USER ACTION:          App opens
                         ↓
WHAT HAPPENS:         HomeScreen loads
                         ↓
API CALL:             GET /homedata, GET /banners
                         ↓
DATA RECEIVED:        Array of product sections
                         ↓
TRANSFORMATION:       Rename fields, parse numbers, add isFavorite
                         ↓
DISPLAY:              CustomProductList.ProductList
                      (Horizontal ScrollView with ProductCards)
                         ↓
USER SEES:            "Trending Now" section with 6-10 products
                      Each showing: Image, Price, Discount, Rating
```

**Why This Way?**
- Fast: Shows cached data first while fetching fresh data
- User-friendly: Already organized by categories
- Discoverable: Featured products highlighted

**Code:**
```javascript
// HomeScreen.jsx line 30-60
useEffect(() => {
  const fetchData = async () => {
    // 1. Load from cache (instant)
    const cached = await storage.getItem(STORAGE_KEYS.CACHE_HOME_DATA);
    if (cached) {
      setHomeData(cached.home);
      setIsLoading(false);
    }
    
    // 2. Fetch fresh data in background
    const homeRes = await api.get('homedata');
    
    // 3. Save to cache
    await storage.setItem(STORAGE_KEYS.CACHE_HOME_DATA, {
      home: homeRes.Data
    });
  };
  fetchData();
}, []);
```

#### **Path 2: Search**
```
USER ACTION:          Types in search bar
                      "blue dress"
                         ↓
NAVIGATION:           SearchBarScreen
                         ↓
API CALL:             POST /shop with search parameter
                      { search: "blue dress" }
                         ↓
DATA RECEIVED:        Matching products (filtered by search)
                         ↓
DISPLAY:              ProductGrid or ProductList
                      (Vertical FlatList with ProductCards)
                         ↓
USER SEES:            Only blue dresses (sorted by relevance)
```

**Why Search is Different?**
- Dynamic: Based on user input
- Filtered: Only matching results
- Real-time: Updates as user types (if debounced)

#### **Path 3: Category Browse**
```
USER ACTION:          Taps "Categories" tab
                         ↓
NAVIGATION:           Category screen or HomeScreen
                         ↓
API CALL:             POST /shop with category_ids
                      { category_ids: [5] }  // 5 = Dresses
                         ↓
DATA RECEIVED:        All products in that category
                         ↓
DISPLAY:              ProductGrid (2-column grid)
                         ↓
USER SEES:            All dresses available
```

**Code Location:** [src/screens/home/Category/](src/screens/home/Category/)

---

## Stage 3: Product Details

### What Happens When User Clicks a Product?

```
USER ACTION:          Taps product card
                         ↓
NAVIGATION:           ProductDetailScreen with product slug
                      navigation.navigate('ProductDetailScreen', {slug})
                         ↓
COMPONENT:            ProductDetailScreen.jsx
                         ↓
API CALL:             POST /product/{slug}
                      { slug: "blue-casual-dress", shop_id: 1 }
                         ↓
DATA RECEIVED:        
{
  Data: {
    id: 101,
    product_name: "Blue Casual Dress",
    product_images_url: ["img1.jpg", "img2.jpg", "img3.jpg"],
    product_rating: 4.5,
    product_price: 999,
    product_mrp: 1299,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Red"],
    reviews: [
      { rating: 5, review_text: "Great fit!" },
      { rating: 4, review_text: "Good quality" }
    ]
  }
}
                         ↓
DISPLAY:              ProductDetailScreen Layout:
                      ├─ Carousel of product images
                      ├─ Price (Current & Original)
                      ├─ Rating & Reviews count
                      ├─ Size selector
                      ├─ Color selector
                      ├─ "Add to Cart" button
                      ├─ "Add to Favorites" button
                      └─ Reviews section
                         ↓
USER CAN:             View images, read reviews, select options
```

### Why Separate Detail Call?

**Because:**
1. Home screen shows minimal info (thumbnail, price, rating summary)
2. Detail page shows everything (all images, full reviews, stock info)
3. Keeps home screen fast (doesn't load full data for 100+ products)
4. Detail endpoint returns more data

**Analogy:** Like a catalog vs. detailed product page on Amazon

**Code Location:** [src/screens/products/ProductDetailScreen.jsx](src/screens/products/ProductDetailScreen.jsx#L1)

---

## Stage 4: Product in Cart

### When Product Enters Cart

```
USER ACTION:          Taps "Add to Cart" button
                         ↓
LOCAL STATE UPDATE:   Instant feedback (heart animation)
                         ↓
API CALL:             POST /cart/add
                      {
                        product_id: 101,
                        shop_id: 1,
                        qty: 1,
                        device_id: "..."
                      }
                         ↓
RESPONSE:             { Status: 200, Message: "Added to cart" }
                         ↓
REDUX UPDATE:         store.cart.items.push({
                        id: 101,
                        product_id: 101,
                        qty: 1,
                        product_price: 999,
                        product_name: "Blue Dress",
                        ...
                      })
                         ↓
UI UPDATE:            
├─ Cart icon shows badge with count
├─ Product card shows "In Cart" indicator (optional)
└─ Bottom tab updates
```

### Cart Product Structure

```javascript
// What gets stored in cart
{
  cart_item_id: 12345,        // Unique cart item ID
  product_id: 101,            // Product ID
  product_name: "Blue Dress",
  product_price: 999,         // Price per unit
  qty: 1,                     // Quantity selected
  product_thumbnail_image_url: "...",
  
  // ISSUE: Size & Color NOT currently sent
  // size: "L",              // ← MISSING
  // color: "Blue"           // ← MISSING
}
```

### Why Product Goes to Cart?

**Timeline:**
```
When Sent: Immediately after user taps "Add to Cart"
Why Sent: To remember user's selection on server
Where Stored: 
  - Redis (server) - temporary
  - Redux store (app) - temporary
  - Will eventually become part of Order
Return Time: <1 second
```

**Code Location:** [src/store/slices/cartSlice.js](src/store/slices)

---

## Stage 5: Product Review

### Two Types of Reviews

#### **Type 1: Before Purchase (Home Screen)**
```
LOCATION:             ProductDetailScreen - Reviews Section
API CALL:             GET /order/review/list
                      { slug: "blue-casual-dress" }
SHOWS:                All reviews from people who bought this product
DATA:
  {
    rating: 5,        // 1-5 stars
    review_text: "Great dress! Perfect fit",
    user_name: "Sarah",
    review_date: "2025-01-10"
  }
PURPOSE:              Help other users decide to buy
```

**Code:**
```javascript
// ProductDetailScreen.jsx line 150
useEffect(() => {
  const loadReviews = async () => {
    const res = await orderService.getReviews({
      slug: product.product_slug
    });
    setReviews(res.Data);
  };
  loadReviews();
}, [product]);
```

#### **Type 2: After Purchase (Review Submission)**
```
LOCATION:             OrderDetailScreen or ProductDetailScreen
USER ACTION:          Taps "Write Review" button
API CALL:             POST /order/review/add
REQUEST BODY:
{
  product_id: 101,
  order_id: 12345,    // Which order is this review for?
  rating: 5,          // 1-5 stars
  review_text: "Amazing quality and fit!"
}
RESPONSE:             { Status: 200, Message: "Review added" }
REFRESH:              Reviews list updated
```

**Why Two Flows?**
- **Before Purchase**: Trust building (read others' experiences)
- **After Purchase**: Feedback mechanism (help sellers improve)

**Code Location:** [src/components/features/products/RateReviewSheet.jsx](src/components/features/products/)

---

## Stage 6: Product in Order

### From Cart to Order

```
CHECKPOINT 1: CART REVIEW
  User reviews products in cart
  ├─ Qty: 2 (can change)
  ├─ Price: ₹1998 (2 × ₹999)
  └─ Can remove products

CHECKPOINT 2: ADDRESS SELECTION
  User selects delivery address
  └─ Product will be sent to this address

CHECKPOINT 3: PAYMENT
  User selects payment method
  └─ Razorpay, PayU, etc.

CHECKPOINT 4: ORDER SUBMISSION
  API CALL: POST /order/submit
  REQUEST:
  {
    product_ids: [101, 102],    // Products being ordered
    qtys: [1, 2],               // Quantity for each
    total_price: 2997,          // Final total
    address_id: 5,              // Delivery address
    payment_method: "Razorpay"  // Payment gateway
  }
  
  RESPONSE:
  {
    Status: 200,
    order_id: "ORDER_12345",
    message: "Order placed successfully"
  }
  
  CART CLEARED
  ✅ Order created with products
```

### Order Product Details Stored

```javascript
// In Order
{
  order_id: "ORDER_12345",
  products: [
    {
      product_id: 101,
      product_name: "Blue Dress",
      qty: 1,
      size: "L",            // ← Now recorded
      color: "Blue",        // ← Now recorded
      unit_price: 999,
      total_price: 999,
      status: "Processing"  // Processing → Shipped → Delivered
    }
  ],
  delivery_address: {
    address: "123 Main St",
    city: "Delhi",
    state: "Delhi",
    zip: "110001"
  },
  total_amount: 999,
  payment_status: "Paid",
  order_date: "2025-01-13",
  estimated_delivery: "2025-01-17"
}
```

### Why is Product in Order?

**To Track:**
- What was ordered
- When it was ordered
- Delivery status
- User selection (size, color, qty)

**Code Location:** [src/api/orderService.js](src/api/orderService.js)

---

## Simplified Understanding

### Think of Product as a "Journey"

```
IMAGINE: Product is a letter being mailed

📬 CREATION: Letter written and sent from store (API Response)

📦 DISCOVERY: Mailman shows you many letters (Home/Search)

🔍 EXPLORATION: You pick one letter, read it fully (Product Detail)

🎁 PACKAGING: You decide "Yes, I want this" (Add to Cart)

📋 CHECKOUT: You prepare it to send (Review & Payment)

✈️  SHIPPING: Letter travels to you (Order Status)

⭐ FEEDBACK: You write back how you liked it (Review)
```

### Mental Models

#### **Model 1: Database Tables**
```
PRODUCTS Table (Backend)
├─ id, name, price, images, ratings
└─ Data at rest (not changing for each user)

CART Table (Per User)
├─ user_id, product_id, qty
└─ Temporary (deleted after order)

ORDERS Table (Per User)
├─ order_id, user_id, products, status
└─ Permanent (kept for history)

REVIEWS Table (Product-specific)
├─ product_id, rating, review_text, user
└─ Aggregates to product_rating
```

#### **Model 2: Data Transformation Journey**
```
RAW API PRODUCT:
{
  product_name: "...",
  product_price: "...",
  product_discount: "...",
  product_mrp: "..."
}
        ↓
TRANSFORM:
  - Rename fields
  - Parse strings to numbers
  - Calculate discount
  - Add user-specific flags
        ↓
APP PRODUCT:
{
  title: "...",
  price: number,
  discount: number,
  oldPrice: number,
  isFavorite: boolean
}
        ↓
DISPLAY IN UI:
  - ProductCard renders title
  - Shows ₹ formatted price
  - Shows strikethrough oldPrice
  - Shows -discount%
```

### Why This Matters

**Understanding the flow helps you:**
1. ✅ Debug: Know which API to check when product data is wrong
2. ✅ Cache: Know what to cache for offline support
3. ✅ Optimize: Know which queries are slow
4. ✅ Extend: Add features like wishlists, recommendations
5. ✅ Test: Mock products at each stage

---

## Visual Flowcharts

### Complete Product Lifecycle (Single View)

```
                        PRODUCT LIFECYCLE
                        ═════════════════

        BACKEND             APP              USER
        ───────             ───              ────

        Database         HomeScreen         Opens App
        (Products)            ↓
             ↓            Fetches API
           API          (GET /homedata)
             │                ↓
             └──────→ Receives JSON
                           ↓
                       Cache + Transform
                           ↓
                    Display ProductCards
                           ↓
                                          Sees products
                                              ↓
                                          Taps product
                                              ↓
                         ProductDetailScreen
                         (GET /product/{slug})
                                ↓
                         Shows full details
                         All images, reviews
                                ↓
                                          Selects size/color
                                              ↓
                                          Taps "Add to Cart"
                                              ↓
                         API: POST /cart/add
                         ↓
                    Redux: store.cart.items
                         ↓
                                          Browses more
                                          or Checkout
                                              ↓
                         CartScreen
                         Reviews products
                                ↓
                                          Taps "Place Order"
                                              ↓
                         API: POST /order/submit
                         ↓ (Success)
                    Order created
                         ↓
                                          Redirected to
                                          "Order Placed"
                                          Success Screen
                                              ↓
                                          (Later) Opens
                                          OrderScreen
                                              ↓
                         API: GET /order/list
                         ↓
                    Shows all orders
                    (status: Processing...)
                                ↓
                                          (Weeks later)
                                          Product arrives
                                              ↓
                                          Taps "Write Review"
                                              ↓
                         API: POST /order/review/add
                         ↓
                    Review saved
                    Rating updated
                         ↓
                                          (Next user sees
                                          this review!)
```

### Product State Changes

```
           ┌─────────────────────────────────────────┐
           │    PRODUCT LIFECYCLE STATES             │
           └─────────────────────────────────────────┘

1. CATALOG STATE
   Location: API Database
   Status: Available for purchase
   Visible: Yes (on home, search)
   
         ↓
         
2. VIEWED STATE
   Location: ProductDetailScreen
   Status: User looking at details
   Visible: Full details shown
   
         ↓
         
3. CART STATE
   Location: User's shopping cart
   Status: Selected for purchase
   Quantity: User decided qty
   Visible: In cart tab
   
         ↓
         
4. CHECKOUT STATE
   Location: Payment screen
   Status: About to purchase
   Address: Selected for delivery
   Visible: In checkout summary
   
         ↓
         
5. ORDERED STATE
   Location: User's orders
   Status: Purchased (Processing)
   Visible: In "My Orders"
   
         ↓
         
6. SHIPPED STATE
   Location: In transit
   Status: On the way
   Visible: With tracking info
   
         ↓
         
7. DELIVERED STATE
   Location: User has it
   Status: Complete
   Can Review: Yes
   Visible: In past orders
   
         ↓
         
8. REVIEWED STATE
   Location: Catalog (with new review)
   Status: User reviewed it
   Visible: Review appears to others
```

### Data Flow Simplified (Side-by-Side)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  CURRENT COMPLEX FLOW        →  SIMPLIFIED UNDERSTANDING       │
│  ═════════════════════════════════════════════════════════════ │
│                                                                 │
│  Fetch → Transform →         →  Product appears where          │
│  Normalize → Map →           →  user needs it                  │
│  Render → Cache              →                                 │
│                              →                                 │
│  Why? Redux store,           →  Store it wherever needed       │
│  Context, LocalState         →  (Cart, Favorites, Orders)      │
│                              →                                 │
│  Send size in                →  Always send size/color to      │
│  CART_ADD or CART_UPDATE     →  every API that needs it        │
│                              →                                 │
│  Reviews from GET            →  Fetch after user buys          │
│  /order/review/list          →  (Can't review what you        │
│                              →   haven't bought)               │
│                              →                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Code Walkthrough

### Example 1: Product Flow from Home to Cart (5 Steps)

**Step 1: Fetch Products**
```javascript
// HomeScreen.jsx
const fetchData = async () => {
  const homeRes = await api.get('homedata');
  // Returns: { Data: [{ products: [{id, name, price, ...}] }] }
};
```

**Step 2: Transform Product**
```javascript
// Transform from API format to app format
const product = section.products.map(p => ({
  id: p.id,                           // Keep ID
  title: p.product_name,              // Rename name → title
  price: parseFloat(p.product_price), // String → Number
  oldPrice: parseFloat(p.product_mrp),
  imageUrl: p.product_thumbnail_image_url,
  brand: p.product_brand,
  discount: p.product_discount,
  isFavorite: isFavorite(p.id),       // Add user status
  slug: p.product_slug                // Add slug
}));
```

**Step 3: Display Product Card**
```javascript
// ProductCard.jsx
<Image 
  source={{ uri: item.imageUrl }} 
  style={{ width: 185, height: 220 }} 
/>
<Text>{item.title}</Text>
<Text>₹{item.price}</Text>
{item.oldPrice && <Text style={{strikeThrough}}>₹{item.oldPrice}</Text>}
{item.discount && <Text>-{item.discount}%</Text>}
```

**Step 4: User Taps Product Card**
```javascript
// ProductCard.jsx onPress
const handlePress = () => {
  onPress(item);  // Passed from parent
};

// HomeScreen passes:
onProductPress={(item) => 
  navigation.navigate('ProductDetailScreen', { 
    slug: item.slug  // Pass only slug
  })
}
```

**Step 5: Add to Cart from Detail Screen**
```javascript
// ProductDetailScreen.jsx
const handleAddToCart = async () => {
  const result = await addToCart({
    productId: product.id,
    shopId: product.shop_id,
    qty: 1,
    deviceId: 'device_id_here'
  });
  
  // This calls API: POST /cart/add
  // Redux updates store.cart.items
  // Cart icon shows badge
};
```

**Data Flow Summary for This 5-Step Journey:**
```
API Response (JSON)
    ↓
HomeScreen state
    ↓
Transform function
    ↓
ProductCard props
    ↓
Rendered UI
    ↓
User interaction (tap)
    ↓
Navigation with slug
    ↓
ProductDetailScreen loads full data
    ↓
User selects size/color
    ↓
API call to add to cart
    ↓
Redux updates cart state
    ↓
✅ Product in cart
```

### Example 2: Product from Cart to Order (4 Steps)

**Step 1: Review Cart**
```javascript
// CartScreen.jsx
const { cartItems } = useCart();
// cartItems = [
//   { product_id: 101, qty: 1, product_name: "Blue Dress", ... },
//   { product_id: 102, qty: 2, product_name: "Red Shirt", ... }
// ]

// Calculate total
const total = cartItems.reduce((sum, item) => 
  sum + (item.product_price * item.qty), 0
);
```

**Step 2: Select Address**
```javascript
// CartScreen AddressStep
const { addresses } = useCheckout();
const selectedAddress = addresses.find(a => a.id === selectedAddressId);

// Now we know where to send the products
```

**Step 3: Select Payment & Submit**
```javascript
// CartScreen - handlePlaceOrder
const handlePlaceOrder = async () => {
  const orderData = {
    shop_id: 1,
    delivery_type: 'home',
    // Products are implicit (from cart)
  };
  
  const result = await submitOrder(orderData);
  // API: POST /order/submit
  // Returns: { order_id: "ORDER_12345" }
};
```

**Step 4: Order Created**
```javascript
// Backend creates order with:
{
  order_id: "ORDER_12345",
  products: [
    {
      product_id: 101,
      product_name: "Blue Dress",
      qty: 1,
      price: 999,
      status: "Processing"  // ← Becomes "Shipped" then "Delivered"
    },
    {
      product_id: 102,
      product_name: "Red Shirt",
      qty: 2,
      price: 599,
      status: "Processing"
    }
  ],
  total: 2197,
  delivery_address: { ... }
}

// Cart cleared: cartItems = []
```

**Timeline:**
```
T=0s: User in cart, reviews 2 products
T=10s: Selects address, payment method
T=15s: Taps "Place Order"
T=16s: API call sent
T=17s: Order created on backend
T=18s: Success screen shown
T=19s: User redirected to home

Later (T=1 day): Product status: "Shipped"
Later (T=5 days): Product status: "Delivered"
Later (T=6 days): User can write review
```

### Example 3: Why Product Review Matters

**When User Reviews Product:**
```javascript
// OrderDetailScreen or ProductDetailScreen
const handleSubmitReview = async (rating, reviewText) => {
  const result = await orderService.addReview({
    product_id: 101,
    order_id: "ORDER_12345",
    rating: 5,
    review_text: "Amazing! Best purchase ever!"
  });
  
  // API: POST /order/review/add
};

// What happens on backend:
// 1. Review saved in REVIEWS table
// 2. Product's product_rating recalculated
//    (average of all reviews)
// 3. product_reviews_count incremented
// 4. Next user sees this review on product detail page
```

---

## Key Takeaways

### The 3 Core Product Concepts

| Concept | Location | Purpose | Duration |
|---------|----------|---------|----------|
| **CATALOG PRODUCT** | API Database | Show what's available | Permanent |
| **CART PRODUCT** | User's cart state | Track what they want | Until order placed |
| **ORDER PRODUCT** | Order record | Proof of purchase | Forever (for history) |

### The 3 Questions About Product Flow

**Q1: WHY does product go through multiple formats?**
- API sends one way (fixed by backend)
- App needs another way (optimized for UI)
- Different parts use it differently (cart, favorites, orders)

**Q2: WHEN does product data sync with server?**
- Display: Don't need to sync (just read cached)
- Add to cart: Sync immediately (POST /cart/add)
- Order: Sync only when placing order
- Review: Sync after order is delivered

**Q3: HOW do we prevent product data inconsistency?**
- Use normalized format everywhere
- Single source of truth (API)
- Cache with timestamps
- Refresh on app open

### The Product Lifecycle in One Sentence

> **Product → Discovered → Explored → Added to Cart → Ordered → Delivered → Reviewed**

---

## Quick Reference

### Product API Endpoints

| Action | Endpoint | When | Why |
|--------|----------|------|-----|
| Discover | GET /homedata | App opens | Show featured products |
| Search | POST /shop | User searches | Find specific products |
| Details | POST /product/{slug} | User clicks product | Show full information |
| Favorite | POST /favorite | User hearts product | Track wishlist |
| Cart Add | POST /cart/add | User adds to cart | Store selection |
| Cart Remove | DELETE /cart/delete | User removes from cart | Clean up |
| Order Submit | POST /order/submit | User pays | Create order record |
| Review Add | POST /order/review/add | User rates product | Get feedback |
| Reviews List | GET /order/review/list | Show on detail page | Help users decide |

### Product State in Redux

```javascript
// Store Structure
store.cart.items = [
  {
    product_id: 101,
    qty: 1,
    // ← Size/color should be here but isn't
  }
];

store.favorites = [101, 102, 103];
// Just product IDs

// Order products (not in Redux, sent to API):
{
  products: [
    { product_id: 101, qty: 1, size: "L", color: "Blue" }
  ]
}
```

---

## Common Issues & Solutions

### Issue 1: Product Size/Color Lost in Cart
**Problem:** User selects size L, but cart doesn't remember it
**Reason:** Cart API doesn't send size/color to backend
**Solution:** Include size/color in POST /cart/add

### Issue 2: Product Shows Old Reviews
**Problem:** User wrote review, but it doesn't show immediately
**Reason:** Reviews cached or endpoint not refreshed
**Solution:** Call GET /order/review/list after POST /order/review/add

### Issue 3: Product Appears in Two Lists
**Problem:** Same product shown in "Trending" and "New Arrivals"
**Reason:** Backend returns it in both sections
**Solution:** Normal behavior (not a bug)

### Issue 4: Product Price Different in Cart vs Detail
**Problem:** Home shows ₹999, detail shows ₹999 but cart shows ₹999 + tax
**Reason:** Tax calculated at cart/order stage
**Solution:** Show prices with tax in all places consistently

---

*Document Created: January 13, 2026*  
*Purpose: Help developers understand complete product journey*  
*For: DigiFashion Development Team*
