import React, { useState } from 'react'
import { API_URL } from '../../api/config'

const AdminInvoiceUpload = ({ orderId, orderNumber, onInvoiceUploaded, onClose }) => {
  const [file, setFile] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload PDF, JPEG, or PNG files only')
        return
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }

      setFile(selectedFile)
      setError('')
      
      // Create preview URL for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreview(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('glowHavenToken')
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('invoiceFile', file)
      formData.append('notes', notes)

      const response = await fetch(`${API_URL}/orders/${orderId}/invoice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // Don't set Content-Type, browser will set it with boundary
      })

      const data = await response.json()
      
      if (data.success) {
        onInvoiceUploaded(data.data)
        onClose()
      } else {
        setError(data.message || 'Failed to upload invoice')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload invoice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-playfair text-headline-sm">Upload Invoice</h3>
          <button onClick={onClose} className="text-outline hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-on-surface-variant text-sm mb-4">
          Order: <span className="font-semibold text-primary">#{orderNumber}</span>
        </p>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* File Drop Zone */}
        <div 
          className="border-2 border-dashed border-outline-variant rounded-xl p-6 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => document.getElementById('fileInput').click()}
        >
          {preview ? (
            <div className="space-y-2">
              <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded" />
              <p className="text-xs text-on-surface-variant">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
              <p className="text-xs text-on-surface-variant">
                Click to change file
              </p>
            </div>
          ) : file ? (
            <div className="space-y-2">
              <span className="material-symbols-outlined text-4xl text-primary">description</span>
              <p className="text-on-surface-variant text-sm font-semibold">{file.name}</p>
              <p className="text-xs text-on-surface-variant">{(file.size / 1024).toFixed(1)} KB</p>
              <p className="text-xs text-on-surface-variant">Click to change file</p>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="material-symbols-outlined text-4xl text-outline">upload_file</span>
              <p className="text-on-surface-variant text-sm">Click to upload or drag and drop</p>
              <p className="text-xs text-outline">PDF, JPEG, PNG (Max 5MB)</p>
            </div>
          )}
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary py-2 px-0 focus:ring-0 outline-none transition-colors resize-none"
            placeholder="Add any notes about this invoice..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-outline-variant text-on-surface py-3 rounded-full font-label-caps text-label-caps hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="flex-1 bg-primary text-on-primary py-3 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Uploading...
              </span>
            ) : (
              'Upload Invoice'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminInvoiceUpload