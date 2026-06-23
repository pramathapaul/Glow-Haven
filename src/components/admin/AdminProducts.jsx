import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../../api/config'
import AdminProductForm from './AdminProductForm'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data)
      } else {
        setError(data.message || 'Failed to load products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setProducts(products.filter(p => p._id !== productId && p.id !== productId))
      } else {
        alert(data.message || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const handleSaveProduct = async (productData) => {
    try {
      const token = localStorage.getItem('glowHavenToken')
      const url = editingProduct 
        ? `${API_URL}/products/${editingProduct._id || editingProduct.id}`
        : `${API_URL}/products`
      
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchProducts()
        setShowForm(false)
        setEditingProduct(null)
      } else {
        alert(data.message || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    }
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
  }

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-container rounded w-1/4"></div>
          <div className="h-20 bg-secondary-container rounded"></div>
          <div className="h-20 bg-secondary-container rounded"></div>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
        <AdminProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
          isEditing={!!editingProduct}
        />
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-playfair text-headline-md">Manage Products</h1>
          <p className="text-on-surface-variant">Add, edit, or remove products from your store</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add New Product
        </button>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(244,194,194,0.15)] overflow-hidden">
        <div className="overflow-x-auto">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-outline mb-4 block">inventory_2</span>
              <p className="text-on-surface-variant">No products found</p>
              <button
                onClick={handleAddProduct}
                className="mt-4 bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">PRODUCT</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">CATEGORY</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">MRP</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">PRICE</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">DISCOUNT</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">COLORS</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">STOCK</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">STATUS</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {products.map((product) => {
                  const discount = product.mrp && product.price && product.mrp > 0
                    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                    : 0
                  const totalStock = product.hasColors && product.colors
                    ? product.colors.reduce((sum, c) => sum + (c.stock || 0), 0)
                    : product.stock || 0
                    
                  return (
                    <tr key={product._id || product.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary-container flex-shrink-0">
                            <img className="w-full h-full object-cover" src={product.img} alt={product.name} />
                          </div>
                          <div>
                            <span className="font-body-md text-on-surface font-medium">{product.name}</span>
                            {product.hasColors && product.colors && (
                              <div className="flex items-center gap-1 mt-1">
                                {product.colors.slice(0, 5).map((color, idx) => (
                                  <div 
                                    key={idx}
                                    className="w-4 h-4 rounded-full border border-outline-variant"
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                  />
                                ))}
                                {product.colors.length > 5 && (
                                  <span className="text-xs text-outline">+{product.colors.length - 5}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">{product.category}</td>
                      <td className="px-6 py-4 text-on-surface-variant line-through">₹{product.mrp?.toFixed(2)}</td>
                      <td className="px-6 py-4 font-semibold text-primary">₹{product.price?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {discount > 0 ? (
                          <span className="text-green-600 font-bold">{discount}% OFF</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {product.hasColors ? (
                          <span className="text-xs font-semibold text-primary">{product.colors?.length || 0} variants</span>
                        ) : (
                          <span className="text-xs text-on-surface-variant">Single</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${totalStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {totalStock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(product.isActive)}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 hover:bg-surface-container rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <span className="material-symbols-outlined text-sm text-on-surface-variant">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id || product.id)}
                            className="p-2 hover:bg-error-container rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <span className="material-symbols-outlined text-sm text-error">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminProducts