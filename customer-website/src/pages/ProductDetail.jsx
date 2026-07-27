import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PriceDisplay from '../components/PriceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const LIGHT_LABELS = { low: '🌙 Low Light', medium: '☁️ Medium Light', bright: '🌤️ Bright Indirect', direct: '☀️ Direct Sunlight' };

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getProduct(slug);
        setProduct(data);
        if (data.variants?.length > 0) setSelectedVariant(data.variants[0]);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Product not found.' : err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-16"><ErrorMessage message={error} /></div>;
  if (!product) return null;

  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
  const currentPrice = selectedVariant?.price || product.current_price;
  const isOutOfStock = currentStock === 0;
  const images = product.images || [];

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setCartMessage(null);
    try {
      await addItem(product.id, selectedVariant?.id, quantity);
      setCartMessage({ type: 'success', text: 'Added to cart!' });
      setTimeout(() => setCartMessage(null), 3000);
    } catch (err) {
      const errData = err.response?.data;
      const msg = typeof errData === 'object'
        ? Object.values(errData).flat().join(' ')
        : errData || 'Failed to add to cart';
      setCartMessage({ type: 'error', text: msg });
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        {product.category && (
          <><Link to={`/products?category=${product.category.id}`} className="hover:text-primary-600">{product.category.name}</Link><span>/</span></>
        )}
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
            {images.length > 0 ? (
              <img src={images[mainImage]?.image} alt={images[mainImage]?.alt_text || product.name}
                className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button key={img.id} onClick={() => setMainImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                    i === mainImage ? 'border-primary-500' : 'border-transparent hover:border-gray-300'
                  }`}>
                  <img src={img.image} alt={img.alt_text || ''} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          {product.category && (
            <span className="text-sm font-medium text-primary-600 uppercase tracking-wider">{product.category.name}</span>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <PriceDisplay basePrice={product.base_price} discountPrice={product.discount_price}
            currentPrice={currentPrice} size="xl" />

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.light_requirement && (
              <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                {LIGHT_LABELS[product.light_requirement] || product.light_requirement}
              </span>
            )}
            {product.is_pet_safe && (
              <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">🐾 Pet Safe</span>
            )}
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              isOutOfStock ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {isOutOfStock ? 'Out of Stock' : `${currentStock} in stock`}
            </span>
          </div>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size / Variant</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button key={v.id} onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      selectedVariant?.id === v.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                    {v.name} — Rs. {parseFloat(v.price).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50" disabled={quantity <= 1}>−</button>
              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50" disabled={quantity >= currentStock}>+</button>
            </div>
            <button onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {addingToCart ? 'Adding...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {cartMessage && (
            <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
              cartMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>{cartMessage.text}</div>
          )}

          {/* Tabs */}
          <div className="border-t pt-6">
            <div className="flex gap-4 border-b mb-4">
              {['description', ...(product.care_instructions ? ['care'] : [])].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}>{tab === 'care' ? 'Care Instructions' : tab}</button>
              ))}
            </div>
            {activeTab === 'description' && (
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            )}
            {activeTab === 'care' && product.care_instructions && (
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.care_instructions}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
