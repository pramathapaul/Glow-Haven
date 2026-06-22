import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="w-full mt-stack-xl bg-secondary-container">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-stack-xl max-w-container-max mx-auto">
        {/* Brand with Logo */}
        <div className="flex flex-col space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Glow Haven Logo" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <span className="font-playfair text-headline-sm text-primary">Glow Haven</span>
          </Link>
          <p className="text-on-secondary-fixed-variant text-body-md max-w-xs">
            Curating a world of luminous beauty and holistic wellness. Empowering you to glow from within.
          </p>
          <div className="flex space-x-4">
            <span className="material-symbols-outlined text-on-secondary-fixed-variant">public</span>
            <span className="material-symbols-outlined text-on-secondary-fixed-variant">camera</span>
            <span className="material-symbols-outlined text-on-secondary-fixed-variant">brand_awareness</span>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-label-caps text-label-caps text-on-surface">EXPERIENCE</h4>
          <div className="flex flex-col space-y-2">
            <Link to="/shop" className="text-on-secondary-fixed-variant hover:text-primary transition-all text-body-md">Shop All</Link>
            <Link to="/shop?category=Serums" className="text-on-secondary-fixed-variant hover:text-primary transition-all text-body-md">Serums</Link>
            <Link to="/shop?category=Moisturizers" className="text-on-secondary-fixed-variant hover:text-primary transition-all text-body-md">Moisturizers</Link>
            <Link to="/tracking" className="text-on-secondary-fixed-variant hover:text-primary transition-all text-body-md">Track Order</Link>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-label-caps text-label-caps text-on-surface">CLIENT CARE</h4>
          <div className="flex flex-col space-y-2">
            <a href="#" className="text-on-secondary-fixed-variant hover:text-primary transition-all text-body-md">Shipping & Returns</a>
            <a href="#" className="text-on-secondary-fixed-variant hover:text-primary transition-all text-body-md">Contact Us</a>
            <a href="#" className="text-on-secondary-fixed-variant hover:text-primary transition-all text-body-md">Privacy Policy</a>
            <a href="#" className="text-on-secondary-fixed-variant hover:text-primary transition-all text-body-md">Terms of Service</a>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-label-caps text-label-caps text-on-surface">LOCATIONS</h4>
          <div className="flex flex-col space-y-2">
            <p className="text-on-secondary-fixed-variant text-body-md">Purbachal, East Udayrajpur</p>
            <p className="text-on-secondary-fixed-variant text-body-md">Madhyamgram, Kolkata</p>
            <p className="text-on-secondary-fixed-variant text-body-md">North 24 Parganas, West Bengal, 700129</p>
            <p className="text-on-secondary-fixed-variant text-body-md">+91 8910434478</p>
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/30 px-margin-mobile md:px-margin-desktop py-8 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-on-secondary-fixed-variant text-body-md">© 2024 Glow Haven. All rights reserved.</p>
        <div className="flex items-center space-x-6 text-[12px] font-label-caps text-outline">
          <span>SECURE PAYMENTS</span>
          <span className="material-symbols-outlined text-[18px]">lock</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer