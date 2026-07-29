# 🌿 Leaf & Bloom — Full-Stack E-Commerce Platform

A production-grade, full-stack e-commerce web application for an indoor plant nursery and gardening supplies store based in **Attock, Pakistan**. Built with a **Django REST Framework** backend, a **React (Vite) + Tailwind CSS** frontend, and **Supabase (PostgreSQL)** database integration.

---

## 🚀 Key Features

### 🛒 Customer Storefront
- **Responsive Modern UI**: Built with dynamic animations, glassmorphism, pet-safety badges, and dark green color palette.
- **Product Catalog & Filtering**: Search by keyword, filter by categories, price range, pet safety, or light requirements, and sort by price/newest.
- **Interactive Product Detail & Gallery**: High-res gallery images with automatic `onError` fallback protection, pet-safety tags, light requirement indicators, and size/pot variant selectors.
- **Persistent Shopping Cart**: Real-time item additions, quantity adjustments, line subtotal calculations, and cart clearance.
- **Seamless Checkout**: Address collection (defaulting to Attock, Pakistan), shipping fee calculation, Cash on Delivery (COD) / Credit Card payment options, and instant order confirmation screens.
- **JWT Authentication**: User registration, login, token refresh, and persistent user sessions.

### 📊 Dual Admin Management System
- **React Frontend Admin Dashboard (`/admin/inventory`)**:
  - ➕ **Visual Add Product Modal**: Form to add plants, pots, fertilizers, SKU, stock quantity, prices, pet safety flags, and care instructions.
  - ✏️ **Visual Edit Product**: Real-time inline editing of existing catalog items.
  - 🗑️ **Delete / Deactivate Products**: Quick catalog maintenance.
  - 📦 **Order Management (`/admin/orders`)**: View customer orders, update order status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`), and filter orders.
  - 👥 **Customer Analytics (`/admin/customers`)**: Customer statistics, order count, and total spend tracking.
- **Django Admin Portal (`http://127.0.0.1:8000/admin/`)**:
  - Built-in Django CRUD panel themed with **Jazzmin**.
  - Direct database model management, user permissions, order item inspection, and raw catalog edits.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Python 3.13 + Django 5.x |
| **REST API** | Django REST Framework (DRF) + SimpleJWT |
| **Database** | PostgreSQL (Supabase Cloud) / SQLite (Local fallback) |
| **Frontend Framework** | React 18 + Vite |
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
│   │   ├── pages/                  # Storefront Pages (Home, Products, ProductDetail, Cart, Checkout, About, Contact)
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
- **Python 3.10+**
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

## 🔑 Pre-Configured Credentials

Use these credentials to test customer purchases or log into the Admin Hub:

| Account Type | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin / Staff** | `admin@leafandbloom.pk` | `admin123password` | Full Access to Admin Hub & Django Admin |
| **Demo Customer** | `customer@leafandbloom.pk` | `customer123password` | Storefront Shopping & Checkout |

---

## 🖥️ How to Use the Admin Systems

### 1. React Visual Admin Hub (`http://localhost:5173/admin/inventory`)
- Sign in with `admin@leafandbloom.pk` / `admin123password`.
- Click your profile initial (`D`) in the navbar -> **📊 Admin Panel**.
- **Inventory Tab**: Click **`+ Add Product`** to open the creation modal, click **`✏️ Edit`** to update prices/stock, or click **`🗑️ Delete`** to remove a product.
- **Orders Tab**: View placed customer orders, update order status (`Processing`, `Shipped`, `Delivered`, `Cancelled`), and review shipping addresses.
- **Customers Tab**: Inspect registered customer statistics and lifetime spend.

### 2. Django Admin Portal (`http://127.0.0.1:8000/admin/`)
- Log in with `admin@leafandbloom.pk` / `admin123password`.
- View raw database tables, manage user permissions, and inspect JSON payloads.

---

## 🗄️ Database Architecture (Supabase / PostgreSQL)

In production or remote mode, the backend connects directly to **Supabase PostgreSQL**:
- **`accounts_user`**: Users, email unique constraints, hashed passwords, staff flags.
- **`products_category`**: Category titles, descriptions, and slugs.
- **`products_product`**: Product catalog, prices, discount prices, SKUs, pet safety flags, stock quantities.
- **`products_productvariant`**: Pot sizes, materials, price overrides, and variant inventory.
- **`products_productimage`**: Primary gallery images and fallback URLs.
- **`orders_cart` & `orders_cartitem`**: Active customer shopping carts.
- **`orders_order` & `orders_orderitem`**: Placed customer orders with order status, shipping snapshots (Attock, Pakistan), and payment methods (`cod` / `card`).


---

## 🌿 Git Branching & Repository Workflow

- **`main`**: Production-ready, fully tested stable release.
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
