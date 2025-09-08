import React, { useState, useEffect } from 'react'
import { ProductCard } from './ProductCard'
import { FilterBar } from './FilterBar'
import { mockProducts } from '../data/mockData'

export function DiscoveryFeed({ user, updateUser }) {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sustainability: 'all'
  })

  // Load and filter products based on user preferences
  useEffect(() => {
    // Filter products based on user style preferences
    const userProducts = user.stylePreferences.length > 0
      ? mockProducts.filter(product => 
          product.aestheticTags.some(tag => user.stylePreferences.includes(tag))
        )
      : mockProducts

    setProducts(userProducts)
    setFilteredProducts(userProducts)
  }, [user.stylePreferences])

  // Apply filters
  useEffect(() => {
    let filtered = [...products]

    if (filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category === filters.category
      )
    }

    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(product => {
        const price = product.price
        if (max) {
          return price >= min && price <= max
        }
        return price >= min
      })
    }

    if (filters.sustainability !== 'all') {
      filtered = filtered.filter(product => 
        product.sustainableMaterials.includes(filters.sustainability)
      )
    }

    setFilteredProducts(filtered)
  }, [filters, products])

  const handleSaveItem = (productId) => {
    const savedItems = user.savedItems || []
    const isAlreadySaved = savedItems.some(item => item.productId === productId)
    
    if (isAlreadySaved) {
      // Remove from saved items
      updateUser({
        savedItems: savedItems.filter(item => item.productId !== productId)
      })
    } else {
      // Add to saved items
      updateUser({
        savedItems: [
          ...savedItems,
          {
            savedItemId: crypto.randomUUID(),
            userId: user.userId,
            productId,
            savedAt: new Date().toISOString()
          }
        ]
      })
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8 pb-20 lg:pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-text-primary mb-2">
          Discover Sustainable Fashion
        </h1>
        <p className="text-text-secondary">
          Curated for your {user.stylePreferences.join(', ')} style
        </p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg">
            No products found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onSave={() => handleSaveItem(product.productId)}
              isSaved={user.savedItems?.some(item => item.productId === product.productId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}