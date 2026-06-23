import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductList from '../components/products/ProductList'

const Shop = () => {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category') || 'All'
  const search = searchParams.get('search') || ''

  const categories = ['All', 'Serums', 'Moisturizers', 'Cleansers', 'Masks', 'Toners', 'Eye Care', 'Sun Care', 'Lipsticks', 'Nail Polish', 'Makeup']

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-stack-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-gutter mb-8">
        <div>
          {search ? (
            <>
              <h1 className="font-playfair text-display-lg-mobile md:text-headline-md text-on-surface">
                Search Results
              </h1>
              <p className="text-body-lg text-on-surface-variant">
                Showing results for "<span className="font-semibold text-primary">{search}</span>"
              </p>
            </>
          ) : (
            <>
              <h1 className="font-playfair text-display-lg-mobile md:text-headline-md text-on-surface">
                {category === 'All' ? 'All Products' : category}
              </h1>
              <p className="text-body-lg text-on-surface-variant">
                Discover a curated sanctuary of clinical efficacy and botanical indulgence.
              </p>
            </>
          )}
        </div>
        <div className="relative">
          <select className="appearance-none bg-surface-container-low border-none rounded-full py-3 px-6 pr-10 text-body-md focus:ring-1 focus:ring-primary-container cursor-pointer">
            <option>Sort by: Popularity</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline">expand_more</span>
        </div>
      </div>

      {/* Category Chips - Only show when not searching */}
      {!search && (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => {
            const isActive = category === cat
            return (
              <Link
                key={cat}
                to={`/shop${cat === 'All' ? '' : `?category=${cat}`}`}
                className={`whitespace-nowrap px-6 py-2 rounded-full font-label-caps text-label-caps transition-all ${
                  isActive ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container hover:bg-primary-container'
                }`}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      )}

      {/* Product Grid */}
      <ProductList />
    </div>
  )
}

export default Shop
