import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import * as cartApi from '../api/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total_items: 0, total_price: '0.00' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      setError(err.response?.data || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], total_items: 0, total_price: '0.00' });
    }
  }, [isAuthenticated, fetchCart]);

  const addItem = useCallback(async (productId, variantId, quantity = 1) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setError(null);
    try {
      const payload = { product_id: productId, quantity };
      if (variantId) payload.variant_id = variantId;
      await cartApi.addItem(payload);
      await fetchCart();
    } catch (err) {
      const errMsg = err.response?.data || 'Failed to add item';
      setError(errMsg);
      throw err;
    }
  }, [isAuthenticated, navigate, fetchCart]);

  const updateItemQuantity = useCallback(async (itemId, quantity) => {
    setError(null);
    try {
      await cartApi.updateItem(itemId, quantity);
      await fetchCart();
    } catch (err) {
      const errMsg = err.response?.data || 'Failed to update quantity';
      setError(errMsg);
      throw err;
    }
  }, [fetchCart]);

  const removeItem = useCallback(async (itemId) => {
    setError(null);
    try {
      await cartApi.removeItem(itemId);
      await fetchCart();
    } catch (err) {
      setError(err.response?.data || 'Failed to remove item');
      throw err;
    }
  }, [fetchCart]);

  const clearCartItems = useCallback(async () => {
    setError(null);
    try {
      await cartApi.clearCart();
      setCart({ items: [], total_items: 0, total_price: '0.00' });
    } catch (err) {
      setError(err.response?.data || 'Failed to clear cart');
      throw err;
    }
  }, []);

  return (
    <CartContext.Provider value={{
      cart, loading, error, addItem, updateItemQuantity, removeItem, clearCart: clearCartItems, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export default CartContext;
