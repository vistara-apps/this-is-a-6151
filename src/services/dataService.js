import { userService, brandService, productService, savedItemsService } from './supabase'
import { styleRecommendationService } from './openai'
import { subscriptionService } from './stripe'
import { mockBrands, mockProducts } from '../data/mockData'
import { validateConfig } from '../config/env'

// Unified data service that handles both API and mock data
class DataService {
  constructor() {
    this.useRealAPI = validateConfig()
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes
  }

  // Cache management
  getCacheKey(method, params) {
    return `${method}_${JSON.stringify(params)}`
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  getCache(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }

  // User operations
  async getUser(userId) {
    if (!this.useRealAPI) {
      // Return mock user data from localStorage
      const userData = localStorage.getItem('ecostyle-user')
      return userData ? JSON.parse(userData) : null
    }

    const cacheKey = this.getCacheKey('getUser', { userId })
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const user = await userService.getUser(userId)
    if (user) {
      this.setCache(cacheKey, user)
    }
    return user
  }

  async updateUser(userData) {
    if (!this.useRealAPI) {
      // Update localStorage
      localStorage.setItem('ecostyle-user', JSON.stringify(userData))
      return userData
    }

    const result = await userService.upsertUser(userData)
    
    // Clear user cache
    this.cache.forEach((_, key) => {
      if (key.startsWith('getUser_')) {
        this.cache.delete(key)
      }
    })

    return result
  }

  // Brand operations
  async getBrands(filters = {}) {
    if (!this.useRealAPI) {
      let brands = [...mockBrands]
      
      if (filters.aestheticTags && filters.aestheticTags.length > 0) {
        brands = brands.filter(brand => 
          brand.aestheticTags.some(tag => filters.aestheticTags.includes(tag))
        )
      }
      
      return brands.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)
    }

    const cacheKey = this.getCacheKey('getBrands', filters)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    let brands
    if (filters.aestheticTags && filters.aestheticTags.length > 0) {
      brands = await brandService.getBrandsByAesthetic(filters.aestheticTags)
    } else {
      brands = await brandService.getBrands()
    }

    this.setCache(cacheKey, brands)
    return brands
  }

  // Product operations
  async getProducts(filters = {}) {
    if (!this.useRealAPI) {
      let products = [...mockProducts]
      
      // Apply filters
      if (filters.brandId) {
        products = products.filter(p => p.brandId === filters.brandId)
      }
      
      if (filters.category && filters.category !== 'all') {
        products = products.filter(p => p.category === filters.category)
      }
      
      if (filters.aestheticTags && filters.aestheticTags.length > 0) {
        products = products.filter(p => 
          p.aestheticTags.some(tag => filters.aestheticTags.includes(tag))
        )
      }
      
      if (filters.priceMin) {
        products = products.filter(p => p.price >= filters.priceMin)
      }
      
      if (filters.priceMax) {
        products = products.filter(p => p.price <= filters.priceMax)
      }
      
      if (filters.sustainableMaterials && filters.sustainableMaterials.length > 0) {
        products = products.filter(p => 
          p.sustainableMaterials.some(material => filters.sustainableMaterials.includes(material))
        )
      }
      
      return products
    }

    const cacheKey = this.getCacheKey('getProducts', filters)
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const products = await productService.getProducts(filters)
    this.setCache(cacheKey, products)
    return products
  }

  async getPersonalizedProducts(userId, stylePreferences) {
    if (!this.useRealAPI) {
      // Use mock data with style filtering
      const products = await this.getProducts({ aestheticTags: stylePreferences })
      return products.slice(0, 20) // Limit to 20 for performance
    }

    const cacheKey = this.getCacheKey('getPersonalizedProducts', { userId, stylePreferences })
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const products = await productService.getPersonalizedProducts(userId, stylePreferences)
    this.setCache(cacheKey, products)
    return products
  }

  // AI-powered recommendations
  async getStyleRecommendations(userPreferences, products) {
    const cacheKey = this.getCacheKey('getStyleRecommendations', { userPreferences, productCount: products.length })
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const recommendations = await styleRecommendationService.getStyleRecommendations(userPreferences, products)
    this.setCache(cacheKey, recommendations)
    return recommendations
  }

  async generateStyleInsights(selectedStyles) {
    const cacheKey = this.getCacheKey('generateStyleInsights', { selectedStyles })
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const insights = await styleRecommendationService.generateStyleInsights(selectedStyles)
    this.setCache(cacheKey, insights)
    return insights
  }

  // Saved items operations
  async getSavedItems(userId) {
    if (!this.useRealAPI) {
      const userData = localStorage.getItem('ecostyle-user')
      const user = userData ? JSON.parse(userData) : null
      const savedItemIds = user?.savedItems?.map(item => item.productId) || []
      
      // Get full product data for saved items
      const allProducts = await this.getProducts()
      return savedItemIds.map(productId => {
        const product = allProducts.find(p => p.productId === productId)
        return product ? {
          savedItemId: crypto.randomUUID(),
          userId,
          productId,
          savedAt: new Date().toISOString(),
          product
        } : null
      }).filter(Boolean)
    }

    const cacheKey = this.getCacheKey('getSavedItems', { userId })
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    const savedItems = await savedItemsService.getSavedItems(userId)
    this.setCache(cacheKey, savedItems)
    return savedItems
  }

  async saveItem(userId, productId) {
    if (!this.useRealAPI) {
      // Update localStorage
      const userData = localStorage.getItem('ecostyle-user')
      const user = userData ? JSON.parse(userData) : {}
      
      const savedItems = user.savedItems || []
      const isAlreadySaved = savedItems.some(item => item.productId === productId)
      
      if (!isAlreadySaved) {
        savedItems.push({
          savedItemId: crypto.randomUUID(),
          userId,
          productId,
          savedAt: new Date().toISOString()
        })
        
        user.savedItems = savedItems
        localStorage.setItem('ecostyle-user', JSON.stringify(user))
      }
      
      return !isAlreadySaved
    }

    const result = await savedItemsService.saveItem(userId, productId)
    
    // Clear saved items cache
    this.cache.forEach((_, key) => {
      if (key.startsWith('getSavedItems_')) {
        this.cache.delete(key)
      }
    })
    
    return result
  }

  async unsaveItem(userId, productId) {
    if (!this.useRealAPI) {
      // Update localStorage
      const userData = localStorage.getItem('ecostyle-user')
      const user = userData ? JSON.parse(userData) : {}
      
      const savedItems = user.savedItems || []
      user.savedItems = savedItems.filter(item => item.productId !== productId)
      localStorage.setItem('ecostyle-user', JSON.stringify(user))
      
      return true
    }

    const result = await savedItemsService.unsaveItem(userId, productId)
    
    // Clear saved items cache
    this.cache.forEach((_, key) => {
      if (key.startsWith('getSavedItems_')) {
        this.cache.delete(key)
      }
    })
    
    return result
  }

  // Subscription operations
  getSubscriptionStatus(user) {
    return subscriptionService.getSubscriptionStatus(user)
  }

  hasFeatureAccess(user, feature) {
    return subscriptionService.hasFeatureAccess(user, feature)
  }

  hasReachedLimit(user, limitType, currentCount) {
    return subscriptionService.hasReachedLimit(user, limitType, currentCount)
  }

  getUsageStats(user) {
    return subscriptionService.getUsageStats(user)
  }

  async upgradeSubscription(userId) {
    return subscriptionService.simulateUpgrade(userId)
  }

  // Analytics and insights
  async getDiscoveryInsights(userId, stylePreferences) {
    const products = await this.getPersonalizedProducts(userId, stylePreferences)
    const brands = await this.getBrands({ aestheticTags: stylePreferences })
    
    return {
      totalProducts: products.length,
      matchingBrands: brands.length,
      averageSustainabilityScore: brands.reduce((sum, brand) => sum + brand.sustainabilityScore, 0) / brands.length,
      topCategories: this.getTopCategories(products),
      priceRange: this.getPriceRange(products)
    }
  }

  getTopCategories(products) {
    const categories = {}
    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1
    })
    
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }))
  }

  getPriceRange(products) {
    if (products.length === 0) return { min: 0, max: 0, average: 0 }
    
    const prices = products.map(p => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: prices.reduce((sum, price) => sum + price, 0) / prices.length
    }
  }

  // Clear all caches
  clearCache() {
    this.cache.clear()
  }
}

// Create singleton instance
const dataService = new DataService()

export default dataService
