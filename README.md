# Aesthetic Aroma — Luxury Full-Stack Cafe Website
*“Where Every Sip Feels Special.”*

Aesthetic Aroma is a comprehensive full-stack digital web platform and management suite designed for a premier luxury pure vegetarian cafe located in Indore, Madhya Pradesh, India.

---

## ☕ Key Highlights

- **100% Pure Vegetarian Gastronomy:** Specialized single-origin pour-overs, artisanal espresso, European pasta, wood-fired artisan pizzas, gourmet tartines, and handcrafted eggless desserts.
- **Cinematic Luxury UI/UX:** Bespoke coffee-house palette featuring Espresso Black (`#171411`), Warm Gold (`#C49A6C`), Cream Ivory (`#F5EFE6`), Coffee Brown (`#654735`) and Beige (`#A7A08F`), typeset in Playfair Display serif headings with Inter body copy.
- **Dual-Mode Backend Engine:** Django 6.0 + Django REST Framework with dual-engine database support (automatic fallback to SQLite for immediate zero-config testing and development, with seamless production MySQL 9+ switching).
- **Server-Side Financial Security:** Customer cart prices are recalculating strictly on the server against active database products; client totals are never blindly trusted.
- **Capacity-Aware Table Reservations:** Real-time seat allocation with conflict prevention, opening-hours checks (10:00 AM – 10:30 PM), past-date rejection, and unique public lookup references (`AA-RES-XXXX`).
- **Simulated Payment Gateway & Boundaries:** Safe demo payment flow with explicit non-monetary disclaimers and a dedicated adapter architecture for Razorpay integration.
- **Staff Administration Portal:** Protected operations portal (`/admin-dashboard`) for live order status transitions, reservation seat allocation, review approval moderation, and cafe business settings.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, React Router 7, Lucide Icons, Context API |
| **Backend** | Python 3.14 / Django 6.0, Django REST Framework, Django CORS Headers, Pillow |
| **Database** | SQLite (development/local sandbox) / MySQL 9+ (production) |
| **Authentication** | Django Session & CSRF authentication, Django Staff Permissions |
| **Integrations** | WhatsApp Concierge Web hook, Razorpay Payment Provider Interface |

---

## 📁 Repository Structure

```
.
├── backend/                  # Django REST Framework backend
│   ├── apps/
│   │   ├── accounts/         # Staff authentication & session endpoints
│   │   ├── business/         # Business settings, metrics & seed management
│   │   ├── core/             # Base timestamped models & reference generators
│   │   ├── gallery/          # Cafe atmosphere photography & endpoints
│   │   ├── menu/             # Categories, products & admin viewsets
│   │   ├── orders/           # Orders, order items, coupons & state machine
│   │   ├── payments/         # Payment models, Demo & Razorpay providers
│   │   ├── reservations/     # Tables, reservations & booking logic
│   │   └── reviews/          # Customer reviews & moderation
│   ├── config/               # Django settings, URLs, WSGI/ASGI
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/                 # React + TypeScript + Vite storefront
│   ├── src/
│   │   ├── admin/            # Protected staff dashboard & moderation views
│   │   ├── components/       # UI elements, layout, cart, modal, home widgets
│   │   ├── context/          # CartContext & AdminAuthContext
│   │   ├── pages/            # Public storefront routes
│   │   ├── services/         # Type-safe DRF API clients
│   │   ├── styles/           # Luxury CSS design tokens & animations
│   │   └── types/            # TypeScript interfaces
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
├── docs/                     # Technical specifications & documentation
│   ├── API.md                # Complete REST endpoint schema reference
│   ├── DATABASE.md           # Entity relationship model & lifecycles
│   └── DEPLOYMENT.md         # Production Gunicorn, Nginx & MySQL guide
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python:** 3.10 or higher
- **Node.js:** 18 or higher (with `npm`)

---

### Quick Launch (Both Servers Concurrently)

Launch both the backend API and frontend Vite servers with a single command from the project root:

```bash
./start.sh
```

---

### 2. Manual Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. (Optional) Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Copy environment configuration
cp .env.example .env

# 5. Apply database migrations
python3 manage.py migrate

# 6. Seed demo catalog (28 products, 8 categories, 7 tables, coupons, reviews)
python3 manage.py seed_demo_data

# 7. Start Django development server
python3 manage.py runserver 127.0.0.1:8000
```

> **Pre-configured Staff Credentials:**
> - **Username:** `admin`
> - **Password:** `adminpassword123`
> - **Portal URL:** `http://localhost:5173/admin-login` (or `http://127.0.0.1:8000/django-admin/`)

---

### 3. Manual Frontend Setup

```bash
# 1. In a new terminal, navigate to frontend directory
cd frontend

# 2. Install dependencies (already prepared)
npm install

# 3. Copy environment configuration
cp .env.example .env

# 4. Start Vite development server
npm run dev
```

The frontend will be available at: **`http://localhost:5173`**

---

## 🧪 Testing & Verification

### Automated Backend Test Suite
Run the 29 comprehensive unit and integration tests covering accounts auth, menu, orders, reservations, payments, business settings, reviews moderation, and gallery:

```bash
cd backend
python3 manage.py test
```

### Automated Frontend Vitest Suite
Run the 9 React component and context unit tests using Vitest and Testing Library:

```bash
cd frontend
npm test
```

### Frontend Production Build
Type-checks the whole source tree, then bundles:

```bash
cd frontend
npm run build      # tsc --noEmit && vite build
npm run typecheck  # types only
npm run lint       # oxlint
```

### Production Checklist

- Set `DEBUG=False` and a long random `SECRET_KEY` in `backend/.env`.
- Set `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` to your real domains.
- Session cookies become `Secure` automatically when `DEBUG=False`.
- Login and public lookup endpoints are rate limited (`LOGIN_THROTTLE_RATE`, `LOOKUP_THROTTLE_RATE`).
- Demo credentials are prefilled and shown on the staff login page **only in dev builds**.

---

## 💳 Payment & Concierge Boundaries

1. **Demo Payment Provider:**
   By default, the checkout pipeline uses the `DemoPaymentProvider`. It simulates immediate success and records the transaction without any real bank or card interaction. Every receipt clearly displays:
   > *“Demo payment — no real money will be charged.”*

2. **Razorpay Provider:**
   A production-ready boundary is configured in `backend/apps/payments/services.py`. If selected without valid `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`, the endpoint returns a clear `503 Service Unavailable` explaining that real payment gateway credentials must be supplied.

3. **WhatsApp Concierge:**
   The floating button and concierge links connect directly to the Indore cafe line (`+91 98765 43210`) with pre-filled inquiry text via the WhatsApp Web URI protocol.

---

## 📖 Detailed Documentation

- **[API Reference](file:///Users/mac/Desktop/project%20.foket/docs/API.md):** Complete catalog of DRF endpoints, authentication, request/response payloads, and HTTP status codes.
- **[Database Architecture](file:///Users/mac/Desktop/project%20.foket/docs/DATABASE.md):** Entity relationship diagrams, schema definitions, and order/reservation lifecycles.
- **[Production Deployment](file:///Users/mac/Desktop/project%20.foket/docs/DEPLOYMENT.md):** Step-by-step instructions for hosting on Ubuntu, configuring MySQL, Nginx, Gunicorn, systemd, and SSL certificates.

---

## 🏛️ Location & Visit

**Aesthetic Aroma Cafe**  
Scheme 54, Near Meghdoot Garden, Vijay Nagar  
Indore, Madhya Pradesh 452010, India  
**Hours:** Monday – Sunday: 10:00 AM – 10:30 PM  
**Contact:** `+91 98765 43210` | `contact@aestheticaroma.com`
