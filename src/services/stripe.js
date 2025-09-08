import { loadStripe } from '@stripe/stripe-js'
import { config } from '../config/env'

// Initialize Stripe
let stripePromise = null

if (config.stripe.publishableKey && config.stripe.publishableKey !== 'pk_test_your-key') {
  stripePromise = loadStripe(config.stripe.publishableKey)
} else {
  console.warn('Stripe not configured - subscription features disabled')
}

// Subscription tiers configuration
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Limited personalized recommendations',
      'Basic brand directory access',
      'Save up to 10 items',
      'Community support'
    ],
    limits: {
      savedItems: 10,
      recommendations: 5,
      brandAccess: 'basic'
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 7,
    priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited personalized recommendations',
      'Full brand directory access',
      'Unlimited saved items',
      'Early access to new brands',
      'Advanced filtering options',
      'Priority support'
    ],
    limits: {
      savedItems: Infinity,
      recommendations: Infinity,
      brandAccess: 'full'
    }
  }
}

// Subscription service
export const subscriptionService = {
  // Get user's current subscription tier
  getUserTier(user) {
    return user?.subscription_tier || 'free'
  },

  // Check if user has access to a feature
  hasFeatureAccess(user, feature) {
    const tier = this.getUserTier(user)
    const tierConfig = SUBSCRIPTION_TIERS[tier.toUpperCase()]
    
    switch (feature) {
      case 'unlimited_saves':
        return tierConfig.limits.savedItems === Infinity
      case 'unlimited_recommendations':
        return tierConfig.limits.recommendations === Infinity
      case 'full_brand_access':
        return tierConfig.limits.brandAccess === 'full'
      case 'early_brand_access':
        return tier === 'premium'
      default:
        return true
    }
  },

  // Check if user has reached their limits
  hasReachedLimit(user, limitType, currentCount) {
    const tier = this.getUserTier(user)
    const tierConfig = SUBSCRIPTION_TIERS[tier.toUpperCase()]
    
    const limit = tierConfig.limits[limitType]
    return limit !== Infinity && currentCount >= limit
  },

  // Create Stripe checkout session
  async createCheckoutSession(priceId, userId, successUrl, cancelUrl) {
    if (!stripePromise) {
      throw new Error('Stripe not configured')
    }

    try {
      // In a real app, this would call your backend API
      // For now, we'll simulate the checkout process
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl,
          cancelUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const session = await response.json()
      
      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  },

  // Simulate subscription upgrade (for demo purposes)
  async simulateUpgrade(userId) {
    // In a real app, this would be handled by Stripe webhooks
    // For demo purposes, we'll just update the user's tier
    try {
      const user = JSON.parse(localStorage.getItem('ecostyle-user') || '{}')
      user.subscription_tier = 'premium'
      user.subscription_status = 'active'
      user.subscription_start = new Date().toISOString()
      localStorage.setItem('ecostyle-user', JSON.stringify(user))
      
      return {
        success: true,
        tier: 'premium'
      }
    } catch (error) {
      console.error('Error simulating upgrade:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Get subscription status
  getSubscriptionStatus(user) {
    const tier = this.getUserTier(user)
    const status = user?.subscription_status || 'inactive'
    
    return {
      tier,
      status,
      isActive: status === 'active',
      isPremium: tier === 'premium',
      features: SUBSCRIPTION_TIERS[tier.toUpperCase()]?.features || [],
      limits: SUBSCRIPTION_TIERS[tier.toUpperCase()]?.limits || {}
    }
  },

  // Calculate usage statistics
  getUsageStats(user) {
    const savedItemsCount = user?.savedItems?.length || 0
    const tier = this.getUserTier(user)
    const tierConfig = SUBSCRIPTION_TIERS[tier.toUpperCase()]
    
    return {
      savedItems: {
        current: savedItemsCount,
        limit: tierConfig.limits.savedItems,
        percentage: tierConfig.limits.savedItems === Infinity 
          ? 0 
          : Math.min((savedItemsCount / tierConfig.limits.savedItems) * 100, 100)
      },
      recommendations: {
        current: user?.recommendationsUsed || 0,
        limit: tierConfig.limits.recommendations,
        percentage: tierConfig.limits.recommendations === Infinity 
          ? 0 
          : Math.min(((user?.recommendationsUsed || 0) / tierConfig.limits.recommendations) * 100, 100)
      }
    }
  }
}

// Pricing component helper
export const getPricingPlans = () => {
  return Object.values(SUBSCRIPTION_TIERS).map(tier => ({
    ...tier,
    isPopular: tier.id === 'premium',
    buttonText: tier.id === 'free' ? 'Current Plan' : 'Upgrade Now',
    priceDisplay: tier.price === 0 ? 'Free' : `$${tier.price}/month`
  }))
}

export default stripePromise
