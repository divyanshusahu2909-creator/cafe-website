# Aesthetic Aroma — RESTful API Documentation

**Base API URL:** `http://127.0.0.1:8000/api/v1`  
**Data Format:** `application/json`  
**Authentication Scheme:** Django Session Cookie + `X-CSRFToken` Header

---

## 🔐 Authentication & Session Endpoints

### 1. Staff Login
- **Endpoint:** `POST /api/v1/auth/login/`
- **Permissions:** Public
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "adminpassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Staff login successful.",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@aestheticaroma.com",
      "is_staff": true,
      "is_superuser": true
    }
  }
  ```

### 2. Staff Logout
- **Endpoint:** `POST /api/v1/auth/logout/`
- **Permissions:** Authenticated
- **Response (200 OK):**
  ```json
  { "message": "Logged out successfully." }
  ```

### 3. Current User Context
- **Endpoint:** `GET /api/v1/auth/me/`
- **Permissions:** Authenticated
- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "username": "admin",
    "email": "admin@aestheticaroma.com",
    "is_staff": true,
    "is_superuser": true
  }
  ```

### 4. CSRF Token Bootstrap
- **Endpoint:** `GET /api/v1/auth/csrf/`
- **Permissions:** Public
- **Response (200 OK):** Sets the `csrftoken` HTTP cookie.

---

## 🍽️ Public Menu Endpoints

### 1. List Categories
- **Endpoint:** `GET /api/v1/categories/`
- **Permissions:** Public
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "Artisan Coffee",
      "slug": "artisan-coffee",
      "description": "Single-origin espresso and pour-over specialties.",
      "image": "/media/categories/coffee.jpg",
      "display_order": 1
    }
  ]
  ```

### 2. List Products
- **Endpoint:** `GET /api/v1/products/`
- **Query Parameters:**
  - `category` (string, slug): Filter by category slug (e.g. `artisan-coffee`)
  - `search` (string): Search in product name or description
  - `featured` (boolean): `true` to filter chef-recommended items
  - `is_vegan` (boolean): `true` to filter vegan items
  - `is_gluten_free` (boolean): `true` to filter gluten-free items
- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "Single-Origin Ethiopian Pour-Over",
      "slug": "ethiopian-pour-over",
      "category": { "id": 1, "name": "Artisan Coffee", "slug": "artisan-coffee" },
      "price": "340.00",
      "description": "Floral notes of jasmine and bergamot with balanced citrus acidity.",
      "is_vegetarian": true,
      "is_vegan": true,
      "is_gluten_free": true,
      "is_featured": true,
      "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd"
    }
  ]
  ```

### 3. Product Detail
- **Endpoint:** `GET /api/v1/products/{id}/`
- **Response (200 OK):** Full product model with preparation time and allergen information.

---

## 🛍️ Ordering & Checkout Endpoints

### 1. Create Customer Order
- **Endpoint:** `POST /api/v1/orders/`
- **Permissions:** Public
- **Request Body:**
  ```json
  {
    "order_type": "takeaway",
    "customer_name": "Rohan Sharma",
    "customer_phone": "+91 98260 12345",
    "customer_email": "rohan@example.com",
    "delivery_address": "Vijay Nagar, Scheme 54, Indore",
    "special_notes": "Please pack with extra napkins",
    "coupon_code": "WELCOME50",
    "payment_method": "demo",
    "idempotency_key": "c8a4df59-1970-4f59-99f0-2f90ea722bc1",
    "items": [
      { "product_id": 1, "quantity": 2, "special_instructions": "Light roast" }
    ]
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "public_reference": "AA-ORD-928173",
    "customer_name": "Rohan Sharma",
    "order_type": "takeaway",
    "order_status": "confirmed",
    "payment_status": "paid",
    "subtotal": "680.00",
    "discount": "50.00",
    "delivery_fee": "0.00",
    "tax": "31.50",
    "total": "661.50",
    "payment_disclaimer": "Demo payment — no real money will be charged.",
    "items": [ ... ]
  }
  ```

### 2. Lookup Order by Public Reference
- **Endpoint:** `GET /api/v1/orders/{public_reference}/`
- **Response (200 OK):** Returns live preparation status and tracking timeline.

### 3. Cancel Order
- **Endpoint:** `POST /api/v1/orders/{public_reference}/cancel/`
- **Constraint:** Orders can only be cancelled while in `pending` or `confirmed` status.
- **Response (200 OK):** Updates `order_status` to `cancelled`.

### 4. Validate Coupon
- **Endpoint:** `POST /api/v1/orders/validate-coupon/`
- **Request Body:**
  ```json
  {
    "code": "WELCOME50",
    "cart_subtotal": 680.00
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "valid": true,
    "discount": "50.00",
    "message": "Coupon WELCOME50 applied successfully."
  }
  ```

---

## 📅 Table Reservations Endpoints

### 1. Request Table Reservation
- **Endpoint:** `POST /api/v1/reservations/`
- **Permissions:** Public
- **Request Body:**
  ```json
  {
    "customer_name": "Priya Verma",
    "customer_phone": "+91 97555 43210",
    "customer_email": "priya@example.com",
    "reservation_date": "2026-10-30",
    "reservation_time": "19:30:00",
    "guest_count": 4,
    "special_requests": "Window table preferred for anniversary celebration."
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "reference": "AA-RES-482910",
    "customer_name": "Priya Verma",
    "reservation_date": "2026-10-30",
    "reservation_time": "19:30:00",
    "guest_count": 4,
    "status": "pending",
    "created_at": "2026-10-28T14:30:00Z"
  }
  ```

### 2. Lookup Reservation by Reference
- **Endpoint:** `GET /api/v1/reservations/{reference}/`
- **Response (200 OK):** Returns reservation record, allocated table number, and status.

### 3. Cancel Reservation
- **Endpoint:** `POST /api/v1/reservations/{reference}/cancel/`
- **Response (200 OK):** Sets status to `cancelled`.

---

## ⭐ Reviews & Gallery Endpoints

### 1. Approved Reviews List
- **Endpoint:** `GET /api/v1/reviews/`
- **Response (200 OK):** List of published customer testimonials.

### 2. Submit Customer Review
- **Endpoint:** `POST /api/v1/reviews/`
- **Request Body:**
  ```json
  {
    "name": "Ananya Joshi",
    "rating": 5,
    "review_text": "Exquisite pistachio milk latte and incredible atmosphere in Indore!"
  }
  ```
- **Note:** New submissions are saved with `is_approved = false` until staff moderation.

### 3. Atmosphere Gallery
- **Endpoint:** `GET /api/v1/gallery/`
- **Response (200 OK):** List of curated cafe architectural and dish photographs.

---

## 🏛️ Business Settings Endpoints

### 1. Public Cafe Identity
- **Endpoint:** `GET /api/v1/business-settings/`
- **Response (200 OK):** Returns name, tagline, address, operating hours, delivery thresholds, and contact information.

---

## 🛡️ Staff Admin Portal Endpoints (`IsAdminUser` Required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/admin/dashboard/` | Real-time financial metrics, pending counts, and top 5 items |
| `GET` | `/api/v1/admin/orders/` | Filterable list of all customer orders |
| `GET` | `/api/v1/admin/orders/{id}/` | Full detail of order and item breakdown |
| `PATCH` | `/api/v1/admin/orders/{id}/status/` | Update `order_status` and `payment_status` |
| `GET` | `/api/v1/admin/reservations/` | Filterable reservation bookings list |
| `PATCH` | `/api/v1/admin/reservations/{id}/status/` | Confirm/reject booking and assign table |
| `GET, POST` | `/api/v1/admin/products/` | Product catalog CRUD management |
| `PATCH, DELETE` | `/api/v1/admin/products/{id}/` | Update or remove specific product |
| `GET, POST` | `/api/v1/admin/tables/` | Manage cafe seating tables and capacity |
| `GET, POST` | `/api/v1/admin/coupons/` | Manage promotional discount codes |
| `GET` | `/api/v1/admin/reviews/` | Full review moderation queue |
| `PATCH` | `/api/v1/admin/reviews/{id}/` | Toggle `is_approved` visibility |
| `DELETE` | `/api/v1/admin/reviews/{id}/` | Delete spam review |
| `GET, PATCH` | `/api/v1/admin/business-settings/` | View and edit cafe configuration |
