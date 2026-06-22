import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../api/database'
import { useCart } from '../../contexts/CartContext'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const { addItem } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)

  // Get all images including color images
  const getAllImages = () => {
    if (!product) return []

    let images = []

    // If a color is selected, show color images first
    if (selectedColor) {
      images.push(selectedColor.img)
    }

    // Add main product images
    images.push(product.img)

    // Add additional product images
    if (product.images && product.images.length > 0) {
      images.push(...product.images)
    }

    // Remove duplicates
    return [...new Set(images)]
  }

  // Get color price and discount
  const getColorPrice = () => {
    if (selectedColor) {
      return {
        price: selectedColor.price,
        mrp: selectedColor.mrp,
        discount: selectedColor.mrp && selectedColor.price && selectedColor.mrp > 0
          ? Math.round(((selectedColor.mrp - selectedColor.price) / selectedColor.mrp) * 100)
          : 0
      }
    }
    return {
      price: product?.price || 0,
      mrp: product?.mrp || 0,
      discount: product?.discountPercent || 0
    }
  }

  // Get color stock
  const getColorStock = () => {
    if (selectedColor) {
      return selectedColor.stock || 0
    }
    return product?.stock || 0
  }

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // console.log('🔍 Loading product with ID:', id)
        const data = await api.getProduct(id)
        // console.log('📦 Product loaded:', data)

        if (data) {
          data.id = data._id || data.id || id
          setProduct(data)

          // Set default selected color if colors exist
          if (data.hasColors && data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0])
            setSelectedColorIndex(0)
          }
        }
      } catch (error) {
        console.error('Error loading product:', error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      loadProduct()
    }
  }, [id])

  const handleColorSelect = (color, index) => {
    setSelectedColor(color)
    setSelectedColorIndex(index)
    setSelectedImage(0) // Reset image selection when color changes
  }

  const handleAddToCart = () => {
    if (product) {
      // If product has colors and a color is selected, include color info
      const cartItem = {
        id: product._id || product.id,
        name: selectedColor ? `${product.name} - ${selectedColor.name}` : product.name,
        price: getColorPrice().price,
        img: selectedColor ? selectedColor.img : product.img,
        color: selectedColor ? {
          name: selectedColor.name,
          hex: selectedColor.hex
        } : null
      }

      for (let i = 0; i < quantity; i++) {
        addItem(cartItem)
      }

      // Show feedback
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  const discountPercent = getColorPrice().discount
  const currentPrice = getColorPrice().price
  const currentMrp = getColorPrice().mrp
  const currentStock = getColorStock()
  const allImages = getAllImages()

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-container rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-7">
              <div className="aspect-[4/5] bg-secondary-container rounded-2xl"></div>
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="h-8 bg-secondary-container rounded w-3/4"></div>
              <div className="h-6 bg-secondary-container rounded w-1/2"></div>
              <div className="h-24 bg-secondary-container rounded"></div>
              <div className="h-12 bg-secondary-container rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl text-center">
        <span className="material-symbols-outlined text-6xl text-outline mb-4 block">error</span>
        <h2 className="font-playfair text-headline-md">Product Not Found</h2>
        <p className="text-on-surface-variant mt-2">The product you're looking for doesn't exist.</p>
        <Link to="/shop" className="inline-block mt-6 bg-primary text-on-primary px-8 py-3 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors">
          Return to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-stack-lg text-on-secondary-fixed-variant font-label-caps">
        <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
        <span className="material-symbols-outlined text-[12px]">chevron_right</span>
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Gallery */}
        <div className="lg:col-span-7">
          {/* Main Image */}
          <div className="overflow-hidden rounded-2xl aspect-[4/5] bg-secondary-container shadow-[0_10px_40px_rgba(244,194,194,0.15)] mb-4">
            <img
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              src={allImages[selectedImage] || product.img}
              alt={selectedColor ? `${product.name} - ${selectedColor.name}` : product.name}
            />
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden bg-secondary-container border-2 transition-all ${selectedImage === index ? 'border-primary' : 'border-transparent hover:border-primary/50'
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-stack-md">
          {product.tag && (
            <span className="inline-block px-3 py-1 bg-primary-container/30 text-on-primary-container rounded-full font-label-caps uppercase">
              {product.tag}
            </span>
          )}
          <h1 className="font-playfair text-headline-md text-on-background">
            {product.name}
            {selectedColor && (
              <span className="text-primary ml-2 text-2xl">- {selectedColor.name}</span>
            )}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center text-primary">
              {[1, 2, 3, 4].map(i => (
                <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
              <span className="material-symbols-outlined">star_half</span>
              <span className="ml-2 font-body-md text-on-secondary-fixed-variant">({product.reviews || 128} Reviews)</span>
            </div>
          </div>

          {/* Price with MRP and Discount */}
          <div className="py-4">
            <div className="flex items-center gap-4">
              <span className="font-playfair text-[32px] text-primary font-bold">
                ₹{currentPrice.toFixed(2)}
              </span>
              {currentMrp && currentMrp > currentPrice && (
                <>
                  <span className="text-outline text-lg line-through">₹{currentMrp.toFixed(2)}</span>
                  {discountPercent > 0 && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      {discountPercent}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Stock Status */}
            {product.hasColors && selectedColor ? (
              <p className={`mt-2 text-sm font-semibold ${currentStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {currentStock > 0 ? `In Stock (${currentStock} units)` : 'Out of Stock'}
              </p>
            ) : (
              <p className={`mt-2 text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </p>
            )}

            <p className="mt-4 font-body-lg text-on-surface-variant leading-relaxed">
              {product.details || product.desc}
            </p>
          </div>

          {/* Color Variants Selection */}
          {product.hasColors && product.colors && product.colors.length > 0 && (
            <div className="py-4 border-t border-outline-variant">
              <p className="font-label-caps text-label-caps text-on-surface-variant mb-3">
                Select Color
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorSelect(color, index)}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${selectedColorIndex === index
                        ? 'border-primary bg-primary-container/20'
                        : 'border-outline-variant hover:border-primary/50'
                      }`}
                  >
                    {/* Color Swatch */}
                    <div
                      className="w-8 h-8 rounded-full border-2 border-outline-variant flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className={`text-sm font-medium ${selectedColorIndex === index ? 'text-primary' : 'text-on-surface-variant'
                      }`}>
                      {color.name}
                    </span>
                    {/* Stock indicator */}
                    {color.stock <= 0 && (
                      <span className="text-xs text-red-500">(Out of Stock)</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="space-y-6 pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between px-4 py-3 border border-outline-variant rounded-lg w-full sm:w-32 bg-surface-container-lowest">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="material-symbols-outlined text-on-surface-variant"
                >
                  remove
                </button>
                <span className="font-body-md font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="material-symbols-outlined text-on-surface-variant"
                >
                  add
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className={`flex-1 py-4 rounded-lg font-label-caps uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${currentStock > 0
                    ? 'bg-on-background text-white hover:bg-primary'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {currentStock > 0 ? (
                  <>
                    Add to Bag
                    <span className="material-symbols-outlined">shopping_bag</span>
                  </>
                ) : (
                  'Out of Stock'
                )}
              </button>
            </div>
            <button className="w-full py-4 border border-outline-variant rounded-lg font-label-caps uppercase tracking-widest text-on-surface hover:bg-surface-container-low transition-all">
              Buy with Apple Pay
            </button>
          </div>

          {/* Details Accordion */}
          <div className="pt-stack-md border-t border-outline-variant">
            <details className="group py-4">
              <summary className="flex justify-between items-center cursor-pointer list-none font-label-caps uppercase text-on-background">
                Key Ingredients
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="pt-4 font-body-md text-on-surface-variant space-y-2">
                <p><strong>Rose Quartz Crystals:</strong> Crushed and infused for energetic radiance and gentle mineral exfoliation.</p>
                <p><strong>Hyaluronic Acid:</strong> Multi-molecular weight for hydration across all skin layers.</p>
              </div>
            </details>
            <details className="group py-4 border-t border-outline-variant">
              <summary className="flex justify-between items-center cursor-pointer list-none font-label-caps uppercase text-on-background">
                How To Use
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="pt-4 font-body-md text-on-surface-variant">
                <p>Apply 3-4 drops onto clean, damp skin morning and night. Press gently until fully absorbed before applying moisturizer.</p>
              </div>
            </details>
            <details className="group py-4 border-t border-outline-variant">
              <summary className="flex justify-between items-center cursor-pointer list-none font-label-caps uppercase text-on-background">
                Shipping & Returns
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="pt-4 font-body-md text-on-surface-variant">
                <p>Complimentary standard shipping on all orders over ₹1000. Returns accepted within 30 days of purchase.</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail