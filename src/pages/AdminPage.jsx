import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminProducts from '../components/admin/AdminProducts'

const AdminPage = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="products" element={<AdminProducts />} />
    </Routes>
  )
}

export default AdminPage