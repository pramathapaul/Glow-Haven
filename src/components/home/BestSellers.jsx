import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/database'
import ProductCard from '../products/ProductCard'

const BestSellers = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        const data = await api.getProducts()
        let productArray = []
        if (Array.isArray(data)) {
          productArray = data.filter(p => p.tag === 'BEST SELLER')
        } else if (data && data.data) {
          productArray = data.data.filter(p => p.tag === 'BEST SELLER')
        }
        setProducts(productArray.slice(0, 4))
      } catch (error) {
        console.error('Error loading best sellers:', error)
        // Fallback: try to get featured products
        try {
          const featured = await api.getFeaturedProducts()
          const fallback = Array.isArray(featured) ? featured : featured.data || []
          setProducts(fallback.slice(0, 4))
        } catch (err) {
          setProducts([])
        }
      } finally {
        setLoading(false)
      }
    }
    loadBestSellers()
  }, [])

  if (loading) {
    return (
      <section className="px-5 md:px-20 py-16 max-w-[1280px] mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-[#e4e2de] rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-[#e4e2de] rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-[3/4] bg-[#e4e2de] rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-br from-[#f4c2c2]/5 via-[#fcf9f8] to-[#e1dfdc]/10">
      <div className="px-5 md:px-20 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="font-label-caps text-label-caps text-[#7b5455] tracking-[0.3em] flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#7b5455]"></span>
              BEST SELLERS
            </span>
            <h2 className="font-playfair text-[32px] text-[#1c1b1b] mt-2">
              Customer Favorites
            </h2>
            <p className="text-[#504444] mt-1">Most loved products by our community</p>
          </div>
          <Link to="/shop" className="font-label-caps text-label-caps text-[#7b5455] border-b border-[#7b5455] pb-1">
            View All →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>

        {/* Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#7b5455] to-[#7b5455]/80 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-playfair text-2xl">Limited Time Offer</h3>
              <p className="text-white/90 mt-2">Get 20% off on all best sellers. Use code: <span className="font-bold tracking-wider">GLOW20</span></p>
            </div>
            <Link 
              to="/shop" 
              className="bg-white text-[#7b5455] px-8 py-3 rounded-full font-label-caps text-label-caps hover:bg-[#1c1b1b] hover:text-white transition-all duration-300 shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BestSellers