import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../api/products';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import useDebounce from '../hooks/useDebounce';

const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest' },
  { value: 'base_price', label: 'Price: Low → High' },
  { value: '-base_price', label: 'Price: High → Low' },
  { value: 'name', label: 'Name A → Z' },
];

const LIGHT_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'low', label: 'Low Light' },
  { value: 'medium', label: 'Medium Light' },
  { value: 'bright', label: 'Bright Indirect' },
  { value: 'direct', label: 'Direct Sunlight' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Read filters from URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const ordering = searchParams.get('ordering') || '-created_at';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const isPetSafe = searchParams.get('is_pet_safe') || '';
  const lightReq = searchParams.get('light_requirement') || '';
  const priceGte = searchParams.get('base_price__gte') || '';
  const priceLte = searchParams.get('base_price__lte') || '';
  const isFeatured = searchParams.get('is_featured') || '';

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync debounced search to URL
  useEffect(() => {
    const current = searchParams.get('search') || '';
    if (debouncedSearch !== current) {
      updateParams({ search: debouncedSearch || undefined, page: undefined });
    }
  }, [debouncedSearch]);

  const updateParams = useCallback((updates) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === '') next.delete(k);
        else next.set(k, v);
      });
      return next;
    });
  }, [setSearchParams]);

  // Fetch categories once
  useEffect(() => {
    getCategories().then(res => setCategories(res.data.results || res.data)).catch(() => {});
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, ordering };
        if (search) params.search = search;
        if (category) params.category = category;
        if (isPetSafe) params.is_pet_safe = isPetSafe;
        if (lightReq) params.light_requirement = lightReq;
        if (priceGte) params.base_price__gte = priceGte;
        if (priceLte) params.base_price__lte = priceLte;
        if (isFeatured) params.is_featured = isFeatured;

        const { data } = await getProducts(params);
        setProducts(data.results || data);
        if (data.count) setTotalPages(Math.ceil(data.count / 12));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, ordering, page, isPetSafe, lightReq, priceGte, priceLte, isFeatured]);

  const clearFilters = () => setSearchParams({});
  const hasFilters = category || isPetSafe || lightReq || priceGte || priceLte || search || isFeatured;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Our Plants</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          {showFilters ? 'Hide Filters' : 'Filters'}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Filter sidebar */}
        <aside className={`w-full lg:w-64 shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Search</label>
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search plants..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select
              value={category}
              onChange={e => updateParams({ category: e.target.value || undefined, page: undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Range</label>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={priceGte}
                onChange={e => updateParams({ base_price__gte: e.target.value || undefined, page: undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <input type="number" placeholder="Max" value={priceLte}
                onChange={e => updateParams({ base_price__lte: e.target.value || undefined, page: undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Light Requirement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Light Requirement</label>
            <select value={lightReq}
              onChange={e => updateParams({ light_requirement: e.target.value || undefined, page: undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
            >
              {LIGHT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Pet Safe Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isPetSafe === 'true'}
              onChange={e => updateParams({ is_pet_safe: e.target.checked ? 'true' : undefined, page: undefined })}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">🐾 Pet-safe only</span>
          </label>

          {/* Clear */}
          {hasFilters && (
            <button onClick={clearFilters} className="w-full py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
              Clear All Filters
            </button>
          )}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{loading ? '...' : `${products.length} products`}</p>
            <select value={ordering}
              onChange={e => updateParams({ ordering: e.target.value, page: undefined })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Product grid */}
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} onRetry={() => window.location.reload()} />
          ) : products.length === 0 ? (
            <EmptyState title="No products found" message="Try adjusting your filters or search query." icon="🔍" />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button disabled={page <= 1}
                    onClick={() => updateParams({ page: page - 1 })}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >← Prev</button>
                  <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {totalPages}</span>
                  <button disabled={page >= totalPages}
                    onClick={() => updateParams({ page: page + 1 })}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                  >Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
