# 🌿 Leaf & Bloom — Full-Stack E-Commerce Platform

A production-grade, full-stack e-commerce web application for an indoor plant nursery and gardening supplies store based in **Attock, Pakistan**. Built with a **Django REST Framework** backend (deployed on **PythonAnywhere** using **SQLite**), a **React (Vite) + Tailwind CSS** frontend (deployed on **Vercel**), and complete order lifecycle management.

---

## 🚀 Key Features

### 🛒 Customer Storefront
- **Responsive Modern UI**: Built with dynamic animations, pet-safety badges, plant care indicators, and dark green nursery design tokens.
- **Product Catalog & Filtering**: Search plants via global top navbar, filter by categories, price range, pet safety, or light requirements, and sort by price/newest.
- **Interactive Product Detail**: High-res gallery images with fallback protection, pet-safety tags, light requirement badges, and size/pot variant selectors.
- **Persistent Shopping Cart**: Real-time item additions, quantity adjustments, line subtotal calculations, and cart clearance.
- **Seamless Checkout & Promo Engine**: Shipping address collection, synchronized shipping fee calculation (Rs. 200 standard, free $\ge$ Rs. 3,000), Cash on Delivery (COD) / Card options, and promo coupon support (`LEAF10` for 10% off, `WELCOME200` for Rs. 200 off).
- **Customer Order Tracking & Cancellation (`/orders`)**: Dedicated customer portal to track order status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) and perform self-service order cancellations with instant inventory restoration.
- **JWT Authentication**: User registration, login, token refresh, and persistent user sessions.

### 📊 Dual Admin Management System
- **React Frontend Admin Hub (`/admin/inventory`)**:
  - ➕ **Visual Add Product Modal**: Form to add plants, pots, fertilizers, SKU, stock quantity, prices, image URLs, pet safety flags, and care instructions.
  - ✏️ **Visual Edit Product**: Real-time inline editing of existing catalog items and image links.
  - 🗑️ **Delete / Deactivate Products**: Quick catalog maintenance.
  - 📦 **Order Management (`/admin/orders`)**: View customer orders, update order status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), and filter orders.
  - 👥 **Customer Analytics (`/admin/customers`)**: Customer statistics, order count, and total spend tracking.
- **Django Admin Portal (`https://sardaradnan.pythonanywhere.com/admin/`)**:
  - Built-in Django CRUD panel themed with **Jazzmin**.
  - Direct database model management, user permissions, order item inspection, and raw catalog edits.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Python 3.12 + Django 5.x / 6.x |
| **REST API** | Django REST Framework (DRF) + SimpleJWT |
| **Database** | SQLite (`db.sqlite3`) / `dj_database_url` |
| **Backend Hosting** | PythonAnywhere (Free Tier) |
| **Frontend Framework** | React 18 + Vite |
| **Frontend Hosting** | Vercel (Free Tier) |
| **Styling** | Tailwind CSS v4 + Custom Design Tokens |
| **HTTP Client** | Axios with silent token refresh interceptor |
| **Routing** | React Router DOM v6 |
| **Admin UI Theme** | Jazzmin (Django) + Custom React Admin Components |

---

## 📁 Project Structure

```
Task_2/
├── backend/                        # Django REST API & Database Models
│   ├── accounts/                   # Custom User & Auth APIs
│   ├── config/                     # Django Settings, URLs, and WSGI
│   ├── core/                       # Custom Exception Handler & Base Models
│   ├── orders/                     # Cart, Order, and Checkout APIs
│   ├── products/                   # Category, Product, Variant, Image APIs
│   ├── seed_db.py                  # Database Seeding Script (Admin, Customers, Catalog)
│   ├── manage.py                   # Django CLI
│   └── requirements.txt            # Python Dependencies
│
├── customer-website/               # React (Vite) Storefront & Admin Hub
│   ├── src/
│   │   ├── api/                    # Axios API Modules (auth, products, cart, orders, admin)
│   │   ├── components/             # Reusable UI (Navbar, Footer, ProductCard, PriceDisplay, etc.)
│   │   ├── context/                # AuthContext & CartContext
│   │   ├── pages/                  # Storefront Pages (Home, Products, ProductDetail, Cart, Checkout, MyOrders, About, Contact)
│   │   │   └── admin/              # Admin Hub Pages (AdminOrders, AdminInventory, AdminCustomers)
│   │   ├── App.jsx                 # App Routing
│   │   └── main.jsx                # React Entry Point
│   ├── index.html                  # HTML Shell & Fonts
│   ├── vite.config.js              # Vite Build Configuration
│   └── package.json                # Frontend Dependencies
│
└── README.md                       # Project Documentation
```

---

## ⚡ Getting Started & Local Setup

### 1. Prerequisites
- **Python 3.10+** (Python 3.12 recommended)
- **Node.js 18+** & **npm**

---

### 2. Backend Setup (Django)

1. Open terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Environment Variables (`backend/.env`):
   ```env
   DEBUG=True
   SECRET_KEY=leaf-bloom-dev-secret-key
   ALLOWED_HOSTS=localhost,127.0.0.1
   DATABASE_URL=sqlite:///db.sqlite3
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```

5. Run Database Migrations:
   ```bash
   py manage.py migrate
   ```

6. Seed Database (Populates Admin User, Demo Customer, 5 Categories, and 8 Rich Products):
   ```bash
   py seed_db.py
   ```

7. Start the Backend Development Server:
   ```bash
   py manage.py runserver
   ```
   The backend API will run at **`http://127.0.0.1:8000/`**.

---

### 3. Frontend Setup (React Customer Storefront)

1. Open a new terminal and navigate to `customer-website/`:
   ```bash
   cd customer-website
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Verify Environment File (`customer-website/.env`):
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1/
   ```

4. Start the Vite Frontend Development Server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit:
   **`http://localhost:5173/`**

---

## 🔑 Pre-Configured Demo Credentials

Use these credentials to test storefront purchases, promo codes, or log into the Admin Hub:

| Account Type | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin / Staff** | `admin@leafandbloom.pk` | `admin123password` | Full Access to Admin Hub & Django Admin |
| **Demo Customer** | `customer@leafandbloom.pk` | `customer123password` | Storefront Shopping, Checkout, & Order History |

---

## 🖥️ Live Deployed Links

* **Live Storefront (Vercel)**: `https://leaf-and-bloom-website.vercel.app`
* **Live Django Admin (PythonAnywhere)**: `https://sardaradnan.pythonanywhere.com/admin/`

---

## 🗄️ Database Architecture (SQLite)

The backend uses **SQLite** (`db.sqlite3`) for efficient, lightweight local and cloud deployment:
- **`accounts_user`**: Custom user model with email unique constraints, hashed passwords, and staff flags.
- **`products_category`**: Category titles, descriptions, images, and slugs.
- **`products_product`**: Plant catalog, base prices, discount prices, SKUs, pet safety flags, stock quantities.
- **`products_productvariant`**: Pot sizes, materials, price overrides, and variant inventory.
- **`products_productimage`**: Primary gallery images and fallback URLs.
- **`orders_cart` & `orders_cartitem`**: Active customer shopping carts.
- **`orders_order` & `orders_orderitem`**: Customer orders with status tracking (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), shipping snapshots (Attock, Pakistan), and payment methods (`cod` / `card`).

---

## 📞 Support & Location Details

- **Store Location**: Main City Road, Attock, Pakistan
- **Contact Phone**: `03001234567`
- **Email Support**: `support@leafandbloom.pk`

---

## 🌿 Git Branching & Repository Workflow

- **`main`**: Production-ready release branch.
- **`dev`**: Active development branch.

### Pushing Changes:
```bash
git add .
git commit -m "Your commit message"
git push origin dev

git checkout main
git merge dev
git push origin main
git checkout dev
```

---

*Built with 💚 for Leaf & Bloom Plant Co.*
