import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      navigate('/admin', { replace: true })
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setLoginError('')
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setLoginError('')
    
    try {
      // Call admin login API
      const response = await fetch('http://localhost:5000/api/users/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()
      
      if (data.success && data.token) {
        // Store token and user data
        localStorage.setItem('glowHavenToken', data.token)
        localStorage.setItem('glowHavenUser', JSON.stringify(data.data))
        
        // Reload the page to refresh auth state
        window.location.href = '/admin'
      } else {
        setLoginError(data.message || 'Invalid credentials. Please try again.')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      setLoginError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="font-playfair text-headline-md text-primary">
            Glow Haven
          </Link>
          <p className="text-on-surface-variant text-sm mt-2">Admin Panel Login</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(244,194,194,0.15)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl text-primary">admin_panel_settings</span>
            <h2 className="font-playfair text-headline-sm">Admin Access</h2>
          </div>

          {loginError && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-surface-container-low border-b-2 ${
                  errors.email ? 'border-error' : 'border-outline-variant focus:border-primary'
                } py-2 px-0 focus:ring-0 outline-none transition-colors`}
                placeholder="admin@glowhaven.com"
              />
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-surface-container-low border-b-2 ${
                    errors.password ? 'border-error' : 'border-outline-variant focus:border-primary'
                  } py-2 px-0 focus:ring-0 outline-none transition-colors pr-10`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-on-primary py-4 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">login</span>
                  Login as Admin
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant">
            <Link to="/login" className="text-on-surface-variant text-sm hover:text-primary transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Customer Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage