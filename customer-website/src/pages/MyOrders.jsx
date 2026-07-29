import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, cancelOrder } from '../api/orders';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const STATUS_BADGES = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getOrders();
      setOrders(data.results || data);
    } catch (err) {
      setError(err.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderNumber) => {
    if (!window.confirm(`Are you sure you want to cancel order #${orderNumber}?`)) return;
    setCancellingId(orderNumber);
    setActionMsg(null);
    try {
      await cancelOrder(orderNumber);
      setActionMsg({ type: 'success', text: `Order #${orderNumber} cancelled successfully.` });
      await fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.status || err.message || 'Failed to cancel order';
      setActionMsg({ type: 'error', text: String(msg) });
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-12"><ErrorMessage message={error} onRetry={fetchOrders} /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">Track order status, view items, and manage your plant purchases</p>
      </div>

      {actionMsg && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${
          actionMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {actionMsg.text}
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          message="You haven't placed any plant orders yet. Start exploring our catalog!"
          icon="📦"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusKey = (order.status || 'pending').toLowerCase();
            const badgeClass = STATUS_BADGES[statusKey] || STATUS_BADGES.pending;
            const canCancel = ['pending', 'confirmed'].includes(statusKey);

            return (
              <div key={order.order_number} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                {/* Header */}
                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 text-lg">Order #{order.order_number}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeClass}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400 block font-medium">Total Amount</span>
                    <span className="text-lg font-extrabold text-primary-800">Rs. {parseFloat(order.total).toLocaleString()}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Items List */}
                  <div className="divide-y divide-gray-100">
                    {order.items?.map((item) => (
                      <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                        <div>
                          <p className="font-bold text-gray-900">{item.product_name}</p>
                          {item.variant_name && <p className="text-xs text-gray-500">{item.variant_name}</p>}
                          <p className="text-xs text-gray-400">Qty: {item.quantity} × Rs. {parseFloat(item.unit_price).toLocaleString()}</p>
                        </div>
                        <span className="font-semibold text-gray-800">
                          Rs. {(parseFloat(item.unit_price) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping & Payment Footer */}
                  <div className="border-t border-gray-100 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-800">Shipping to: </span>
                      {order.shipping_full_name}, {order.shipping_street_address}, {order.shipping_city} ({order.shipping_phone_number})
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-md font-mono text-gray-700 uppercase">
                        {order.payment_method}
                      </span>
                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order.order_number)}
                          disabled={cancellingId === order.order_number}
                          className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-xl text-xs transition-colors disabled:opacity-50"
                        >
                          {cancellingId === order.order_number ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
