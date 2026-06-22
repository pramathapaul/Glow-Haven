import React, { useState } from 'react'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    
    setLoading(true)
    setTimeout(() => {
      setSubscribed(true)
      setLoading(false)
      setEmail('')
    }, 1000)
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f4c2c2]/10 via-[#fcf9f8] to-[#e1dfdc]/10"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#f4c2c2]/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#ffbdc5]/20 rounded-full blur-3xl"></div>

      <div className="px-5 md:px-20 max-w-[1280px] mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#7b5455]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
            <span className="material-symbols-outlined text-3xl text-[#7b5455]">mail</span>
          </div>

          <h2 className="font-playfair text-[32px] text-[#1c1b1b]">
            Join the Inner Circle
          </h2>
          <p className="text-[#504444] mt-3 max-w-md mx-auto">
            Receive early access to limited edition drops, exclusive discounts, 
            and a weekly dose of luminous inspiration.
          </p>

          {subscribed ? (
            <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-200">
              <span className="material-symbols-outlined text-4xl text-green-600 block mb-2">check_circle</span>
              <p className="text-green-700 font-semibold text-lg">You're subscribed! 🎉</p>
              <p className="text-green-600 text-sm">Check your inbox for a welcome surprise!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-[#f6f3f2] border-2 border-[#d4c2c2] rounded-full px-6 py-4 focus:border-[#7b5455] focus:ring-2 focus:ring-[#f4c2c2] outline-none transition-all text-base"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#7b5455] text-white px-8 py-4 rounded-full font-label-caps text-label-caps hover:bg-[#1c1b1b] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                ) : (
                  <>
                    Subscribe
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-xs text-[#504444] mt-4 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">lock</span>
            No spam, unsubscribe anytime
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-[#504444]/60">
            <span className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-[#7b5455] text-base">verified</span>
              10K+ Subscribers
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-[#7b5455] text-base">shield</span>
              Secure & Private
            </span>
            <span className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-[#7b5455] text-base">eco</span>
              Eco-Friendly
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter