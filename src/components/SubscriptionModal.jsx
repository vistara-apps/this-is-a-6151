import React, { useState } from 'react'
import { X, Check, Crown, Sparkles } from 'lucide-react'
import { getPricingPlans, subscriptionService } from '../services/stripe'

export function SubscriptionModal({ isOpen, onClose, user, onUpgrade }) {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('premium')
  
  const plans = getPricingPlans()
  const currentTier = subscriptionService.getUserTier(user)
  const usageStats = subscriptionService.getUsageStats(user)

  const handleUpgrade = async (planId) => {
    if (planId === 'free' || planId === currentTier) return
    
    setLoading(true)
    try {
      const result = await subscriptionService.simulateUpgrade(user.userId)
      if (result.success) {
        onUpgrade(result.tier)
        onClose()
      }
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary flex items-center space-x-2">
                <Crown className="w-6 h-6 text-accent" />
                <span>Upgrade Your Style Journey</span>
              </h2>
              <p className="text-text-secondary mt-1">
                Unlock unlimited personalized recommendations and exclusive features
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Usage Stats */}
        <div className="p-6 bg-bg border-b border-gray-200">
          <h3 className="text-lg font-medium text-text-primary mb-4">Your Current Usage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary">Saved Items</span>
                <span className="text-sm font-medium">
                  {usageStats.savedItems.current} / {usageStats.savedItems.limit === Infinity ? '∞' : usageStats.savedItems.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(usageStats.savedItems.percentage, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="bg-surface p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary">Recommendations</span>
                <span className="text-sm font-medium">
                  {usageStats.recommendations.current} / {usageStats.recommendations.limit === Infinity ? '∞' : usageStats.recommendations.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(usageStats.recommendations.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-6 rounded-lg border-2 transition-all ${
                  plan.id === selectedPlan
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                } ${plan.isPopular ? 'ring-2 ring-accent ring-opacity-50' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-text-primary mb-1">
                    {plan.priceDisplay}
                  </div>
                  {plan.price > 0 && (
                    <p className="text-text-secondary text-sm">per month</p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading || plan.id === currentTier}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.id === currentTier
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.isPopular
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-100 text-text-primary hover:bg-gray-200'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : plan.id === currentTier ? (
                    'Current Plan'
                  ) : (
                    plan.buttonText
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-text-primary">
                Why Upgrade to Premium?
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-secondary">
              <div>
                <strong className="text-text-primary">Unlimited Everything</strong>
                <p>Save unlimited items and get unlimited AI-powered recommendations</p>
              </div>
              <div>
                <strong className="text-text-primary">Early Access</strong>
                <p>Be the first to discover new sustainable brands and collections</p>
              </div>
              <div>
                <strong className="text-text-primary">Advanced Features</strong>
                <p>Access premium filtering options and personalized style insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
