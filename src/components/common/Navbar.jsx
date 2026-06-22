import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 glass-header shadow-sm transition-all duration-300">
      <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        {/* Brand with Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="Glow Haven Logo" 
            className="h-10 w-auto object-contain"
            onError={(e) => {
              // Fallback if logo doesn't load
              e.target.style.display = 'none'
            }}
          />
          <span className="font-playfair text-headline-sm md:text-headline-md text-primary tracking-tight">
            Glow Haven
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/shop" className="text-on-surface-variant hover:text-primary transition-colors font-jakarta text-body-md">
            Shop
          </Link>
          <Link to="/shop?category=Serums" className="text-on-surface-variant hover:text-primary transition-colors font-jakarta text-body-md">
            Serums
          </Link>
          <Link to="/shop?category=Moisturizers" className="text-on-surface-variant hover:text-primary transition-colors font-jakarta text-body-md">
            Moisturizers
          </Link>
          <Link to="/tracking" className="text-on-surface-variant hover:text-primary transition-colors font-jakarta text-body-md">
            Track Order
          </Link>
          
          {user && (
            <Link to="/orders" className="text-on-surface-variant hover:text-primary transition-colors font-jakarta text-body-md">
              My Orders
            </Link>
          )}
          
          {user && (user.role === 'admin' || user.role === 'manager') && (
            <Link to="/admin" className="text-primary font-bold hover:text-primary transition-colors font-jakarta text-body-md border-b-2 border-primary pb-1">
              Dashboard
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rituals..."
              className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 w-48 focus:w-64 focus:ring-1 focus:ring-primary-container transition-all duration-300 text-body-md outline-none"
            />
          </form>

          {user ? (
            <Link to="/profile" className="hover:opacity-80 transition-opacity text-primary" title="Profile">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </Link>
          ) : (
            <Link to="/login" className="hover:opacity-80 transition-opacity text-primary" title="Login">
              <span className="material-symbols-outlined text-[24px]">login</span>
            </Link>
          )}

          <Link to="/cart" className="hover:opacity-80 transition-opacity text-primary relative">
            <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-primary"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest px-6 py-6 border-t border-outline-variant/30 shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="flex flex-col space-y-4">
            <form onSubmit={handleSearch} className="flex items-center border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-outline mr-2">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-none outline-none flex-1 text-body-md"
              />
            </form>
            
            <Link to="/shop" className="text-on-surface font-jakarta text-body-md" onClick={() => setIsMenuOpen(false)}>
              Shop All
            </Link>
            <Link to="/shop?category=Serums" className="text-on-surface-variant font-jakarta text-body-md" onClick={() => setIsMenuOpen(false)}>
              Serums
            </Link>
            <Link to="/shop?category=Moisturizers" className="text-on-surface-variant font-jakarta text-body-md" onClick={() => setIsMenuOpen(false)}>
              Moisturizers
            </Link>
            <Link to="/tracking" className="text-on-surface-variant font-jakarta text-body-md" onClick={() => setIsMenuOpen(false)}>
              Track Order
            </Link>
            
            {user && (
              <Link to="/orders" className="text-on-surface-variant font-jakarta text-body-md" onClick={() => setIsMenuOpen(false)}>
                My Orders
              </Link>
            )}
            
            {user && (user.role === 'admin' || user.role === 'manager') && (
              <Link to="/admin" className="text-primary font-jakarta text-body-md font-semibold" onClick={() => setIsMenuOpen(false)}>
                Admin Dashboard
              </Link>
            )}
            
            {user ? (
              <>
                <Link to="/profile" className="text-primary font-jakarta text-body-md font-semibold" onClick={() => setIsMenuOpen(false)}>
                  My Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-error font-jakarta text-body-md text-left hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-primary font-jakarta text-body-md font-semibold" onClick={() => setIsMenuOpen(false)}>
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar