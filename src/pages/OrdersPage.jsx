import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const OrdersPage = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        const response = await fetch('http://localhost:5000/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('glowHavenToken')}`
          }
        })
        const data = await response.json()
        
        if (data.success) {
          setOrders(data.data)
        } else {
          setError(data.message || 'Failed to load orders')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        setError('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

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
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-secondary-container rounded w-1/4"></div>
          <div className="h-20 bg-secondary-container rounded"></div>
          <div className="h-20 bg-secondary-container rounded"></div>
          <div className="h-20 bg-secondary-container rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-playfair text-headline-md">My Orders</h1>
          <p className="text-on-surface-variant">Track and manage all your orders</p>
        </div>
        <Link to="/shop" className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors">
          Continue Shopping
        </Link>
      </div>

      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">receipt_long</span>
          <h2 className="font-playfair text-headline-sm">No Orders Yet</h2>
          <p className="text-on-surface-variant mt-2">Start shopping to see your orders here.</p>
          <Link to="/shop" className="inline-block mt-6 bg-primary text-on-primary px-8 py-3 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link 
              key={order._id} 
              to={`/order/${order.orderId}`}
              className="block bg-surface-container-lowest p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-primary/20"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-playfair text-headline-sm text-sm font-bold text-primary">
                      #{order.orderId}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                      <span className="material-symbols-outlined text-xs align-middle mr-1">
                        {getStatusIcon(order.orderStatus)}
                      </span>
                      {order.orderStatus}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm mt-2">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''} • {formatDate(order.createdAt)}
                  </p>
                  {order.items && order.items.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="w-8 h-8 rounded-full overflow-hidden bg-secondary-container border border-white">
                          <img className="w-full h-full object-cover" src={item.img || item.product?.img} alt={item.name} />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-outline">+{order.items.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <p className="font-playfair text-headline-sm text-primary">
                    ₹{order.total?.toFixed(2)}
                  </p>
                  <p className="text-outline text-xs">
                    {order.paymentMethod}
                  </p>
                  <span className="text-primary text-xs font-label-caps mt-1 hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage