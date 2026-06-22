import React from 'react'
import { Link } from 'react-router-dom'

const FeaturedCollections = () => {
  return (
    <section className="px-5 md:px-20 py-16 max-w-[1280px] mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="font-label-caps text-label-caps text-[#7b5455] tracking-[0.3em] uppercase">The Essentials</span>
          <h3 className="font-playfair text-[32px] mt-1">Featured Lines</h3>
        </div>
        <Link to="/shop" className="font-label-caps text-label-caps text-[#7b5455] border-b border-[#7b5455] pb-1">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Large Featured Card */}
        <div className="md:col-span-8 group relative aspect-[4/5] md:aspect-auto md:h-[600px] bg-[#e4e2de] overflow-hidden rounded-2xl">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80"
            alt="Serum Secrets collection"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x1000/e4e2de/7b5455?text=Serum+Secrets'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h4 className="font-playfair text-2xl mb-2">Serum Secrets</h4>
            <p className="text-base opacity-90">Clinical results, ritual experience.</p>
            <Link to="/shop?category=Serums" className="inline-block mt-4 border border-white/50 text-white px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-white hover:text-black transition-all">
              Explore
            </Link>
          </div>
        </div>

        {/* Small Grid */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="group relative h-[288px] bg-[#eae7e7] rounded-2xl overflow-hidden">
            <img 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80"
              alt="Moisturizers"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400/eae7e7/7b5455?text=Moisturizers'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-6">
              <div>
                <h5 className="text-white font-playfair text-2xl">Moisturizers</h5>
                <Link to="/shop?category=Moisturizers" className="text-white/80 text-sm hover:text-white transition-colors">Shop Now →</Link>
              </div>
            </div>
          </div>
          <div className="group relative h-[288px] bg-[#eae7e7] rounded-2xl overflow-hidden">
            <img 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80"
              alt="Face Oils"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400/eae7e7/7b5455?text=Face+Oils'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-6">
              <div>
                <h5 className="text-white font-playfair text-2xl">Face Oils</h5>
                <Link to="/shop?category=Face+Oils" className="text-white/80 text-sm hover:text-white transition-colors">Shop Now →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollections