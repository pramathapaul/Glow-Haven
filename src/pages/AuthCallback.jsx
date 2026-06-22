import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const AuthCallback = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const userData = params.get('user')

    if (token && userData) {
      // Save token and user data to localStorage
      localStorage.setItem('glowHavenToken', token)
      localStorage.setItem('glowHavenUser', userData)
      
      // Redirect to home or dashboard
      const user = JSON.parse(decodeURIComponent(userData))
      if (user.role === 'admin' || user.role === 'manager') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } else {
      // Handle error
      navigate('/login?error=google_auth_failed')
    }
  }, [navigate, location])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-4 text-on-surface-variant">Completing login...</p>
      </div>
    </div>
  )
}

export default AuthCallback