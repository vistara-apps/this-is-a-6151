import React from 'react'
import { ProductCard } from './ProductCard'
import { mockProducts } from '../data/mockData'

export function SavedItems({ user, updateUser }) {
  const savedProductIds = user.savedItems?.map(item => item.productId) || []
  const savedProducts = mockProducts.filter(product => 
    savedProductIds.includes(product.productId)
  )

  const handleRemoveItem = (productId) => {
    updateUser({
      savedItems: user.savedItems.filter(item => item.productId !== productId)
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8 pb-20 lg:pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-text-primary mb-2">
          Saved Items
        </h1>
        <p className="text-text-secondary">
          Your collection of sustainable fashion favorites
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg mb-4">
            You haven't saved any items yet.
          </p>
          <p className="text-text-secondary">
            Start discovering products and save your favorites!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onSave={() => handleRemoveItem(product.productId)}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}