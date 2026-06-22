import React from 'react'
import { Link } from 'react-router-dom'

const OrderPlacedPage = () => {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-5xl text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        
        <h1 className="font-playfair text-headline-md text-on-surface">Order Sent Successfully! 🎉</h1>
        <p className="text-on-surface-variant mt-4 text-lg">
          Thank you for your order! We've received your request via WhatsApp.
        </p>
        <p className="text-on-surface-variant mt-2">
          Our team will review your order and contact you shortly to confirm the details.
        </p>
        
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mt-8 text-left">
          <h3 className="font-playfair text-headline-sm mb-4">What happens next?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">whatsapp</span>
              <div>
                <p className="font-semibold">1. WhatsApp Message Sent</p>
                <p className="text-sm text-on-surface-variant">Your order details have been sent to our team via WhatsApp.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">verified</span>
              <div>
                <p className="font-semibold">2. Order Confirmation</p>
                <p className="text-sm text-on-surface-variant">We'll confirm your order and check product availability.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <div>
                <p className="font-semibold">3. Shipping & Delivery</p>
                <p className="text-sm text-on-surface-variant">Once confirmed, we'll ship your order and provide tracking details.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/shop" className="bg-primary text-on-primary px-8 py-3 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors">
            Continue Shopping
          </Link>
          <Link to="/" className="border border-primary text-primary px-8 py-3 rounded-full font-label-caps text-label-caps hover:bg-primary-container/10 transition-colors">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderPlacedPage