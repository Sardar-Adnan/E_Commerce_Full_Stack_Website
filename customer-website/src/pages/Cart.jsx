import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PriceDisplay from '../components/PriceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const { cart, loading, error, updateItemQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);
  const [itemError, setItemError] = useState(null);
  const [clearing, setClearing] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState title="Sign in to view your cart" message="You need to be logged in to add items to your cart."
          actionLabel="Sign In" actionTo="/login" icon="🔒" />
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;

  const items = cart?.items || [];

  const handleUpdateQty = async (itemId, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(itemId);
    setItemError(null);
    try {
      await updateItemQuantity(itemId, newQty);
    } catch (err) {
      const errData = err.response?.data;
      setItemError({ id: itemId, msg: typeof errData === 'object' ? Object.values(errData).flat().join(' ') : 'Update failed' });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdatingId(itemId);
    try { await removeItem(itemId); } catch {} finally { setUpdatingId(null); }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) return;
    setClearing(true);
    try { await clearCart(); } catch {} finally { setClearing(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <EmptyState title="Your cart is empty" message="Looks like you haven't added anything yet."
          actionLabel="Browse Products" actionTo="/products" icon="🛒" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 flex gap-4">
                {/* Image */}
                <Link to={`/products/${item.product?.slug}`} className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  {item.product?.primary_image ? (
                    <img src={item.product.primary_image} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🌿</div>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/products/${item.product?.slug}`} className="font-semibold text-gray-900 hover:text-primary-700">
                        {item.product?.name}
                      </Link>
                      {item.variant && <p className="text-sm text-gray-500 mt-0.5">{item.variant.name}</p>}
                    </div>
                    <button onClick={() => handleRemove(item.id)} disabled={updatingId === item.id}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingId === item.id}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-40">−</button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        disabled={updatingId === item.id}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-50">+</button>
                    </div>
                    <p className="font-semibold text-gray-900">Rs. {parseFloat(item.subtotal).toLocaleString()}</p>
                  </div>

                  {itemError?.id === item.id && (
                    <p className="text-sm text-red-600 mt-2">{itemError.msg}</p>
                  )}
                </div>
              </div>
            ))}

            <button onClick={handleClear} disabled={clearing}
              className="text-sm text-red-600 hover:text-red-700 font-medium mt-2">
              {clearing ? 'Clearing...' : '🗑️ Clear Entire Cart'}
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items ({cart.total_items})</span>
                  <span className="font-medium">Rs. {parseFloat(cart.total_price).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Subtotal</span>
                  <span className="text-primary-700">Rs. {parseFloat(cart.total_price).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => navigate(isAuthenticated ? '/checkout' : '/login?redirect=/checkout')}
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
              >
                Proceed to Checkout
              </button>
              <Link to="/products" className="block text-center text-sm text-primary-600 mt-4 hover:text-primary-700">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
