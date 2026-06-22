import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../api/database'
import ProductCard from './ProductCard'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || 'All'
  const search = searchParams.get('search') || ''

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        let productData = []
        
        if (search) {
          productData = await api.searchProducts(search)
        } else if (category !== 'All') {
          productData = await api.getProductsByCategory(category)
        } else {
          productData = await api.getProducts()
        }
        
        // console.log('📦 Products loaded:', productData)
        
        // Ensure we have an array and each product has an ID
        const productArray = Array.isArray(productData) ? productData : []
        
        // Normalize products: ensure each has an id field
        const normalizedProducts = productArray.map(product => ({
          ...product,
          id: product._id || product.id || `temp-${Math.random()}`
        }))
        
        // console.log('📦 Normalized products:', normalizedProducts)
        setProducts(normalizedProducts)
        
        if (normalizedProducts.length === 0) {
          console.warn('⚠️ No products found')
        }
      } catch (error) {
        console.error('❌ Error loading products:', error)
        setError(error.message || 'Failed to load products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [category, search])

  const categories = ['All', 'Serums', 'Moisturizers', 'Cleansers', 'Masks', 'Toners', 'Eye Care', 'Sun Care']

  // Loading skeleton
  if (loading) {
    const skeletonItems = Array.from({ length: 8 }, (_, i) => i)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
        {skeletonItems.map((index) => (
          <div key={`skeleton-${index}`} className="animate-pulse">
            <div className="aspect-[3/4] bg-secondary-container rounded-2xl"></div>
            <div className="h-4 bg-secondary-container rounded mt-4 w-3/4"></div>
            <div className="h-4 bg-secondary-container rounded mt-2 w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-6xl text-error mb-4 block">error</span>
        <p className="text-on-surface-variant text-body-lg">Failed to load products</p>
        <p className="text-on-surface-variant text-sm mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  // No products found
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-6xl text-outline mb-4 block">search</span>
        <p className="text-on-surface-variant text-body-lg">No products found.</p>
        <p className="text-on-surface-variant text-sm mt-2">Try adjusting your search or filter.</p>
        <button 
          onClick={() => window.location.href = '/shop'}
          className="mt-4 border border-primary text-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-primary-container/10 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    )
  }

  // Render products with unique keys
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
      {products.map((product) => {
        // Ensure we have a valid product with an id
        const productId = product._id || product.id
        if (!productId) {
          console.warn('Product missing id:', product)
          return null
        }
        return <ProductCard key={productId} product={product} />
      })}
    </div>
  )
}

export default ProductList