import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../api/database'
import ProductCard from './ProductCard'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const [totalProducts, setTotalProducts] = useState(0)
  
  const category = searchParams.get('category') || 'All'
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || 'newest'

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = {}
      if (category !== 'All') params.category = category
      if (search) params.search = search
      if (sort) params.sort = sort
      
      const response = await api.getProducts(params)
      
      // Handle response
      let productArray = []
      if (response && response.success) {
        productArray = response.data || []
        setTotalProducts(response.pagination?.total || 0)
      } else if (Array.isArray(response)) {
        productArray = response
        setTotalProducts(response.length)
      } else {
        productArray = []
        setTotalProducts(0)
      }
      
      setProducts(productArray)
      
      if (productArray.length === 0 && search) {
        console.log(`No results found for "${search}"`)
      }
    } catch (error) {
      console.error('Error loading products:', error)
      setError('Failed to load products. Please try again.')
      setProducts([])
      setTotalProducts(0)
    } finally {
      setLoading(false)
    }
  }, [category, search, sort])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const categories = ['All', 'Serums', 'Moisturizers', 'Cleansers', 'Masks', 'Toners', 'Eye Care', 'Sun Care', 'Lipsticks', 'Nail Polish', 'Makeup']

  // Loading skeleton
  if (loading) {
    const skeletonItems = Array.from({ length: 8 }, (_, i) => i)
    return (
      <>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-6 bg-secondary-container rounded w-32 animate-pulse"></div>
          <div className="h-6 bg-secondary-container rounded w-24 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {skeletonItems.map((index) => (
            <div key={`skeleton-${index}`} className="animate-pulse">
              <div className="aspect-[3/4] bg-secondary-container rounded-2xl"></div>
              <div className="h-4 bg-secondary-container rounded mt-4 w-3/4"></div>
              <div className="h-4 bg-secondary-container rounded mt-2 w-1/2"></div>
            </div>
          ))}
        </div>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-6xl text-error mb-4 block">error</span>
        <p className="text-on-surface-variant text-body-lg">{error}</p>
        <button 
          onClick={loadProducts}
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
        <h3 className="font-playfair text-headline-sm mb-2">No products found</h3>
        {search ? (
          <>
            <p className="text-on-surface-variant text-body-md">
              We couldn't find any products matching "<strong>{search}</strong>"
            </p>
            <p className="text-on-surface-variant text-sm mt-2">
              Try adjusting your search or browse our categories
            </p>
            <button 
              onClick={() => {
                window.location.href = '/shop'
              }}
              className="mt-4 border border-primary text-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-primary-container/10 transition-colors"
            >
              Clear Search
            </button>
          </>
        ) : (
          <>
            <p className="text-on-surface-variant text-body-md">
              No products available in this category
            </p>
            <Link to="/shop" className="inline-block mt-4 bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors">
              View All Products
            </Link>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-on-surface-variant text-sm">
          {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
          {search && ` for "${search}"`}
        </p>
        {search && (
          <Link to="/shop" className="text-primary text-sm font-label-caps hover:underline">
            Clear Search
          </Link>
        )}
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
        {products.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </>
  )
}

export default ProductList
