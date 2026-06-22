import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'

const ProductCard = ({ product }) => {
  const { addItem } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // If product has colors, add the first color variant
    let cartItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      img: product.img
    }
    
    // If product has colors, use the first color as default
    if (product.hasColors && product.colors && product.colors.length > 0) {
      const firstColor = product.colors[0]
      cartItem = {
        ...cartItem,
        name: `${product.name} - ${firstColor.name}`,
        price: firstColor.price || product.price,
        img: firstColor.img || product.img,
        color: {
          name: firstColor.name,
          hex: firstColor.hex
        }
      }
    }
    
    addItem(cartItem)
  }

  const productId = product._id || product.id
  const discountPercent = product.discountPercent || 0

  // Get total stock (for color products)
  const totalStock = product.hasColors && product.colors
    ? product.colors.reduce((sum, c) => sum + (c.stock || 0), 0)
    : product.stock || 0

  return (
    <Link to={`/product/${productId}`} className="group flex flex-col product-card-zoom">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-secondary-container mb-stack-md shadow-[0_10px_30px_rgba(244,194,194,0.15)]">
        <img 
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          src={product.img}
          alt={product.name}
          loading="lazy"
        />
        
        {discountPercent > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {discountPercent}% OFF
          </div>
        )}
        
        {product.tag && (
          <div className={`absolute top-4 ${discountPercent > 0 ? 'left-[90px]' : 'left-4'} bg-primary-container/90 backdrop-blur-sm px-3 py-1 rounded-full`}>
            <span className="text-on-primary-container font-label-caps text-[10px]">{product.tag}</span>
          </div>
        )}
        
        {/* Color swatches */}
        {product.hasColors && product.colors && product.colors.length > 0 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {product.colors.slice(0, 4).map((color, idx) => (
              <div 
                key={idx}
                className="w-5 h-5 rounded-full border border-outline-variant"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-on-surface-variant px-1">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
        
        <button 
          onClick={handleAddToCart}
          disabled={totalStock <= 0}
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] py-3 rounded-full font-label-caps text-label-caps opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 backdrop-blur-md ${
            totalStock > 0 
              ? 'bg-on-background/90 text-white' 
              : 'bg-gray-400/90 text-gray-200 cursor-not-allowed'
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {totalStock > 0 ? 'QUICK VIEW' : 'OUT OF STOCK'}
        </button>
      </div>
      <div className="flex flex-col space-y-1">
        <h3 className="font-playfair text-on-surface text-[18px]">{product.name}</h3>
        <p className="text-outline text-body-md">{product.desc}</p>
        <div className="flex items-center gap-3 mt-1">
          <p className="font-semibold text-primary">₹{product.price.toFixed(2)}</p>
          {product.mrp && product.mrp > product.price && (
            <>
              <p className="text-outline text-sm line-through">₹{product.mrp.toFixed(2)}</p>
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  {discountPercent}% OFF
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard