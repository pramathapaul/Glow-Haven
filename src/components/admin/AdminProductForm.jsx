import React, { useState, useEffect } from 'react'

const AdminProductForm = ({ product, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    mrp: '',
    price: '',
    desc: '',
    details: '',
    img: '',
    images: [],
    hasColors: false,
    colors: [],
    stock: '',
    tag: '',
    isActive: true
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [newImage, setNewImage] = useState('')
  const [newColor, setNewColor] = useState({ 
    name: '', 
    hex: '#000000', 
    img: '', 
    mrp: '', 
    price: '', 
    stock: '', 
    sku: '' 
  })
  const [colorPreview, setColorPreview] = useState(null)

  const categories = ['Serums', 'Moisturizers', 'Cleansers', 'Masks', 'Toners', 'Eye Care', 'Sun Care', 'Lipsticks', 'Nail Polish', 'Makeup', 'Accessories']
  const tags = ['NEW IN', 'BEST SELLER', 'VEGAN', 'LIMITED EDITION', 'SALE', '']

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        mrp: product.mrp || '',
        price: product.price || '',
        desc: product.desc || '',
        details: product.details || '',
        img: product.img || '',
        images: product.images || [],
        hasColors: product.hasColors || false,
        colors: product.colors || [],
        stock: product.stock || '',
        tag: product.tag || '',
        isActive: product.isActive !== undefined ? product.isActive : true
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleColorChange = (e) => {
    const { name, value } = e.target
    setNewColor(prev => ({ ...prev, [name]: value }))
    
    if (name === 'hex') {
      setColorPreview(value)
    }
  }

  // Image management functions
  const addImage = () => {
    if (!newImage.trim()) {
      setErrors({ imgUrl: 'Please enter an image URL' })
      return
    }
    
    // Validate URL
    try {
      new URL(newImage)
    } catch {
      setErrors({ imgUrl: 'Please enter a valid URL' })
      return
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImage.trim()]
    }))
    setNewImage('')
    setErrors({})
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const moveImage = (index, direction) => {
    const newImages = [...formData.images]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newImages.length) return
    
    const temp = newImages[index]
    newImages[index] = newImages[targetIndex]
    newImages[targetIndex] = temp
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  // Color management functions
  const addColor = () => {
    const newErrors = {}
    if (!newColor.name) newErrors.colorName = 'Color name is required'
    if (!newColor.hex) newErrors.colorHex = 'Hex code is required'
    if (!newColor.img) newErrors.colorImg = 'Color image is required'
    if (!newColor.mrp) newErrors.colorMrp = 'MRP is required'
    if (!newColor.price) newErrors.colorPrice = 'Selling price is required'
    else if (parseFloat(newColor.price) > parseFloat(newColor.mrp)) {
      newErrors.colorPrice = 'Selling price cannot be greater than MRP'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { 
        ...newColor, 
        mrp: parseFloat(newColor.mrp) || 0,
        price: parseFloat(newColor.price) || 0,
        stock: parseInt(newColor.stock) || 0 
      }]
    }))
    setNewColor({ name: '', hex: '#000000', img: '', mrp: '', price: '', stock: '', sku: '' })
    setColorPreview(null)
    setErrors({})
  }

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }))
  }

  const updateColor = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => 
        i === index ? { ...color, [field]: value } : color
      )
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Product name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.mrp) newErrors.mrp = 'MRP is required'
    else if (isNaN(formData.mrp) || parseFloat(formData.mrp) < 0) newErrors.mrp = 'Please enter a valid MRP'
    if (!formData.price) newErrors.price = 'Selling price is required'
    else if (isNaN(formData.price) || parseFloat(formData.price) < 0) newErrors.price = 'Please enter a valid price'
    else if (parseFloat(formData.price) > parseFloat(formData.mrp)) {
      newErrors.price = 'Selling price cannot be greater than MRP'
    }
    if (!formData.desc) newErrors.desc = 'Short description is required'
    if (!formData.details) newErrors.details = 'Product details are required'
    if (!formData.img) newErrors.img = 'Main product image is required'
    
    if (formData.hasColors && formData.colors.length === 0) {
      newErrors.colors = 'Please add at least one color variant'
    }
    
    if (!formData.hasColors && (!formData.stock || isNaN(formData.stock))) {
      newErrors.stock = 'Please enter a valid stock quantity'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateDiscount = (mrp, price) => {
    if (!mrp || !price || parseFloat(mrp) === 0) return 0
    return Math.round(((parseFloat(mrp) - parseFloat(price)) / parseFloat(mrp)) * 100)
  }

  const mainDiscount = calculateDiscount(formData.mrp, formData.price)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const productData = {
        ...formData,
        mrp: parseFloat(formData.mrp),
        price: parseFloat(formData.price),
        stock: formData.hasColors ? 0 : parseInt(formData.stock) || 0,
        images: formData.images || []
      }
      
      if (productData.hasColors) {
        productData.colors = productData.colors.map(color => ({
          ...color,
          mrp: parseFloat(color.mrp) || 0,
          price: parseFloat(color.price) || 0,
          stock: parseInt(color.stock) || 0
        }))
      }

      onSave(productData)
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(244,194,194,0.15)] p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-playfair text-headline-sm">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button
          onClick={onCancel}
          className="text-outline hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full bg-surface-container-low border-b-2 ${
                errors.name ? 'border-error' : 'border-outline-variant focus:border-primary'
              } py-2 px-0 focus:ring-0 outline-none transition-colors`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full bg-surface-container-low border-b-2 ${
                errors.category ? 'border-error' : 'border-outline-variant focus:border-primary'
              } py-2 px-0 focus:ring-0 outline-none transition-colors`}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-error text-xs mt-1">{errors.category}</p>}
          </div>
        </div>

        <div>
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
            Subcategory
          </label>
          <input
            type="text"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-2 px-0 focus:ring-0 outline-none transition-colors"
            placeholder="e.g., Liquid, Matte, Glossy"
          />
        </div>

        {/* Pricing Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-surface-container-low rounded-lg">
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
              MRP (₹) *
            </label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              className={`w-full bg-surface-container-low border-b-2 ${
                errors.mrp ? 'border-error' : 'border-outline-variant focus:border-primary'
              } py-2 px-0 focus:ring-0 outline-none transition-colors`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.mrp && <p className="text-error text-xs mt-1">{errors.mrp}</p>}
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
              Selling Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full bg-surface-container-low border-b-2 ${
                errors.price ? 'border-error' : 'border-outline-variant focus:border-primary'
              } py-2 px-0 focus:ring-0 outline-none transition-colors`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.price && <p className="text-error text-xs mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
              Discount
            </label>
            <div className="py-2 px-3 bg-surface-container rounded-lg text-center">
              <span className="text-xl font-bold text-green-600">
                {mainDiscount > 0 ? `${mainDiscount}% OFF` : 'No Discount'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
            Tag
          </label>
          <select
            name="tag"
            value={formData.tag}
            onChange={handleChange}
            className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-2 px-0 focus:ring-0 outline-none transition-colors"
          >
            {tags.map(tag => (
              <option key={tag || 'none'} value={tag}>{tag || 'None'}</option>
            ))}
          </select>
        </div>

        {/* Multiple Images Section */}
        <div className="border border-outline-variant rounded-xl p-4 space-y-4">
          <h4 className="font-semibold text-on-surface">Product Images</h4>
          
          {/* Main Image */}
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
              Main Image URL *
            </label>
            <input
              type="text"
              name="img"
              value={formData.img}
              onChange={handleChange}
              className={`w-full bg-surface-container-low border-b-2 ${
                errors.img ? 'border-error' : 'border-outline-variant focus:border-primary'
              } py-2 px-0 focus:ring-0 outline-none transition-colors`}
              placeholder="https://example.com/main-image.jpg"
            />
            {errors.img && <p className="text-error text-xs mt-1">{errors.img}</p>}
            {formData.img && (
              <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden bg-secondary-container">
                <img src={formData.img} alt="Main" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
              Additional Images
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="flex-1 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-2 px-0 focus:ring-0 outline-none transition-colors"
                placeholder="https://example.com/image-1.jpg"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-on-background transition-colors"
              >
                Add
              </button>
            </div>
            {errors.imgUrl && <p className="text-error text-xs mt-1">{errors.imgUrl}</p>}
            
            {/* Image Gallery Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-3">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-secondary-container">
                      <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'up')}
                        className="text-white hover:bg-white/20 p-1 rounded"
                        disabled={index === 0}
                      >
                        <span className="material-symbols-outlined text-sm">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'down')}
                        className="text-white hover:bg-white/20 p-1 rounded"
                        disabled={index === formData.images.length - 1}
                      >
                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:bg-red-500/20 p-1 rounded"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-on-surface-variant mt-2">
              {formData.images.length} additional image{formData.images.length !== 1 ? 's' : ''} added
            </p>
          </div>
        </div>

        {/* Color Variants Toggle */}
        <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="hasColors"
              checked={formData.hasColors}
              onChange={handleChange}
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
            />
            <span className="font-label-caps text-label-caps">This product has color variants</span>
          </label>
          <span className="text-xs text-on-surface-variant">
            (e.g., Lipsticks, Nail Polish, Eyeshadows)
          </span>
        </div>

        {/* Color Variants Section */}
        {formData.hasColors && (
          <div className="border border-outline-variant rounded-xl p-4 space-y-4">
            <h4 className="font-semibold text-on-surface">Color Variants</h4>
            
            {/* Add Color Form */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
              <div>
                <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1">
                  Color Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newColor.name}
                  onChange={handleColorChange}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-1 px-0 focus:ring-0 outline-none transition-colors text-sm"
                  placeholder="Rose Pink"
                />
                {errors.colorName && <p className="text-error text-xs mt-1">{errors.colorName}</p>}
              </div>
              <div>
                <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1">
                  Hex Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    name="hex"
                    value={newColor.hex}
                    onChange={handleColorChange}
                    className="w-8 h-8 rounded border border-outline-variant cursor-pointer"
                  />
                  <input
                    type="text"
                    name="hex"
                    value={newColor.hex}
                    onChange={handleColorChange}
                    className="flex-1 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-1 px-0 focus:ring-0 outline-none transition-colors text-sm"
                    placeholder="#FF69B4"
                  />
                </div>
                {errors.colorHex && <p className="text-error text-xs mt-1">{errors.colorHex}</p>}
              </div>
              <div>
                <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1">
                  Color Image
                </label>
                <input
                  type="text"
                  name="img"
                  value={newColor.img}
                  onChange={handleColorChange}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-1 px-0 focus:ring-0 outline-none transition-colors text-sm"
                  placeholder="Image URL"
                />
                {errors.colorImg && <p className="text-error text-xs mt-1">{errors.colorImg}</p>}
              </div>
              <div>
                <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1">
                  MRP (₹)
                </label>
                <input
                  type="number"
                  name="mrp"
                  value={newColor.mrp}
                  onChange={handleColorChange}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-1 px-0 focus:ring-0 outline-none transition-colors text-sm"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.colorMrp && <p className="text-error text-xs mt-1">{errors.colorMrp}</p>}
              </div>
              <div>
                <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={newColor.price}
                  onChange={handleColorChange}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-1 px-0 focus:ring-0 outline-none transition-colors text-sm"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.colorPrice && <p className="text-error text-xs mt-1">{errors.colorPrice}</p>}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block font-label-caps text-[10px] text-on-surface-variant mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={newColor.stock}
                    onChange={handleColorChange}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-1 px-0 focus:ring-0 outline-none transition-colors text-sm"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={addColor}
                  className="px-3 py-1 bg-primary text-white rounded-full text-sm hover:bg-on-background transition-colors mt-4"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Color List */}
            {formData.colors.length > 0 ? (
              <div className="space-y-2">
                {formData.colors.map((color, index) => {
                  const discount = calculateDiscount(color.mrp, color.price)
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 bg-surface-container rounded-lg">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-outline-variant flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-medium text-sm flex-1">{color.name}</span>
                      <span className="text-xs text-on-surface-variant">₹{color.mrp}</span>
                      <span className="text-xs font-semibold text-primary">₹{color.price}</span>
                      {discount > 0 && (
                        <span className="text-xs font-bold text-green-600">{discount}% OFF</span>
                      )}
                      <input
                        type="number"
                        value={color.stock}
                        onChange={(e) => updateColor(index, 'stock', parseInt(e.target.value) || 0)}
                        className="w-12 bg-surface-container-low border-b border-outline-variant focus:border-primary py-1 px-0 focus:ring-0 outline-none transition-colors text-sm text-center"
                        placeholder="Stock"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="text-error hover:opacity-70 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-on-surface-variant text-sm text-center py-4">
                No colors added yet. Add at least one color variant.
              </p>
            )}
            {errors.colors && <p className="text-error text-xs">{errors.colors}</p>}
          </div>
        )}

        {/* Stock (for non-color products) */}
        {!formData.hasColors && (
          <div>
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full bg-surface-container-low border-b-2 ${
                errors.stock ? 'border-error' : 'border-outline-variant focus:border-primary'
              } py-2 px-0 focus:ring-0 outline-none transition-colors`}
              placeholder="0"
              min="0"
            />
            {errors.stock && <p className="text-error text-xs mt-1">{errors.stock}</p>}
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
            Short Description *
          </label>
          <input
            type="text"
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            className={`w-full bg-surface-container-low border-b-2 ${
              errors.desc ? 'border-error' : 'border-outline-variant focus:border-primary'
            } py-2 px-0 focus:ring-0 outline-none transition-colors`}
            placeholder="Brief product description (max 200 chars)"
            maxLength="200"
          />
          {errors.desc && <p className="text-error text-xs mt-1">{errors.desc}</p>}
        </div>

        <div>
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
            Product Details *
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows="4"
            className={`w-full bg-surface-container-low border-b-2 ${
              errors.details ? 'border-error' : 'border-outline-variant focus:border-primary'
            } py-2 px-0 focus:ring-0 outline-none transition-colors resize-none`}
            placeholder="Detailed product description, ingredients, benefits..."
          />
          {errors.details && <p className="text-error text-xs mt-1">{errors.details}</p>}
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
          />
          <label className="text-on-surface-variant text-sm">Product is active (visible in shop)</label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t border-outline-variant">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-on-primary py-3 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Saving...
              </span>
            ) : (
              isEditing ? 'Update Product' : 'Create Product'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-outline-variant text-on-surface py-3 rounded-full font-label-caps text-label-caps hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductForm