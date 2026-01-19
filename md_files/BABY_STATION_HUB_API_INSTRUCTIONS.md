# Baby Station Hub API Documentation

This documentation is extracted from the Postman collection files "Baby station Hub.postman_collection (1).json" and "src/Baby station Hub.postman_collection 1.json". It organizes the API endpoints by main folders, providing details such as folder, name, method, URL, and sample request body or parameters.

## Setup Instructions

To use this Postman collection:

1. **Import the Collection**: Open Postman and import the JSON file `Baby station Hub.postman_collection (1).json` or `src/Baby station Hub.postman_collection 1.json`.
2. **Set Environment Variables**:
   - Create a new environment in Postman.
   - Add the following variables:
     - `online_url`: Set this to your API base URL. Examples:
       - Production: `https://project.spanchemicalsindia.com/digi/api/`
       - Local development: `http://192.168.0.108:2205/api/`
     - `token`: This will hold your authentication token. After logging in, update this variable with the token from the response.
     - `offline_url`: If used in any requests (e.g., for local testing), set accordingly (e.g., `http://192.168.0.108:2205/api/`).
3. **Authentication**: Many requests require Bearer token authentication. Ensure the `token` variable is set and the request uses `{{token}}` in the Authorization header.
4. **Run Requests**: Replace placeholders in bodies with actual values as needed. Some requests have sample data in the collection.

## API Endpoints

### Auth

#### SendOtp
- **Method**: POST
- **URL**: `{{online_url}}sendOtp`
- **Body (formdata)**:
  - `email`: test@gmail.com

#### Logout
- **Method**: POST
- **URL**: `{{online_url}}logout`
- **Authentication**: Bearer Token ({{token}})
- **Body (formdata)**: (empty/disabled)

#### Register
- **Method**: POST
- **URL**: `{{online_url}}verifyOtp`
- **Body (formdata)**:
  - `id`: 4 (disabled)
  - `name`: Test
  - `email`: test@gmail.com
  - `phone_no`: 1234567890
  - `otp`: 547006
  - `password`: 123456
  - `confirmpassword`: 123456
  - `dob`: 1995-06-15 (disabled)

#### Login
- **Method**: POST
- **URL**: `{{online_url}}login`
- **Body (raw JSON)**:
  ```json
  {
    "email": "test03@gmail.com",
    "password": "Pass@123",
    "remember_me": false,
    "device_id": "BE2A.250530.026.D1xx"
  }
  ```

#### forgot-password
- **Method**: POST
- **URL**: `{{online_url}}forgot-password`
- **Body (raw JSON)**:
  ```json
  {
    "email": "team.sridix@gmail.com"
  }
  ```

#### Google Login
- **Method**: POST
- **URL**: `{{online_url}}google-login`
- **Body (raw JSON)**:
  ```json
  {
    "name": "Nirav Lukhi",
    "email": "niravlukhi55@gmail.com",
    "google_id": "107210982977754081000",
    "device_id": "BE2A.250530.026.D1"
  }
  ```

### Slider

#### Slider
- **Method**: GET
- **URL**: `{{online_url}}sliders`
- **Authentication**: Bearer Token ({{token}})
- **Headers**:
  - Accept: application/json

#### Banner
- **Method**: GET
- **URL**: `{{online_url}}banners`

### Home

#### Homedata
- **Method**: GET
- **URL**: `{{online_url}}homedata`
- **Authentication**: Bearer Token ({{token}})
- **Query Parameters**:
  - `store_id`: 8 (disabled)

#### Brand
- **Method**: GET
- **URL**: `{{online_url}}brands`

#### Category
- **Method**: GET
- **URL**: `{{offline_url}}homedata`
- **Body (raw JSON)**:
  ```json
  {
    "device_id": "UP1A.231005.007",
    "per_page": 20,
    "isParent": "0"
  }
  ```

### Cart

#### List
- **Method**: GET
- **URL**: `{{online_url}}cart/listing`
- **Authentication**: Bearer Token ({{token}})

#### Delete
- **Method**: POST
- **URL**: `{{online_url}}cart/delete`
- **Authentication**: Bearer Token ({{token}})
- **Body (raw JSON)**:
  ```json
  {
    "cart_item_id": 3
  }
  ```

#### Add
- **Method**: POST
- **URL**: `{{online_url}}cart/add`
- **Authentication**: Bearer Token ({{token}})
- **Body (raw JSON)**:
  ```json
  {
    "product_id": 1,
    "product_variant_id": null,
    "qty": 2,
    "device_id": "BE2A.250530.026.D1xx"
  }
  ```

### Product Management

#### Order > Review > list
- **Method**: POST
- **URL**: `{{online_url}}order/review/list`
- **Authentication**: Bearer Token ({{token}})
- **Body (raw JSON)**:
  ```json
  {
    "slug": "aberlour-10-year-old-forest-reserve",
    "limit": 3,
    "rating": 5
  }
  ```

#### Order > Review > Add
- **Method**: POST
- **URL**: `{{online_url}}order/review/add`
- **Authentication**: Bearer Token ({{token}})
- **Body (raw JSON)**:
  ```json
  {
    "product_id": 31,
    "rating": 5,
    "review": "Superb performance and great build quality!"
  }
  ```

#### Order > List
- **Method**: GET
- **URL**: `{{online_url}}order/list`
- **Authentication**: Bearer Token ({{token}})

#### Order > Details
- **Method**: POST
- **URL**: `{{online_url}}order/details`
- **Authentication**: Bearer Token ({{token}})
- **Body (raw JSON)**:
  ```json
  {
    "order_id": 3
  }
  ```

#### Order > submit
- **Method**: POST
- **URL**: `{{online_url}}order/submit`
- **Authentication**: Bearer Token ({{token}})
- **Headers**:
  - accept: applicattion/json
- **Body (raw JSON)**:
  ```json
  {
    "payment_option": "cod" // "cod" or "razorpay"
  }
  ```

#### Product
- **Method**: POST
- **URL**: `{{online_url}}product`
- **Authentication**: Bearer Token ({{token}})
- **Body (raw JSON)**:
  ```json
  {
    "slug": "product1",
    "selected_color": 0, // default value = 0
    "selected_size": 0 // default value = 0
  }
  ```

#### Shop
- **Method**: POST
- **URL**: `{{online_url}}shop`
- **Authentication**: Bearer Token ({{token}})
- **Body (raw JSON)**:
  ```json
  {
    "per_page": 100,
    "page": 1,
    // "search": "",
    // "category_ids": [2],
    // "sort_by": "z_to_a",  //newest, high_to_low, low_to_high, a_to_z, z_to_a
    // "price_range": "0-15",
    // "brand": "b1 1"
    "store_id": 1
    // "device_id": "UP1A.231005.007"
  }
  ```

#### Filter Listing
- **Method**: GET
- **URL**: `{{online_url}}filter-listing`

#### favorite
- **Method**: POST
- **URL**: `{{online_url}}favorite`
- **Authentication**: Bearer Token ({{token}})
- **Headers**:
  - Accept: application/json
- **Body (raw JSON)**:
  ```json
  {
    "product_id": 1
  }
  ```

#### favorite list
- **Method**: GET
- **URL**: `{{online_url}}favorite/list`
- **Authentication**: Bearer Token ({{token}})

#### Product search
- **Method**: POST
- **URL**: `{{online_url}}product/serach`
- **Authentication**: Bearer Token ({{token}})
- **Body (raw JSON)**:
  ```json
  {
    "search": "p",
    "store_id": 69
  }
  ```

### Other

#### Contact_us
- **Method**: POST
- **URL**: `{{online_url}}contact_us`
- **Body (raw JSON)**:
  ```json
  {
    "contact": "12345678901", // can store contact / email
    "message": "I want to know more about your services.",
    "shop_id": 10
  }
  ```

#### panel-setting
- **Method**: GET
- **URL**: `{{online_url}}panel-setting`

#### Pages
- **Method**: GET
- **URL**: `{{online_url}}pages`

#### Faq
- **Method**: GET
- **URL**: `{{online_url}}faqs`

### Checkout

#### Coupon > coupon-list
- **Method**: GET
- **URL**: `{{online_url}}coupon/list`
- **Authentication**: Bearer Token ({{token}})
- **Headers**:
  - Accept: application/json

#### Coupon > coupon-discount
- **Method**: POST
- **URL**: `{{online_url}}coupon-discount`
- **Authentication**: Bearer Token ({{token}})
- **Headers**:
  - Accept: application/json
- **Body (raw JSON)**:
  ```json
  {
    "coupon_id": 1,
    "is_remove": false
  }
  ```

#### checkout
- **Method**: POST
- **URL**: `{{online_url}}checkout`
- **Authentication**: Bearer Token ({{token}})
- **Headers**:
  - Accept: application/json

#### checkout-address-list
- **Method**: GET
- **URL**: `{{online_url}}checkout/address/list`
- **Authentication**: Bearer Token ({{token}})

#### checkout-address-add
- **Method**: POST
- **URL**: `{{online_url}}checkout/address/add`
- **Authentication**: Bearer Token ({{token}})
- **Body (raw JSON)**:
  ```json
  {
    "id": 1,
    "name": "Nirav Bhai",
    "phone_no": 9090907878,
    "address_line_1": "200 Big Home",
    "address_line_2": "udhana darwaja",
    "city": "surat",
    "pincode": 896745,
    "landmark": null,
    "default": "0" // "1" or "0"
  }
  ```

#### checkout-address-apply
- **Method**: POST
- **URL**: `{{online_url}}checkout/address/apply`
- **Authentication**: Bearer Token ({{token}})
- **Body (raw JSON)**:
  ```json
  {
    "user_address_id": 1
  }
  ```