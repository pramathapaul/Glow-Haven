import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">error</span>
          <h1 className="font-playfair text-headline-md mb-2 text-on-surface">Something went wrong</h1>
          <p className="text-on-surface-variant mb-6 max-w-md">
            We're sorry, but something went wrong. Please try refreshing the page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null })
                window.location.href = '/'
              }}
              className="border border-primary text-primary px-6 py-3 rounded-full font-label-caps text-label-caps hover:bg-primary-container/10 transition-colors"
            >
              Go Home
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <details className="mt-8 text-left w-full max-w-2xl bg-surface-container p-4 rounded-xl">
              <summary className="font-label-caps text-label-caps cursor-pointer text-on-surface-variant">
                Error Details (Development Only)
              </summary>
              <pre className="mt-4 text-sm text-on-surface-variant whitespace-pre-wrap overflow-auto max-h-60">
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary