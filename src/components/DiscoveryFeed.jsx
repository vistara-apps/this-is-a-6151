import React, { useState, useEffect } from 'react'
import { ProductCard } from './ProductCard'
import { FilterBar } from './FilterBar'
import { RecommendationsSection } from './RecommendationsSection'
import { SubscriptionModal } from './SubscriptionModal'
import dataService from '../services/dataService'

export function DiscoveryFeed({ user, updateUser }) {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sustainability: 'all'
  })

  // Load and filter products based on user preferences
  useEffect(() => {
    loadProducts()
  }, [user.stylePreferences])

  const loadProducts = async () => {
    try {
      setLoading(true)
      
      // Get personalized products based on user preferences
      const userProducts = user.stylePreferences.length > 0
        ? await dataService.getPersonalizedProducts(user.userId, user.stylePreferences)
        : await dataService.getProducts()

      setProducts(userProducts)
      setFilteredProducts(userProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      // Fallback to empty array on error
      setProducts([])
      setFilteredProducts([])
    } finally {
      setLoading(false)
    }
  }

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

  const handleSaveItem = async (productId) => {
    const savedItems = user.savedItems || []
    const isAlreadySaved = savedItems.some(item => item.productId === productId)
    
    // Check if user has reached save limit
    if (!isAlreadySaved && !dataService.hasFeatureAccess(user, 'unlimited_saves')) {
      const hasReachedLimit = dataService.hasReachedLimit(user, 'savedItems', savedItems.length)
      if (hasReachedLimit) {
        setShowSubscriptionModal(true)
        return
      }
    }
    
    if (isAlreadySaved) {
      // Remove from saved items
      await dataService.unsaveItem(user.userId, productId)
      updateUser({
        savedItems: savedItems.filter(item => item.productId !== productId)
      })
    } else {
      // Add to saved items
      await dataService.saveItem(user.userId, productId)
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

  const handleUpgrade = (newTier) => {
    updateUser({ subscription_tier: newTier })
    setShowSubscriptionModal(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8 pb-20 lg:pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-text-primary mb-2">
          Discover Sustainable Fashion
        </h1>
        <p className="text-text-secondary">
          {user.stylePreferences.length > 0 
            ? `Curated for your ${user.stylePreferences.join(', ')} style`
            : 'Explore eco-friendly fashion that matches your values'
          }
        </p>
      </div>

      {/* AI Recommendations Section */}
      {user.stylePreferences.length > 0 && (
        <div className="mb-12">
          <RecommendationsSection 
            user={user} 
            updateUser={updateUser}
            onUpgradeClick={() => setShowSubscriptionModal(true)}
          />
        </div>
      )}

      {/* Products Discovery Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text-primary">
            All Products
          </h2>
          <div className="text-sm text-text-secondary">
            {filteredProducts.length} items found
          </div>
        </div>

        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-text-secondary">Loading sustainable fashion...</span>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              No products found matching your criteria.
            </p>
            <p className="text-text-secondary text-sm mt-2">
              Try adjusting your filters or explore different style preferences.
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

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        user={user}
        onUpgrade={handleUpgrade}
      />
    </div>
  )
}
