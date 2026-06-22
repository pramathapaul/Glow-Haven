import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const OrderDetailsPage = () => {
  const { orderId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [invoice, setInvoice] = useState(null)
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [invoiceError, setInvoiceError] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('glowHavenToken')}`
          }
        })
        const data = await response.json()
        
        if (data.success) {
          setOrder(data.data)
          // Check for invoice after order is loaded
          checkInvoice(data.data._id)
        } else {
          setError(data.message || 'Order not found')
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, user, navigate])

  const checkInvoice = async (orderId) => {
    setInvoiceLoading(true)
    setInvoiceError(null)
    
    try {
      const token = localStorage.getItem('glowHavenToken')
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/invoice`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setInvoice(data.data)
      } else if (data.message === 'Invoice not found for this order') {
        setInvoice(null)
      } else {
        setInvoiceError(data.message)
      }
    } catch (error) {
      console.error('Error checking invoice:', error)
      setInvoiceError('Failed to check invoice')
    } finally {
      setInvoiceLoading(false)
    }
  }

  const downloadInvoice = () => {
    if (!invoice || !invoice.invoiceFile) return
    
    // Create a download link
    const link = document.createElement('a')
    link.href = invoice.invoiceFile
    link.download = invoice.fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': 'hourglass_empty',
      'Confirmed': 'check_circle',
      'Processing': 'settings',
      'Shipped': 'local_shipping',
      'Out for Delivery': 'delivery_dining',
      'Delivered': 'home',
      'Cancelled': 'cancel'
    }
    return icons[status] || 'circle'
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Paid': 'bg-green-100 text-green-700',
      'Failed': 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-container rounded w-1/4"></div>
          <div className="h-64 bg-secondary-container rounded"></div>
          <div className="h-32 bg-secondary-container rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl text-center">
        <span className="material-symbols-outlined text-6xl text-outline mb-4 block">error</span>
        <h2 className="font-playfair text-headline-md">Order Not Found</h2>
        <p className="text-on-surface-variant mt-2">{error || 'The order you\'re looking for doesn\'t exist.'}</p>
        <Link to="/orders" className="inline-block mt-6 bg-primary text-on-primary px-8 py-3 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors">
          View All Orders
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/orders" className="text-primary font-label-caps text-label-caps hover:underline inline-flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Orders
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-playfair text-headline-md">Order #{order.orderId}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(order.orderStatus)}`}>
              <span className="material-symbols-outlined text-sm align-middle mr-1">
                {getStatusIcon(order.orderStatus)}
              </span>
              {order.orderStatus}
            </span>
          </div>
          <p className="text-on-surface-variant">Placed on {formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm mb-8">
        <h2 className="font-playfair text-headline-sm mb-6">Order Timeline</h2>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-outline-variant"></div>
          <div className="space-y-8">
            {order.timeline && order.timeline.length > 0 ? (
              order.timeline.map((event, index) => (
                <div key={index} className="flex gap-6 relative">
                  <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${index === order.timeline.length - 1 ? 'bg-primary text-white' : 'bg-primary-container/50 text-primary'}`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {index === order.timeline.length - 1 ? 'check' : getStatusIcon(event.status)}
                    </span>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${index === order.timeline.length - 1 ? 'text-primary' : 'text-on-surface'}`}>
                      {event.status}
                    </h3>
                    <p className="text-on-surface-variant text-sm">{event.description}</p>
                    <p className="text-outline text-xs mt-1">{formatDate(event.date)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-on-surface-variant text-sm">No timeline events yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Items */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
          <h2 className="font-playfair text-headline-sm mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-outline-variant/30 last:border-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary-container flex-shrink-0">
                    <img 
                      className="w-full h-full object-cover" 
                      src={item.img || item.product?.img || 'https://via.placeholder.com/80'} 
                      alt={item.name} 
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-on-surface">{item.name}</h3>
                    <p className="text-on-surface-variant text-sm">Qty: {item.quantity}</p>
                    <p className="text-primary font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-on-surface-variant text-sm">₹{item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-on-surface-variant">No items found</p>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h2 className="font-playfair text-headline-sm mb-6">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Subtotal</span>
                <span className="font-semibold">₹{order.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span className="font-semibold">
                  {order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost?.toFixed(2) || '0.00'}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tax</span>
                <span className="font-semibold">₹0.00</span>
              </div>
              <div className="border-t border-outline-variant pt-3 mt-3">
                <div className="flex justify-between font-playfair text-headline-sm">
                  <span>Total</span>
                  <span className="text-primary">₹{order.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 className="font-playfair text-headline-sm mb-4">Shipping Details</h3>
            {order.shippingAddress ? (
              <div className="space-y-2 text-on-surface-variant">
                <p><span className="font-semibold text-on-surface">Name:</span> {order.shippingAddress.fullName}</p>
                <p><span className="font-semibold text-on-surface">Address:</span> {order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p><span className="font-semibold text-on-surface">Phone:</span> {order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-on-surface-variant">No shipping address provided</p>
            )}
          </div>

          {/* Payment Details */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 className="font-playfair text-headline-sm mb-4">Payment Details</h3>
            <div className="space-y-2 text-on-surface-variant">
              <p><span className="font-semibold text-on-surface">Method:</span> {order.paymentMethod || 'N/A'}</p>
              <p>
                <span className="font-semibold text-on-surface">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus || 'Pending'}
                </span>
              </p>
            </div>
          </div>

          {/* Invoice Section */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h3 className="font-playfair text-headline-sm mb-4">Invoice</h3>
            {invoiceLoading ? (
              <div className="animate-pulse">
                <div className="h-16 bg-secondary-container rounded"></div>
              </div>
            ) : invoice ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-600 text-2xl">description</span>
                    <div>
                      <p className="font-semibold text-green-700">Invoice Available</p>
                      <p className="text-xs text-green-600">
                        #{invoice.invoiceNumber} • {formatDate(invoice.uploadedAt)}
                      </p>
                      <p className="text-xs text-green-600">
                        File: {invoice.fileName} ({(invoice.fileSize / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={downloadInvoice}
                    className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    Download
                  </button>
                </div>
                {invoice.notes && (
                  <p className="text-sm text-on-surface-variant bg-surface-container p-2 rounded">
                    <span className="font-semibold">Notes:</span> {invoice.notes}
                  </p>
                )}
                {invoice.uploadedBy && (
                  <p className="text-xs text-on-surface-variant">
                    Uploaded by: {invoice.uploadedBy.firstName} {invoice.uploadedBy.lastName}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                <span className="material-symbols-outlined text-yellow-600 text-4xl block mb-2">receipt_long</span>
                <p className="text-yellow-700 font-semibold">Invoice Not Created Yet</p>
                <p className="text-sm text-yellow-600 mt-1">The invoice will be available once the admin uploads it.</p>
                <p className="text-xs text-yellow-500 mt-2">Please check back later.</p>
              </div>
            )}
            {invoiceError && (
              <p className="text-error text-sm mt-2">{invoiceError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsPage