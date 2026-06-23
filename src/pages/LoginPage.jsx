import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useGoogleLogin } from '@react-oauth/google'
import { API_URL } from '../api/config'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login, register, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/'

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin' || user.role === 'manager') {
        navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    }
  }, [user, navigate, from])

  // Google Login Handler
  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      // Redirect to backend Google OAuth
      window.location.href = `${API_URL}/auth/google`
    },
    onError: (error) => {
      console.error('Google login error:', error)
      setErrors({ general: 'Google login failed. Please try again.' })
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateLogin = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegister = () => {
    const newErrors = {}
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const isValid = isLogin ? validateLogin() : validateRegister()
    if (!isValid) return
    
    setIsLoading(true)
    setErrors({})
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password)
      } else {
        await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        })
      }
    } catch (error) {
      console.error('Auth error:', error)
      setErrors({ 
        general: error.message || 'Authentication failed. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="font-playfair text-headline-md text-primary">
            Glow Haven
          </Link>
          <p className="text-on-surface-variant text-sm mt-2">
            {isLogin ? 'Welcome back to your glow' : 'Start your luminous journey'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(244,194,194,0.15)] p-8">
          <h2 className="font-playfair text-headline-sm text-center mb-6">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          {errors.general && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Register fields */}
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full bg-surface-container-low border-b-2 ${
                        errors.firstName ? 'border-error' : 'border-outline-variant focus:border-primary'
                      } py-2 px-0 focus:ring-0 outline-none transition-colors`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-error text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full bg-surface-container-low border-b-2 ${
                        errors.lastName ? 'border-error' : 'border-outline-variant focus:border-primary'
                      } py-2 px-0 focus:ring-0 outline-none transition-colors`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-error text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-surface-container-low border-b-2 ${
                  errors.email ? 'border-error' : 'border-outline-variant focus:border-primary'
                } py-2 px-0 focus:ring-0 outline-none transition-colors`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                Password *
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
                  placeholder={isLogin ? 'Enter your password' : 'Create a password (min 8 chars)'}
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

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-surface-container-low border-b-2 ${
                    errors.confirmPassword ? 'border-error' : 'border-outline-variant focus:border-primary'
                  } py-2 px-0 focus:ring-0 outline-none transition-colors`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-error text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-on-background text-on-primary py-3 rounded-full font-label-caps text-label-caps hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-surface-container-lowest text-on-surface-variant">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={() => googleLogin()}
            className="w-full flex items-center justify-center gap-3 border border-outline-variant py-3 rounded-full hover:bg-surface-container transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            <span className="font-body-md">Continue with Google</span>
          </button>

          {/* Toggle Mode */}
          <button
            onClick={toggleMode}
            className="w-full text-primary font-label-caps text-label-caps hover:underline transition-all mt-4"
          >
            {isLogin ? 'Create an account' : 'Sign in instead'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage