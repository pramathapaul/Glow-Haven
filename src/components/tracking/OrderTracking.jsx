import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('')
  const [trackingData, setTrackingData] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const [error, setError] = useState(null)

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!orderId.trim()) {
      setError('Please enter a tracking number')
      return
    }

    setIsTracking(true)
    setError(null)
    setTrackingData(null)

    try {
      const response = await fetch(`http://localhost:5000/api/tracking/${orderId.trim()}`)
      const data = await response.json()
      
      if (data.success) {
        setTrackingData(data.data)
      } else {
        setError(data.message || 'Order not found')
      }
    } catch (error) {
      console.error('Error tracking order:', error)
      setError('Failed to track order. Please try again.')
    } finally {
      setIsTracking(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Confirmed': 'bg-blue-100 text-blue-700',
      'Processing': 'bg-purple-100 text-purple-700',
      'Shipped': 'bg-indigo-100 text-indigo-700',
      'Out for Delivery': 'bg-orange-100 text-orange-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
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

  const formatDate = (date) => {
    if (!date) return 'Pending'
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Helper to determine if a status is completed
  const isStatusCompleted = (status, currentStatus) => {
    const statusOrder = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']
    const currentIndex = statusOrder.indexOf(currentStatus)
    const statusIndex = statusOrder.indexOf(status)
    return statusIndex <= currentIndex
  }

  // Helper to determine if a status is current
  const isStatusCurrent = (status, currentStatus) => {
    return status === currentStatus
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-playfair text-headline-md text-center">Track Your Glow</h1>
        <p className="text-on-surface-variant text-center mt-2">Follow your package from our lab to your doorstep.</p>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="mt-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter Tracking Number (e.g., GH-99283-X)"
              className="flex-1 bg-surface-container-low border-b-2 border-primary-container py-4 px-4 focus:border-primary outline-none transition-colors text-body-lg font-body-lg"
            />
            <button 
              type="submit"
              disabled={isTracking}
              className="bg-on-background text-on-primary px-8 py-4 rounded-full font-label-caps text-label-caps hover:bg-primary transition-colors disabled:opacity-50"
            >
              {isTracking ? 'Tracking...' : 'Track Order'}
            </button>
          </div>
          <div className="mt-4 flex gap-4 text-sm text-on-surface-variant">
            <span className="font-label-caps text-label-caps">Recent Searches:</span>
            <button 
              onClick={() => {
                setOrderId('GH-77210-B')
                handleTrack(new Event('submit'))
              }}
              className="text-primary font-label-caps text-label-caps hover:underline"
            >
              GH-77210-B
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-error-container text-on-error-container p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <div className="mt-12 bg-surface-container-lowest p-6 rounded-2xl shadow-[0_8px_40px_rgba(244,194,194,0.15)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(trackingData.status)}`}>
                  <span className="material-symbols-outlined text-sm align-middle mr-1">
                    {getStatusIcon(trackingData.status)}
                  </span>
                  {trackingData.status}
                </span>
                <h2 className="font-playfair text-headline-sm mt-2">
                  {trackingData.status === 'Delivered' 
                    ? 'Delivered Successfully!' 
                    : `Expected Arrival: ${formatDate(trackingData.estimatedDelivery)}`}
                </h2>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-secondary mb-1">Order ID</p>
                <p className="font-body-md font-semibold">#{trackingData.orderId}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-outline-variant"></div>
              
              {/* Timeline statuses in order */}
              {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((status) => {
                const isCompleted = isStatusCompleted(status, trackingData.status)
                const isCurrent = isStatusCurrent(status, trackingData.status)
                
                // Find matching timeline event for this status
                const timelineEvent = trackingData.timeline?.find(event => event.status === status)
                
                return (
                  <div key={status} className="flex gap-6 relative mb-8 last:mb-0">
                    <div className={`z-10 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center flex-shrink-0
                      ${isCompleted ? 'bg-primary border-primary-container' : 'bg-surface-container border-outline-variant'}`}
                    >
                      {isCompleted && (
                        <span className="material-symbols-outlined text-white text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className={`font-semibold ${isCurrent ? 'text-primary' : isCompleted ? 'text-on-surface' : 'text-outline'}`}>
                          {status}
                        </h3>
                        {isCurrent && (
                          <span className="animate-pulse text-xs text-primary font-bold">● CURRENT</span>
                        )}
                      </div>
                      {timelineEvent && (
                        <>
                          <p className="text-on-surface-variant text-sm">{timelineEvent.description || `Order ${status.toLowerCase()}`}</p>
                          <p className="text-outline text-xs mt-1">{formatDate(timelineEvent.date)}</p>
                        </>
                      )}
                      {!timelineEvent && !isCompleted && (
                        <p className="text-outline text-sm">Pending</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to={`/order/${trackingData.orderId}`} className="flex-1 bg-inverse-surface text-on-primary py-4 rounded-lg font-label-caps text-sm tracking-widest shadow-lg hover:shadow-primary/20 transition-all flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-lg">receipt_long</span>
                VIEW ORDER DETAILS
              </Link>
              <button className="flex-1 bg-white border border-outline-variant text-on-surface py-4 rounded-lg font-label-caps text-sm tracking-widest transition-all flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-lg">local_shipping</span>
                VIEW CARRIER TRACKING
              </button>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-8 bg-surface-container-low p-6 rounded-2xl">
          <h3 className="font-playfair text-headline-sm mb-3">Tracking Tips</h3>
          <ul className="space-y-2 text-on-surface-variant text-sm">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">info</span>
              Your tracking number was sent to your email when the order was confirmed.
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">schedule</span>
              Tracking updates may take 24-48 hours to appear.
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">contact_support</span>
              For any issues, please contact our support team.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking