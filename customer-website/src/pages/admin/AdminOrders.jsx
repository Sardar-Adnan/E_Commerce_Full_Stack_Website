import { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const ALL_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const { data } = await getAdminOrders(params);
      setOrders(data.results || data);
      if (data.count) setTotalPages(Math.ceil(data.count / 12));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter, search, page]);

  const handleStatusUpdate = async (orderNumber, newStatus) => {
    if (!confirm(`Update order ${orderNumber} to "${newStatus}"?`)) return;
    setUpdatingId(orderNumber);
    try {
      await updateOrderStatus(orderNumber, newStatus);
      await fetchOrders();
    } catch (err) {
      alert(err.response?.data?.status?.[0] || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="text" placeholder="Search order # or email..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-64" />
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none">
          <option value="">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} onRetry={fetchOrders} /> : orders.length === 0 ? (
        <EmptyState title="No orders found" icon="📦" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Order #</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Total</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <>
                    <tr key={order.order_number} className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === order.order_number ? null : order.order_number)}>
                      <td className="px-4 py-3 font-mono font-medium">{order.order_number}</td>
                      <td className="px-4 py-3 text-gray-600">{order.customer_email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || ''}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">Rs. {parseFloat(order.total).toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <select value={order.status} disabled={updatingId === order.order_number || order.status === 'cancelled' || order.status === 'delivered'}
                          onChange={e => handleStatusUpdate(order.order_number, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs bg-white disabled:opacity-50">
                          {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                    </tr>
                    {expandedId === order.order_number && (
                      <tr key={`${order.order_number}-details`}>
                        <td colSpan={6} className="px-4 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                              {order.items?.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm py-1">
                                  <span>{item.quantity}× {item.product_name} {item.variant_name ? `(${item.variant_name})` : ''}</span>
                                  <span className="font-medium">Rs. {parseFloat(item.subtotal).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Shipping</h4>
                              <p className="text-sm text-gray-600">{order.shipping_full_name}</p>
                              <p className="text-sm text-gray-600">{order.shipping_street_address}</p>
                              <p className="text-sm text-gray-600">{order.shipping_city}, {order.shipping_postal_code}</p>
                              <p className="text-sm text-gray-600">{order.shipping_country}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-sm border rounded disabled:opacity-40">← Prev</button>
              <span className="px-3 py-1.5 text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-sm border rounded disabled:opacity-40">Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
