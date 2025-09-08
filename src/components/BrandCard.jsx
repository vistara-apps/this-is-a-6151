import React from 'react'
import { ExternalLink, Award } from 'lucide-react'
import { Tag } from './Tag'

export function BrandCard({ brand }) {
  return (
    <div className="bg-surface rounded-lg shadow-card p-6 hover:shadow-lg transition-shadow animate-fade-in">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-text-primary mb-2">{brand.name}</h3>
        <p className="text-text-secondary text-sm line-clamp-3">
          {brand.description}
        </p>
      </div>

      {brand.sustainabilityScore && (
        <div className="flex items-center space-x-2 mb-4">
          <Award className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-text-primary">
            Sustainability Score: {brand.sustainabilityScore}/10
          </span>
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-text-primary mb-2">Certifications</h4>
        <div className="flex flex-wrap gap-1">
          {brand.certifications.map((cert) => (
            <Tag key={cert} variant="primary" size="sm">
              {cert}
            </Tag>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-text-primary mb-2">Style Tags</h4>
        <div className="flex flex-wrap gap-1">
          {brand.aestheticTags.slice(0, 3).map((tag) => (
            <Tag key={tag} variant="outline" size="sm">
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      <a
        href={brand.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors font-medium"
      >
        <span>Visit Website</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  )
}