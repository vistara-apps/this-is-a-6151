import React, { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Heart, ExternalLink, Crown } from 'lucide-react'
import { ProductCard } from './ProductCard'
import dataService from '../services/dataService'

export function RecommendationsSection({ user, updateUser, onUpgradeClick }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState('')
  const [error, setError] = useState(null)

  const hasUnlimitedAccess = dataService.hasFeatureAccess(user, 'unlimited_recommendations')
  const hasReachedLimit = dataService.hasReachedLimit(user, 'recommendations', user?.recommendationsUsed || 0)

  useEffect(() => {
    loadRecommendations()
  }, [user.stylePreferences])

  const loadRecommendations = async () => {
    if (!user.stylePreferences || user.stylePreferences.length === 0) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get personalized products
      const products = await dataService.getPersonalizedProducts(user.userId, user.stylePreferences)
      
      if (products.length === 0) {
        setRecommendations([])
        setLoading(false)
        return
      }

      // Get AI-powered recommendations
      const aiRecommendations = await dataService.getStyleRecommendations(user.stylePreferences, products)
      
      // Generate style insights
      const styleInsights = await dataService.generateStyleInsights(user.stylePreferences)
      
      setRecommendations(aiRecommendations)
      setInsights(styleInsights)

      // Update user's recommendation usage count
      const newUsageCount = (user.recommendationsUsed || 0) + 1
      updateUser({ recommendationsUsed: newUsageCount })

    } catch (err) {
      console.error('Error loading recommendations:', err)
      setError('Failed to load recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveItem = async (productId) => {
    const savedItems = user.savedItems || []
    const isAlreadySaved = savedItems.some(item => item.productId === productId)
    
    if (!isAlreadySaved && !hasUnlimitedAccess) {
      const hasReachedSaveLimit = dataService.hasReachedLimit(user, 'savedItems', savedItems.length)
      if (hasReachedSaveLimit) {
        onUpgradeClick()
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

  if (loading) {
    return (
      <div className="bg-surface rounded-lg p-8 shadow-card">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-text-secondary">Curating your personalized recommendations...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface rounded-lg p-8 shadow-card">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <TrendingUp className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Oops! Something went wrong</p>
          </div>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={loadRecommendations}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!user.stylePreferences || user.stylePreferences.length === 0) {
    return (
      <div className="bg-surface rounded-lg p-8 shadow-card text-center">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Complete Your Style Profile
        </h3>
        <p className="text-text-secondary">
          Tell us about your style preferences to get personalized recommendations
        </p>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-surface rounded-lg p-8 shadow-card text-center">
        <TrendingUp className="w-12 h-12 text-text-secondary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          No Recommendations Yet
        </h3>
        <p className="text-text-secondary">
          We're working on finding the perfect sustainable fashion pieces for your {user.stylePreferences.join(', ')} style.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Usage Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">
              Personalized for You
            </h2>
            <p className="text-text-secondary">
              AI-curated sustainable fashion matching your style
            </p>
          </div>
        </div>
        
        {!hasUnlimitedAccess && (
          <div className="flex items-center space-x-2">
            <div className="text-sm text-text-secondary">
              {user.recommendationsUsed || 0} / 5 recommendations used
            </div>
            {hasReachedLimit && (
              <button
                onClick={onUpgradeClick}
                className="flex items-center space-x-1 bg-accent text-white px-3 py-1 rounded-full text-sm hover:bg-accent/90 transition-colors"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Style Insights */}
      {insights && (
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-2">Your Style Insight</h3>
              <p className="text-text-secondary leading-relaxed">{insights}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <div key={rec.product.productId} className="bg-surface rounded-lg p-6 shadow-card">
            <div className="flex items-start space-x-4 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-text-primary">
                    Recommendation #{index + 1}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-accent">
                    <Sparkles className="w-4 h-4" />
                    <span>{Math.round(rec.confidence * 100)}% match</span>
                  </div>
                </div>
                <p className="text-text-secondary text-sm">{rec.reason}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProductCard
                  product={rec.product}
                  onSave={() => handleSaveItem(rec.product.productId)}
                  isSaved={user.savedItems?.some(item => item.productId === rec.product.productId)}
                  compact={true}
                />
              </div>
              
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <h4 className="font-medium text-text-primary mb-2">Why This Matches Your Style</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {rec.product.aestheticTags?.map(tag => (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.stylePreferences.includes(tag)
                          ? 'bg-primary/20 text-primary'
                          : 'bg-gray-100 text-text-secondary'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 pt-2">
                  <button
                    onClick={() => handleSaveItem(rec.product.productId)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      user.savedItems?.some(item => item.productId === rec.product.productId)
                        ? 'bg-primary/20 text-primary'
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${
                      user.savedItems?.some(item => item.productId === rec.product.productId)
                        ? 'fill-current'
                        : ''
                    }`} />
                    <span className="text-sm">
                      {user.savedItems?.some(item => item.productId === rec.product.productId)
                        ? 'Saved'
                        : 'Save'
                      }
                    </span>
                  </button>
                  
                  <a
                    href={rec.product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span className="text-sm">Shop Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade CTA for Free Users */}
      {!hasUnlimitedAccess && hasReachedLimit && (
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white text-center">
          <Crown className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            You've reached your recommendation limit
          </h3>
          <p className="mb-4 opacity-90">
            Upgrade to Premium for unlimited AI-powered recommendations and exclusive features
          </p>
          <button
            onClick={onUpgradeClick}
            className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  )
}
