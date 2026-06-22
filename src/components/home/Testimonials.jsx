import React, { useState, useEffect, useRef } from 'react'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sectionRef = useRef(null)

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai, India',
      text: 'Glow Haven transformed my skincare routine. My skin has never looked this radiant! The Luminous Silk Serum is a game-changer.',
      rating: 5,
      image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=7b5455&color=fff&size=80'
    },
    {
      id: 2,
      name: 'Aditya Patel',
      location: 'Delhi, India',
      text: 'The Velvet Hydration Balm is absolutely incredible. It keeps my skin moisturized all day without feeling heavy. Highly recommend!',
      rating: 5,
      image: 'https://ui-avatars.com/api/?name=Aditya+Patel&background=7b5455&color=fff&size=80'
    },
    {
      id: 3,
      name: 'Sneha Reddy',
      location: 'Bangalore, India',
      text: 'Finally found a brand that actually works! The Celestial Gold Oil has given me the glow I\'ve always wanted. Love the natural ingredients.',
      rating: 5,
      image: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=7b5455&color=fff&size=80'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <section ref={sectionRef} className="py-16 bg-[#f0eded]">
      <div className="px-5 md:px-20 max-w-[1280px] mx-auto">
        <div className="text-center mb-12">
          <span className="font-label-caps text-label-caps text-[#7b5455] tracking-[0.3em]">TESTIMONIALS</span>
          <h2 className="font-playfair text-[32px] text-[#1c1b1b] mt-2">
            What Our Customers Say
          </h2>
          <p className="text-[#504444] mt-1">Real stories from real people who found their glow</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                    <div className="flex justify-center gap-1 text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      ))}
                    </div>
                    <span className="material-symbols-outlined text-4xl text-[#7b5455]/30 mb-4">format_quote</span>
                    <p className="text-lg text-[#504444] leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#7b5455]/30"
                      />
                      <div className="text-left">
                        <p className="font-semibold text-[#1c1b1b]">{testimonial.name}</p>
                        <p className="text-sm text-[#504444]">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:translate-x-0 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 text-[#7b5455] border border-[#7b5455]/20"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-0 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 text-[#7b5455] border border-[#7b5455]/20"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-[#7b5455] w-8' 
                    : 'bg-[#d4c2c2] hover:bg-[#827473]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials