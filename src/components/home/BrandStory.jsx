import React from 'react'

const BrandStory = () => {
  return (
    <section className="bg-[#e1dfdc] py-16 overflow-hidden">
      <div className="px-5 md:px-20 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left - Image */}
        <div className="relative">
          <div className="aspect-[4/5] w-4/5 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"
              alt="Brand story"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x800/e1dfdc/7b5455?text=Glow+Haven'
              }}
            />
          </div>
          <div className="absolute -bottom-8 -right-8 w-3/5 aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-[#e1dfdc]">
            <img 
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80"
              alt="Ingredients"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400/e1dfdc/7b5455?text=Natural+Ingredients'
              }}
            />
          </div>
        </div>

        {/* Right - Content */}
        <div className="flex flex-col gap-4 pt-12 md:pt-0">
          <span className="font-label-caps text-label-caps text-[#7b5455] tracking-[0.3em]">OUR PHILOSOPHY</span>
          <h2 className="font-playfair text-[32px] text-[#1c1b1b]">
            The Science of <br />Subtle Sophistication.
          </h2>
          <p className="text-base text-[#474744] leading-relaxed">
            We believe that beauty isn't about masking, but revealing. Glow Haven was born from a desire to create a skincare-first makeup line that treats your skin while providing that "lit-from-within" finish that defines modern luxury.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7b5455]/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#7b5455]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
              </div>
              <span className="font-label-caps text-label-caps">Vegan Formula</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7b5455]/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#7b5455]" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
              </div>
              <span className="font-label-caps text-label-caps">Clinically Tested</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7b5455]/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#7b5455]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </div>
              <span className="font-label-caps text-label-caps">Cruelty Free</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#7b5455]/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#7b5455]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              </div>
              <span className="font-label-caps text-label-caps">Sustainable Packaging</span>
            </div>
          </div>
          <button className="rounded-full mt-4 border-2 border-[#7b5455] text-[#7b5455] px-8 py-4 font-label-caps text-label-caps hover:bg-[#7b5455] hover:text-white transition-all duration-300 w-fit">
            OUR COMMITMENT 
          </button>
        </div>
      </div>
    </section>
  )
}

export default BrandStory