import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative min-h-[700px] md:min-h-[800px] w-full overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&q=80"
          alt="Luminous beauty editorial"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1920x800/fcf9f8/7b5455?text=Glow+Haven'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fcf9f8] via-[#fcf9f8]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f8] via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-5 md:px-20 py-20 max-w-[1280px] mx-auto">
        <div className="max-w-2xl">
          <span className="font-label-caps text-label-caps text-[#7b5455] mb-4 block tracking-[0.3em] uppercase">
              Autumn Radiance Collection
          </span>

          <h1 className="font-playfair text-[40px] md:text-[64px] text-[#1c1b1b] mb-6 leading-[1.1]">
            The Art of <br />
            <span className="text-[#7b5455] relative">
              Luminous Beauty
            </span>
          </h1>

          <p className="text-[18px] text-[#504444] mb-8 max-w-lg leading-relaxed">
            Curated skincare rituals designed to reveal your natural, inner glow.
            Experience the fusion of clinical efficacy and editorial elegance.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="rounded-full flex-1 min-w-[180px] bg-[#7b5455] text-white py-4 px-6 font-label-caps text-label-caps uppercase tracking-widest hover:bg-[transparent] hover:border-[#7b5455] hover:border hover:text-[#7b5455] transition-all duration-300 text-center"
            >
              Explore Collection
            </Link>
            <Link
              to="/shop?category=Serums"
              className="rounded-full  flex-1 min-w-[180px] border border-[#7b5455] text-[#7b5455] py-4 px-6 font-label-caps text-label-caps uppercase tracking-widest hover:bg-[#7b5455] hover:text-white transition-all duration-300 text-center"
            >
              Best Sellers
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12">
            <div className="text-center">
              <p className="font-playfair text-2xl md:text-3xl text-[#7b5455] font-bold">50K+</p>
              <p className="text-xs text-[#504444] font-label-caps">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="font-playfair text-2xl md:text-3xl text-[#7b5455] font-bold">4.9</p>
              <p className="text-xs text-[#504444] font-label-caps">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="font-playfair text-2xl md:text-3xl text-[#7b5455] font-bold">100%</p>
              <p className="text-xs text-[#504444] font-label-caps">Cruelty Free</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero