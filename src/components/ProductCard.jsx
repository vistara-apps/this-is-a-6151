import React from 'react'
import { Heart, ExternalLink } from 'lucide-react'
import { Tag } from './Tag'

export function ProductCard({ product, onSave, isSaved }) {
  return (
    <div className="bg-surface rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={onSave}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isSaved
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-text-primary mb-1">{product.name}</h3>
          <p className="text-sm text-text-secondary">{product.brand?.name}</p>
        </div>
        
        <p className="text-text-secondary text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {product.sustainableMaterials.slice(0, 2).map((material) => (
            <Tag key={material} variant="secondary" size="sm">
              {material}
            </Tag>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-primary">
            ${product.price}
          </span>
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
          >
            <span className="text-sm font-medium">View</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}