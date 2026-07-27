import { Link } from 'react-router-dom';
import PriceDisplay from './PriceDisplay';

export default function ProductCard({ product }) {
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
  const isOutOfStock = product.stock_quantity === 0 && !product.in_stock;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100 hover:border-primary-200"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.image}
            alt={primaryImage.alt_text || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock && (
            <span className="bg-gray-900/80 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
              Out of Stock
            </span>
          )}
          {product.is_pet_safe && (
            <span className="bg-primary-500/90 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
              🐾 Pet Safe
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {product.category && (
          <span className="text-xs font-medium text-primary-600 uppercase tracking-wider">
            {product.category.name}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto pt-2">
          <PriceDisplay
            basePrice={product.base_price}
            discountPrice={product.discount_price}
            currentPrice={product.current_price}
            size="sm"
          />
        </div>
      </div>
    </Link>
  );
}
