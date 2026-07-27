import { useState, useEffect } from 'react';
import { getInventory } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('name');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, ordering };
      if (search) params.search = search;
      const { data } = await getInventory(params);
      setProducts(data.results || data);
      if (data.count) setTotalPages(Math.ceil(data.count / 12));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, [search, ordering, page]);

  const stockBadge = (qty) => {
    if (qty === 0) return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">Out of stock</span>;
    if (qty < 5) return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Low: {qty}</span>;
    return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{qty} in stock</span>;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inventory Management</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input type="text" placeholder="Search products..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none w-64" />
        <select value={ordering} onChange={e => setOrdering(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 outline-none">
          <option value="name">Name A→Z</option>
          <option value="-name">Name Z→A</option>
          <option value="base_price">Price Low→High</option>
          <option value="-base_price">Price High→Low</option>
        </select>
      </div>

      {loading ? <LoadingSpinner /> : error ? <ErrorMessage message={error} onRetry={fetchInventory} /> : products.length === 0 ? (
        <EmptyState title="No products found" icon="📋" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">SKU</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Stock</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <>
                    <tr key={p.id} className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 font-mono text-gray-500 text-xs">{p.sku}</td>
                      <td className="px-4 py-3 text-gray-600">{p.category?.name}</td>
                      <td className="px-4 py-3">Rs. {parseFloat(p.base_price).toLocaleString()}</td>
                      <td className="px-4 py-3">{stockBadge(p.stock_quantity)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>{p.is_active ? 'Active' : 'Inactive'}</span>
                      </td>
                    </tr>
                    {expandedId === p.id && p.variants?.length > 0 && (
                      <tr key={`${p.id}-variants`}>
                        <td colSpan={6} className="px-8 py-3 bg-gray-50">
                          <p className="text-xs font-medium text-gray-500 mb-2">Variants:</p>
                          {p.variants.map(v => (
                            <div key={v.id} className="flex items-center justify-between py-1.5 text-sm">
                              <span className="text-gray-700">{v.name}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-gray-500">Rs. {parseFloat(v.price).toLocaleString()}</span>
                                {stockBadge(v.stock_quantity)}
                              </div>
                            </div>
                          ))}
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
