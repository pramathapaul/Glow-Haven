import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/database'
import ProductCard from '../products/ProductCard'

const TrendingProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getFeaturedProducts()
        const productArray = Array.isArray(data) ? data : data.data || []
        setProducts(productArray.slice(0, 4))
      } catch (error) {
        console.error('Error loading featured products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) {
    return (
      <section className="px-5 md:px-20 py-16 max-w-[1280px] mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-[#e4e2de] rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-[3/4] bg-[#e4e2de] rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="px-5 md:px-20 py-16 max-w-[1280px] mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div className="flex flex-col gap-2">
          <span className="font-label-caps text-label-caps text-[#7b5455] tracking-[0.3em] flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#7b5455]"></span>
            CURATED FOR YOU
          </span>
          <h2 className="font-playfair text-[32px] text-[#1c1b1b]">Trending Now</h2>
          <p className="text-[#504444] text-sm">Most popular picks this week</p>
        </div>
        <Link to="/shop" className="font-label-caps text-label-caps text-[#7b5455] border-b border-[#7b5455] pb-1">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default TrendingProducts