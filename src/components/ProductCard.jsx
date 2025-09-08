import React from 'react'
import { Heart, ExternalLink } from 'lucide-react'
import { Tag } from './Tag'

export function ProductCard({ product, onSave, isSaved, compact = false }) {
  const cardClasses = compact 
    ? "bg-surface rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow animate-fade-in max-w-sm"
    : "bg-surface rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
  
  const imageClasses = compact 
    ? "w-full h-40 object-cover"
    : "w-full h-48 object-cover"

  return (
    <div className={cardClasses}>
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={imageClasses}
        />
        <button
          onClick={onSave}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isSaved
              ? 'bg-primary text-white'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-primary'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className={compact ? "p-3" : "p-4"}>
        <div className="mb-2">
          <h3 className={`font-semibold text-text-primary mb-1 ${compact ? 'text-sm' : ''}`}>
            {product.name}
          </h3>
          <p className={`text-text-secondary ${compact ? 'text-xs' : 'text-sm'}`}>
            {product.brand?.name || product.brand}
          </p>
        </div>
        
        {!compact && (
          <p className="text-text-secondary text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-3">
          {product.sustainableMaterials?.slice(0, compact ? 1 : 2).map((material) => (
            <Tag key={material} variant="secondary" size="sm">
              {material}
            </Tag>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`font-semibold text-primary ${compact ? 'text-base' : 'text-lg'}`}>
            ${product.price}
          </span>
          <a
            href={product.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
          >
            <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>View</span>
            <ExternalLink className={compact ? "w-3 h-3" : "w-4 h-4"} />
          </a>
        </div>
      </div>
    </div>
  )
}
