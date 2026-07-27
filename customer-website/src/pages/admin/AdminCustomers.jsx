import { useState, useEffect } from 'react';
import { getCustomers } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-date_joined');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, ordering };
      if (search) params.search = search;
      const { data } = await getCustomers(params);
      setCustomers(data.results || data);
      if (data.count) setTotalPages(Math.ceil(data.count / 12));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, [search, ordering, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input type="text" placeholder="Search by email, name..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none w-64" />
        <select value={ordering} onChange={e => setOrdering(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none">
          <option value="-date_joined">Newest First</option>
          <option value="date_joined">Oldest First</option>
          <option value="email">Email A→Z</option>
          <option value="-total_spent">Top Spenders</option>
          <option value="-order_count">Most Orders</option>
        </select>
      </div>

      {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} onRetry={fetchCustomers} /> : customers.length === 0 ? (
        <EmptyState title="No customers found" icon="👥" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Username</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Joined</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Orders</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.email}</td>
                    <td className="px-4 py-3 text-gray-600">{c.username}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone_number || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(c.date_joined).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{c.order_count}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">Rs. {parseFloat(c.total_spent || 0).toLocaleString()}</td>
                  </tr>
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
