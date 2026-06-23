import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { API_URL } from '../../api/config'
import AdminInvoiceUpload from './AdminInvoiceUpload'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({})
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [selectedStatus])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('glowHavenToken')
      const url = selectedStatus === 'all'
        ? `${API_URL}/orders/admin/all`
        : `${API_URL}/orders/admin/all?status=${selectedStatus}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (data.success) {
        setOrders(data.data)
        setCounts(data.counts || {})
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId)
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await response.json()

      if (data.success) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    setUpdatingOrderId(orderId)
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentStatus: newPaymentStatus })
      })
      const data = await response.json()

      if (data.success) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
      'Processing': 'bg-purple-100 text-purple-700 border-purple-200',
      'Shipped': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Out for Delivery': 'bg-orange-100 text-orange-700 border-orange-200',
      'Delivered': 'bg-green-100 text-green-700 border-green-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Paid': 'bg-green-100 text-green-700',
      'Failed': 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const statusOptions = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
  const paymentStatusOptions = ['Pending', 'Paid', 'Failed']

  const openInvoiceModal = (order) => {
    setSelectedOrder(order)
    setShowInvoiceModal(true)
  }

  const closeInvoiceModal = () => {
    setShowInvoiceModal(false)
    setSelectedOrder(null)
  }

  const handleInvoiceUploaded = () => {
    // Refresh orders to show updated status
    fetchOrders()
  }

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-container rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-secondary-container rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-secondary-container rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Glow Haven Logo"
            className="h-20 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <div>
            <h1 className="font-playfair text-headline-md">Admin Dashboard</h1>
            <p className="text-on-surface-variant">Manage orders, invoices, and store performance.</p>
          </div>
        </div>
        <Link to="/admin/products" className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors">
          Manage Products
        </Link>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="text-2xl font-bold text-yellow-700">{counts.pending || 0}</p>
          <p className="text-sm text-yellow-600">Pending Orders</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-2xl font-bold text-blue-700">{counts.confirmed || 0}</p>
          <p className="text-sm text-blue-600">Confirmed</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <p className="text-2xl font-bold text-green-700">{counts.delivered || 0}</p>
          <p className="text-sm text-green-600">Delivered</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <p className="text-2xl font-bold text-red-700">{counts.cancelled || 0}</p>
          <p className="text-sm text-red-600">Cancelled</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(244,194,194,0.15)] overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-4">
          <h4 className="font-playfair text-headline-sm">All Orders</h4>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${selectedStatus === 'all' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-primary-container'
                }`}
            >
              All ({Object.values(counts).reduce((a, b) => a + b, 0)})
            </button>
            {statusOptions.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${selectedStatus === status ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-primary-container'
                  }`}
              >
                {status} ({counts[status.toLowerCase()] || 0})
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-on-surface-variant">No orders found</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">ORDER ID</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">CUSTOMER</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">DATE</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">AMOUNT</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">STATUS</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">PAYMENT</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">INVOICE</th>
                  <th className="px-6 py-4 font-label-caps text-label-caps text-outline">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-5 font-body-md font-bold text-primary">#{order.orderId}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container/30 flex items-center justify-center text-primary font-bold text-xs">
                          {order.user?.firstName?.[0] || 'U'}
                        </div>
                        <span className="font-body-md text-on-surface">
                          {order.user?.firstName} {order.user?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-on-surface-variant text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-5 font-bold">₹{order.total?.toFixed(2)}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => openInvoiceModal(order)}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-primary-container text-primary hover:bg-primary hover:text-on-primary transition-colors"
                      >
                        Upload Invoice
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        {/* Order Status Dropdown */}
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updatingOrderId === order._id}
                          className="text-xs border rounded-lg px-2 py-1 bg-surface-container focus:ring-1 focus:ring-primary outline-none w-full"
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>

                        {/* Payment Status Dropdown */}
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                          disabled={updatingOrderId === order._id}
                          className="text-xs border rounded-lg px-2 py-1 bg-surface-container focus:ring-1 focus:ring-primary outline-none w-full"
                        >
                          {paymentStatusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Invoice Upload Modal */}
      {showInvoiceModal && selectedOrder && (
        <AdminInvoiceUpload
          orderId={selectedOrder._id}
          orderNumber={selectedOrder.orderId}
          onInvoiceUploaded={handleInvoiceUploaded}
          onClose={closeInvoiceModal}
        />
      )}
    </div>
  )
}

export default AdminDashboard