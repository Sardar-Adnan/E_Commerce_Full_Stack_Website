export default function PriceDisplay({ basePrice, discountPrice, currentPrice, size = 'md' }) {
  const hasDiscount = discountPrice && parseFloat(discountPrice) < parseFloat(basePrice);
  const displayPrice = currentPrice || (hasDiscount ? discountPrice : basePrice);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      {hasDiscount ? (
        <>
          <span className="font-bold text-primary-700">Rs. {parseFloat(displayPrice).toLocaleString()}</span>
          <span className="line-through text-gray-400 text-sm">Rs. {parseFloat(basePrice).toLocaleString()}</span>
          <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {Math.round((1 - parseFloat(discountPrice) / parseFloat(basePrice)) * 100)}% OFF
          </span>
        </>
      ) : (
        <span className="font-bold text-gray-900">Rs. {parseFloat(basePrice).toLocaleString()}</span>
      )}
    </div>
  );
}
