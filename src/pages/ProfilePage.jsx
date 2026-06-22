import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

const ProfilePage = () => {
  const { user, logout, updateProfile, changePassword } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    }
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      await updateProfile(formData)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }
    
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setIsChangingPassword(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl text-center">
        <p className="text-on-surface-variant">Please log in to view your profile.</p>
        <Link to="/login" className="text-primary underline mt-2 inline-block">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-playfair text-headline-md">My Profile</h1>
        <div className="flex gap-4">
          <button
            onClick={logout}
            className="border border-error text-error px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-error-container transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-error-container text-on-error-container'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Profile Information */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-playfair text-headline-sm">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-primary font-label-caps text-label-caps hover:underline"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-surface-container-low border-b-2 ${
                      isEditing ? 'border-primary focus:border-primary' : 'border-transparent'
                    } py-2 px-0 focus:ring-0 outline-none transition-colors disabled:opacity-60`}
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-surface-container-low border-b-2 ${
                      isEditing ? 'border-primary focus:border-primary' : 'border-transparent'
                    } py-2 px-0 focus:ring-0 outline-none transition-colors disabled:opacity-60`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-surface-container-low border-b-2 border-transparent py-2 px-0 focus:ring-0 outline-none opacity-60"
                />
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full bg-surface-container-low border-b-2 ${
                    isEditing ? 'border-primary focus:border-primary' : 'border-transparent'
                  } py-2 px-0 focus:ring-0 outline-none transition-colors disabled:opacity-60`}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {isEditing && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary py-3 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Password & Address */}
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-headline-sm">Security</h2>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="text-primary font-label-caps text-label-caps hover:underline"
              >
                {isChangingPassword ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-2 px-0 focus:ring-0 outline-none transition-colors"
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-2 px-0 focus:ring-0 outline-none transition-colors"
                    placeholder="Enter new password (min 8 chars)"
                    required
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-2 px-0 focus:ring-0 outline-none transition-colors"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-on-background text-on-primary py-3 rounded-full font-label-caps text-label-caps hover:bg-primary transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}

            {!isChangingPassword && (
              <div className="text-on-surface-variant text-sm">
                <p>Password last changed: {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Never'}</p>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <h2 className="font-playfair text-headline-sm mb-6">Shipping Address</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                    Street
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-surface-container-low border-b-2 ${
                      isEditing ? 'border-primary focus:border-primary' : 'border-transparent'
                    } py-2 px-0 focus:ring-0 outline-none transition-colors disabled:opacity-60`}
                    placeholder="123 Main St"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-surface-container-low border-b-2 ${
                      isEditing ? 'border-primary focus:border-primary' : 'border-transparent'
                    } py-2 px-0 focus:ring-0 outline-none transition-colors disabled:opacity-60`}
                    placeholder="New York"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-surface-container-low border-b-2 ${
                      isEditing ? 'border-primary focus:border-primary' : 'border-transparent'
                    } py-2 px-0 focus:ring-0 outline-none transition-colors disabled:opacity-60`}
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-surface-container-low border-b-2 ${
                      isEditing ? 'border-primary focus:border-primary' : 'border-transparent'
                    } py-2 px-0 focus:ring-0 outline-none transition-colors disabled:opacity-60`}
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full bg-surface-container-low border-b-2 ${
                      isEditing ? 'border-primary focus:border-primary' : 'border-transparent'
                    } py-2 px-0 focus:ring-0 outline-none transition-colors disabled:opacity-60`}
                    placeholder="USA"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage