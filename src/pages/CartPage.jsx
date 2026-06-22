import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (user) {
      navigate('/checkout')
    } else {
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
    }
  }

  // Get unique key for each item
  const getItemKey = (item) => {
    return item.color ? `${item.id}-${item.color.hex}` : `${item.id}`
  }

  // Get display name for cart item
  const getDisplayName = (item) => {
    if (item.color) {
      return `${item.name} (${item.color.name})`
    }
    return item.name
  }

  if (items.length === 0) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl text-center">
        <span className="material-symbols-outlined text-6xl text-outline">shopping_bag</span>
        <h2 className="font-playfair text-headline-md mt-4">Your bag is empty</h2>
        <p className="text-on-surface-variant mt-2">Discover our collection and find your glow.</p>
        <Link to="/shop" className="inline-block mt-6 bg-primary text-on-primary px-8 py-3 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors">
          Start Shopping
        </Link>
      </div>
    )
  }

  const subtotal = totalPrice
  const shipping = subtotal > 1000 ? 0 : 50
  const tax = 0
  const total = subtotal + shipping + tax

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
      <h1 className="font-playfair text-headline-md mb-stack-lg">Your Bag ({totalItems} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const uniqueKey = getItemKey(item)
            return (
              <div key={uniqueKey} className="flex gap-4 bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary-container">
                  <img className="w-full h-full object-cover" src={item.img} alt={item.name} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-playfair text-headline-sm text-sm">{getDisplayName(item)}</h3>
                      {item.color && (
                        <div className="flex items-center gap-2 mt-1">
                          <div 
                            className="w-4 h-4 rounded-full border border-outline-variant"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          <span className="text-xs text-on-surface-variant">{item.color.name}</span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => removeItem(uniqueKey)} 
                      className="text-outline hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  <p className="text-primary font-semibold mt-1">₹{item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => updateQuantity(uniqueKey, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:border-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="font-body-md">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(uniqueKey, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center hover:border-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm sticky top-32">
            <h3 className="font-playfair text-headline-sm">Order Summary</h3>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal ({totalItems} items)</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tax</span>
                <span className="font-semibold">₹0.00</span>
              </div>
              <div className="border-t border-outline-variant pt-4 mt-4">
                <div className="flex justify-between font-playfair text-headline-sm">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full mt-6 bg-on-background text-on-primary py-4 rounded-full font-label-caps text-label-caps hover:bg-primary transition-colors"
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>

            <button 
              onClick={clearCart}
              className="w-full mt-3 text-outline text-sm font-label-caps hover:text-error transition-colors"
            >
              Clear Bag
            </button>
            <Link to="/shop" className="block text-center mt-4 text-primary font-label-caps text-label-caps hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage