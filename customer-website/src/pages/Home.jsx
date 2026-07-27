import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../api/products';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const valueProps = [
  { icon: '🌱', title: 'Expert Curated', desc: 'Every plant hand-picked by horticulture experts' },
  { icon: '🐾', title: 'Pet-Safe Options', desc: 'Clearly labeled pet-friendly plants for your furry friends' },
  { icon: '📖', title: 'Care Guides Included', desc: 'Detailed care instructions with every purchase' },
  { icon: '🚚', title: 'Free Shipping', desc: 'Free delivery on orders over Rs. 3,000' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          getProducts({ is_featured: true, page_size: 8 }),
          getCategories(),
        ]);
        setFeatured(prodRes.data.results || prodRes.data);
        setCategories(catRes.data.results || catRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🌿</div>
          <div className="absolute bottom-10 right-10 text-9xl">🪴</div>
          <div className="absolute top-1/2 left-1/2 text-7xl">🌱</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Bring Nature <span className="text-primary-300">Indoors</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
              Discover our curated collection of premium indoor plants, stylish planters, and everything you need to create your own urban jungle.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-800 font-bold rounded-xl hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Shop Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Plants</h2>
            <p className="text-gray-500 mt-1">Our most popular picks</p>
          </div>
          <Link to="/products?is_featured=true" className="text-primary-600 font-medium hover:text-primary-700 transition-colors text-sm">
            View All →
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No featured products yet.</p>
        )}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="group relative bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-primary-100"
                >
                  <div className="text-3xl mb-3">🌿</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">Why Leaf & Bloom?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{prop.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{prop.title}</h3>
              <p className="text-sm text-gray-500">{prop.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
