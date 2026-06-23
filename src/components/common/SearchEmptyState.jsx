import React from 'react'
import { Link } from 'react-router-dom'

const SearchEmptyState = ({ searchTerm }) => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-primary-container/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="material-symbols-outlined text-5xl text-primary">search</span>
      </div>
      <h3 className="font-playfair text-headline-sm mb-2">No results found</h3>
      <p className="text-on-surface-variant max-w-md mx-auto">
        We couldn't find any products matching "<span className="font-semibold text-primary">{searchTerm}</span>"
      </p>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <Link 
          to="/shop" 
          className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-on-background transition-colors"
        >
          Clear Search
        </Link>
        <Link 
          to="/shop" 
          className="border border-primary text-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-primary-container/10 transition-colors"
        >
          Browse All Products
        </Link>
      </div>
      
      {/* Suggestions */}
      <div className="mt-8">
        <p className="text-sm text-on-surface-variant mb-3">Try searching for:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Serum', 'Moisturizer', 'Lipstick', 'Nail Polish', 'Vegan', 'Natural'].map((term) => (
            <Link
              key={term}
              to={`/shop?search=${term}`}
              className="px-4 py-1 bg-surface-container rounded-full text-sm text-on-surface-variant hover:bg-primary-container hover:text-primary transition-colors"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchEmptyState
