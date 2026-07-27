import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkout } from '../api/orders';
import PriceDisplay from '../components/PriceDisplay';

export default function Checkout() {
  const { cart, fetchCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shipping_full_name: user?.username || '',
    shipping_phone_number: user?.phone_number || '',
    shipping_street_address: '',
    shipping_city: 'Lahore',
    shipping_state: 'Punjab',
    shipping_postal_code: '54000',
    shipping_country: 'Pakistan',
    payment_method: 'COD',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In to Checkout</h2>
        <p className="text-gray-600 mb-6">You need an account to complete your purchase.</p>
        <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">Thank you for your order. We are preparing your plants with love.</p>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 text-left space-y-3 shadow-sm">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500 font-medium">Order Number:</span>
            <span className="font-bold text-primary-800">{completedOrder.order_number}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500 font-medium">Payment Method:</span>
            <span className="font-semibold uppercase">{completedOrder.payment_method}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500 font-medium">Total Amount:</span>
            <span className="font-bold text-gray-900">Rs. {parseFloat(completedOrder.total).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Shipping To:</span>
            <span className="text-right text-gray-800">{completedOrder.shipping_full_name}, {completedOrder.shipping_city}</span>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to="/products" className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await checkout(formData);
      setCompletedOrder(data);
      await fetchCart(); // Refresh empty cart
    } catch (err) {
      const errData = err.response?.data;
      if (typeof errData === 'object' && errData !== null) {
        const firstKey = Object.keys(errData)[0];
        const val = errData[firstKey];
        setError(Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val));
      } else {
        setError('Checkout failed. Please check your shipping details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const subtotal = parseFloat(cart.total_price || 0);
  const shippingFee = subtotal > 3000 ? 0 : 250;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-200 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Shipping Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="shipping_full_name"
                  required
                  value={formData.shipping_full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="shipping_phone_number"
                  required
                  value={formData.shipping_phone_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                name="shipping_street_address"
                required
                value={formData.shipping_street_address}
                onChange={handleChange}
                placeholder="123 Green Street, Phase 5"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="shipping_city"
                  required
                  value={formData.shipping_city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                <input
                  type="text"
                  name="shipping_state"
                  required
                  value={formData.shipping_state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="shipping_postal_code"
                  required
                  value={formData.shipping_postal_code}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes (Optional)</label>
              <textarea
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Gate code, special delivery instructions..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 border-primary-500 bg-primary-50/30">
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={formData.payment_method === 'COD'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="font-semibold text-gray-900 block">Cash on Delivery (COD)</span>
                  <span className="text-xs text-gray-500">Pay with cash when your plant package arrives</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all hover:bg-gray-50 border-gray-200">
                <input
                  type="radio"
                  name="payment_method"
                  value="CARD"
                  checked={formData.payment_method === 'CARD'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="font-semibold text-gray-900 block">Credit / Debit Card</span>
                  <span className="text-xs text-gray-500">Card payment processed securely upon delivery</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    {item.variant && <p className="text-xs text-gray-500">{item.variant.name}</p>}
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-800">Rs. {parseFloat(item.subtotal).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `Rs. ${shippingFee}`}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span className="text-primary-700">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
