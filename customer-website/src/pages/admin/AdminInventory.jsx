import { useState, useEffect } from 'react';
import { getInventory } from '../../api/admin';
import { getCategories, createProduct, updateProduct, deleteProduct } from '../../api/products';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    base_price: '',
    discount_price: '',
    sku: '',
    stock_quantity: '10',
    is_pet_safe: false,
    is_active: true,
    is_featured: false,
    light_requirement: 'medium',
    description: '',
    care_instructions: '',
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, ordering };
      if (search) params.search = search;
      const [invRes, catRes] = await Promise.all([
        getInventory(params),
        getCategories(),
      ]);
      setProducts(invRes.data.results || invRes.data);
      setCategories(catRes.data.results || catRes.data);
      if (invRes.data.count) setTotalPages(Math.ceil(invRes.data.count / 12));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, ordering, page]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      base_price: '',
      discount_price: '',
      sku: `LNB-PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      stock_quantity: '10',
      is_pet_safe: false,
      is_active: true,
      is_featured: false,
      light_requirement: 'medium',
      description: '',
      care_instructions: '',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category_id: product.category?.id || categories[0]?.id || '',
      base_price: product.base_price || '',
      discount_price: product.discount_price || '',
      sku: product.sku || '',
      stock_quantity: String(product.stock_quantity || 0),
      is_pet_safe: !!product.is_pet_safe,
      is_active: !!product.is_active,
      is_featured: !!product.is_featured,
      light_requirement: product.light_requirement || 'medium',
      description: product.description || '',
      care_instructions: product.care_instructions || '',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProduct(slug);
      await fetchData();
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError(null);

    const payload = {
      ...formData,
      base_price: parseFloat(formData.base_price || 0).toFixed(2),
      discount_price: formData.discount_price ? parseFloat(formData.discount_price).toFixed(2) : null,
      stock_quantity: parseInt(formData.stock_quantity || 0, 10),
      category_id: parseInt(formData.category_id, 10),
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.slug, payload);
      } else {
        await createProduct(payload);
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      const errData = err.response?.data;
      if (errData && typeof errData === 'object') {
        const rawErrors = errData.errors || errData;
        const msg = Object.entries(rawErrors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' | ');
        setModalError(msg);
      } else {
        setModalError(err.message || 'Failed to save product.');
      }
    } finally {
      setSaving(false);
    }
  };

  const stockBadge = (qty) => {
    if (qty === 0) return <span className="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Out of Stock</span>;
    if (qty < 5) return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">Low: {qty}</span>;
    return <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{qty} in stock</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Inventory & Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product catalog, prices, stock levels, and pet safety flags</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all flex items-center gap-2"
        >
          <span>➕ Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name, SKU, or category..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none w-72 bg-white"
        />
        <select
          value={ordering}
          onChange={e => setOrdering(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
        >
          <option value="-created_at">Newest First</option>
          <option value="name">Name A → Z</option>
          <option value="-name">Name Z → A</option>
          <option value="base_price">Price Low → High</option>
          <option value="-base_price">Price High → Low</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchData} />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" message="Try searching or click + Add Product to create one." icon="🌿" />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{p.name}</div>
                      {p.is_pet_safe && <span className="text-xs text-primary-600 font-medium">🐾 Pet Safe</span>}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.sku}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium">
                        {p.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      Rs. {parseFloat(p.current_price || p.base_price).toLocaleString()}
                      {p.discount_price && (
                        <span className="line-through text-xs text-gray-400 block font-normal">
                          Rs. {parseFloat(p.base_price).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{stockBadge(p.stock_quantity)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.slug, p.name)}
                          className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 font-medium"
              >
                ← Previous
              </button>
              <span className="text-gray-600 font-medium">Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 font-medium"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-2xl font-extrabold text-gray-900">
                {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                ✕
              </button>
            </div>

            {modalError && (
              <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-200 font-medium">
                {modalError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Monstera Deliciosa"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Base Price (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.base_price}
                    onChange={e => setFormData({ ...formData, base_price: e.target.value })}
                    placeholder="2450.00"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Price (Rs.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_price}
                    onChange={e => setFormData({ ...formData, discount_price: e.target.value })}
                    placeholder="1950.00 (Optional)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
                    placeholder="15"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Light Requirement</label>
                  <select
                    value={formData.light_requirement}
                    onChange={e => setFormData({ ...formData, light_requirement: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
                  >
                    <option value="low">🌙 Low Light</option>
                    <option value="medium">☁️ Medium Light</option>
                    <option value="bright">🌤️ Bright Indirect</option>
                    <option value="direct">☀️ Direct Sunlight</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.image_url || ''}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tropical indoor plant with glossy leaves..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Care Instructions</label>
                <textarea
                  rows={2}
                  value={formData.care_instructions}
                  onChange={e => setFormData({ ...formData, care_instructions: e.target.value })}
                  placeholder="Water when top soil feels dry..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.is_pet_safe}
                    onChange={e => setFormData({ ...formData, is_pet_safe: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span>🐾 Pet Safe</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span>⭐ Featured</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
