import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInventory from './pages/admin/AdminInventory';
import AdminCustomers from './pages/admin/AdminCustomers';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Customer routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
