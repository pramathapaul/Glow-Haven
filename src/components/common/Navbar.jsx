import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useAuth } from '../../contexts/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSearchSuggestions([])
        return
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'https://glow-haven-backend.onrender.com/api'}/products?search=${encodeURIComponent(searchQuery)}&limit=5`
        )
        const data = await response.json()
        const products = data.data || []
        setSearchSuggestions(products.slice(0, 5))
        setShowSuggestions(true)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowSuggestions(false)
      setIsMenuOpen(false)
    }
  }

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`)
    setSearchQuery('')
    setShowSuggestions(false)
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
          {/* Search - Desktop with Suggestions */}
          <div ref={searchRef} className="hidden lg:block relative">
            <form onSubmit={handleSearch} className="flex items-center relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                placeholder="Search products..."
                className="bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 w-48 focus:w-64 focus:ring-1 focus:ring-primary-container transition-all duration-300 text-body-md outline-none"
              />
            </form>
            
            {/* Search Suggestions */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 overflow-hidden z-50">
                {searchSuggestions.map((product) => (
                  <button
                    key={product._id || product.id}
                    onClick={() => handleSuggestionClick(product._id || product.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors text-left"
                  >
                    {product.img && (
                      <img 
                        src={product.img} 
                        alt={product.name} 
                        className="w-10 h-10 rounded-lg object-cover bg-secondary-container"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">{product.name}</p>
                      <p className="text-xs text-on-surface-variant">₹{product.price?.toFixed(2)}</p>
                    </div>
                    <span className="material-symbols-outlined text-sm text-outline">arrow_forward</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center border-b border-outline-variant pb-2">
              <span className="material-symbols-outlined text-outline mr-2">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent border-none outline-none flex-1 text-body-md"
              />
            </form>
            
            {/* Navigation Links */}
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
