// src/api/database.js
const API_URL ='https://glow-haven-backend.onrender.com/api'

// Helper to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }
  const data = await response.json()
  return data
}

// Normalize product to always have an id field
const normalizeProduct = (product) => {
  if (!product) return null
  return {
    ...product,
    id: product._id || product.id || `temp-${Math.random()}`
  }
}

const normalizeProducts = (products) => {
  if (!Array.isArray(products)) return []
  return products.map(p => normalizeProduct(p)).filter(p => p !== null)
}

export const api = {
  // ==================== PRODUCTS ====================
  
  // Get all products with filters
  getProducts: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString()
      const url = `${API_URL}/products${query ? `?${query}` : ''}`
      // console.log('🔄 Fetching products from:', url)
      
      const response = await fetch(url)
      const data = await handleResponse(response)
      // console.log('✅ Products response:', data)
      
      // The API returns { success: true, data: [...], pagination: {...} }
      if (data.success && Array.isArray(data.data)) {
        return normalizeProducts(data.data)
      }
      return normalizeProducts(data.data || data)
    } catch (error) {
      // console.error('❌ Error fetching products:', error)
      throw error
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      // console.log('🔍 Fetching product with ID:', id)
      const response = await fetch(`${API_URL}/products/${id}`)
      const data = await handleResponse(response)
      const product = data.data || data
      return normalizeProduct(product)
    } catch (error) {
      console.error('❌ Error fetching product:', error)
      throw error
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await fetch(`${API_URL}/products/category/${category}`)
      const data = await handleResponse(response)
      return normalizeProducts(data.data || data)
    } catch (error) {
      console.error('❌ Error fetching products by category:', error)
      throw error
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const response = await fetch(`${API_URL}/products?search=${encodeURIComponent(query)}`)
      const data = await handleResponse(response)
      return normalizeProducts(data.data || data)
    } catch (error) {
      console.error('❌ Error searching products:', error)
      throw error
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await fetch(`${API_URL}/products/featured`)
      const data = await handleResponse(response)
      return normalizeProducts(data.data || data)
    } catch (error) {
      console.error('❌ Error fetching featured products:', error)
      throw error
    }
  },

  // Admin: Create product
  createProduct: async (productData) => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(productData),
      })
      const data = await handleResponse(response)
      return normalizeProduct(data.data || data)
    } catch (error) {
      console.error('❌ Error creating product:', error)
      throw error
    }
  },

  // Admin: Update product
  updateProduct: async (id, productData) => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(productData),
      })
      const data = await handleResponse(response)
      return normalizeProduct(data.data || data)
    } catch (error) {
      console.error('❌ Error updating product:', error)
      throw error
    }
  },

  // Admin: Delete product
  deleteProduct: async (id) => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('❌ Error deleting product:', error)
      throw error
    }
  },

  // ==================== ORDERS ====================

  // Create order
  createOrder: async (orderData) => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(orderData),
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('❌ Error creating order:', error)
      throw error
    }
  },

  // Get user orders
  getUserOrders: async () => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/orders/my-orders`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      })
      const data = await handleResponse(response)
      return data.data || data
    } catch (error) {
      console.error('❌ Error fetching user orders:', error)
      throw error
    }
  },

  // Get single order
  getOrder: async (orderId) => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      })
      const data = await handleResponse(response)
      return data.data || data
    } catch (error) {
      console.error('❌ Error fetching order:', error)
      throw error
    }
  },

  // ==================== TRACKING ====================

  // Track order
  trackOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/tracking/${orderId}`)
      const data = await handleResponse(response)
      return data.data || data
    } catch (error) {
      console.error('❌ Error tracking order:', error)
      throw error
    }
  },

  // ==================== AUTHENTICATION ====================

  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await handleResponse(response)
      if (data.token) {
        localStorage.setItem('glowHavenToken', data.token)
        localStorage.setItem('glowHavenUser', JSON.stringify(data.data))
      }
      return data
    } catch (error) {
      console.error('❌ Error logging in:', error)
      throw error
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      const data = await handleResponse(response)
      if (data.token) {
        localStorage.setItem('glowHavenToken', data.token)
        localStorage.setItem('glowHavenUser', JSON.stringify(data.data))
      }
      return data
    } catch (error) {
      console.error('❌ Error registering user:', error)
      throw error
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      if (!token) throw new Error('No token found')
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await handleResponse(response)
      return data.data || data
    } catch (error) {
      console.error('❌ Error fetching current user:', error)
      throw error
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })
      const data = await handleResponse(response)
      return data.data || data
    } catch (error) {
      console.error('❌ Error updating profile:', error)
      throw error
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('❌ Error changing password:', error)
      throw error
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('glowHavenToken')
    localStorage.removeItem('glowHavenUser')
  },

  // ==================== ADMIN ====================

  // Admin: Get all orders
  getAllOrders: async (params = {}) => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const query = new URLSearchParams(params).toString()
      const response = await fetch(`${API_URL}/orders${query ? `?${query}` : ''}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      })
      const data = await handleResponse(response)
      return data.data || data
    } catch (error) {
      console.error('❌ Error fetching all orders:', error)
      throw error
    }
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ status }),
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('❌ Error updating order status:', error)
      throw error
    }
  },

  // Admin: Get all users
  getAllUsers: async () => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      })
      const data = await handleResponse(response)
      return data.data || data
    } catch (error) {
      console.error('❌ Error fetching all users:', error)
      throw error
    }
  },
}

export default api
