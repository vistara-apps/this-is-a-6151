import React, { useState } from 'react'
import { BrandCard } from './BrandCard'
import { mockBrands } from '../data/mockData'

export function BrandsDirectory({ user }) {
  const [brands] = useState(mockBrands)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.aestheticTags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="max-w-6xl mx-auto px-5 py-8 pb-20 lg:pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-text-primary mb-2">
          Sustainable Brands
        </h1>
        <p className="text-text-secondary">
          Discover verified eco-friendly fashion brands
        </p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {filteredBrands.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg">
            No brands found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <BrandCard key={brand.brandId} brand={brand} />
          ))}
        </div>
      )}
    </div>
  )
}