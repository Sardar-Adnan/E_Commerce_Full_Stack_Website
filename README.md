# 🌿 Leaf & Bloom — E-Commerce Web Application

A full-stack e-commerce website for an indoor plants & gardening supplies store, built as a
 project: Customer Website + Admin Panel + Backend API + Database.

## Tech Stack

- **Backend:** Django + Django REST Framework
- **Database:** PostgreSQL (local Postgres for dev, Supabase Postgres in production)
- **Admin Panel:** Django Admin (customized with Jazzmin)
- **Customer Website:** React (Vite) + Tailwind CSS
- **Auth:** JWT (djangorestframework-simplejwt)

## Project Structure

```
leaf-and-bloom/
├── backend/              # Django project: API + Admin Panel + DB models
├── customer-website/     # React customer-facing storefront (added Day 3+)
└── README.md
```

## Local Setup — Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env: set DATABASE_URL to your local Postgres or Supabase connection string

python manage.py migrate
python manage.py seed_data       # optional: loads demo categories/products
python manage.py createsuperuser
python manage.py runserver
```

Admin Panel: http://127.0.0.1:8000/admin/
API base: http://127.0.0.1:8000/api/v1/

## Local Setup — Customer Website

(Instructions added once the React app is scaffolded on Day 3.)

## Deployment

- Backend → Render / Railway
- Database → Supabase (Postgres)
- Frontend → Vercel / Netlify

Full deployment steps will be added to this README on Day 7.

## Progress Log

- **Day 1:** Django project scaffolded, custom User model, all core DB models
  (Category, Product, ProductVariant, ProductImage, Cart, CartItem, Order, OrderItem, Address),
  migrations applied, Django Admin registered & themed with Jazzmin, seed data command, verified
  working end-to-end against local Postgres.

- **Day 2:** Backend API endpoints for products, categories, authentication, cart, and orders were
  implemented with Django REST Framework, including JWT auth, product filtering/search/sorting,
  and cart/order workflows wired to the database.

- **Day 3:** The customer-facing React storefront was scaffolded with Vite and Tailwind, and the
  shared app shell, routing, auth/cart contexts, home/products/detail/cart pages, and API client
  modules were wired together to connect the frontend to the backend.
