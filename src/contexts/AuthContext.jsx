import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/database'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('glowHavenToken'))

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('glowHavenToken')
      if (storedToken) {
        try {
          const userData = await api.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error('Failed to load user:', error)
          localStorage.removeItem('glowHavenToken')
          localStorage.removeItem('glowHavenUser')
          setUser(null)
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const login = async (email, password) => {
    const response = await api.login(email, password)
    if (response.success && response.token) {
      setToken(response.token)
      setUser(response.data)
      return response
    }
    throw new Error(response.message || 'Login failed')
  }

  const register = async (userData) => {
    const response = await api.register(userData)
    if (response.success && response.token) {
      setToken(response.token)
      setUser(response.data)
      return response
    }
    throw new Error(response.message || 'Registration failed')
  }

  const logout = () => {
    api.logout()
    setUser(null)
    setToken(null)
  }

  const updateProfile = async (profileData) => {
    const response = await api.updateProfile(profileData)
    if (response.success) {
      setUser(response.data)
      return response
    }
    throw new Error(response.message || 'Failed to update profile')
  }

  const changePassword = async (currentPassword, newPassword) => {
    const response = await api.changePassword(currentPassword, newPassword)
    if (response.success) {
      return response
    }
    throw new Error(response.message || 'Failed to change password')
  }

  const isAdmin = user && (user.role === 'admin' || user.role === 'manager')

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      isAuthenticated: !!user,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}