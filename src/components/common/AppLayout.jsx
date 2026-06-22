import React from 'react'
import { Outlet } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import Navbar from './Navbar'
import Footer from './Footer'

const AppLayout = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default AppLayout