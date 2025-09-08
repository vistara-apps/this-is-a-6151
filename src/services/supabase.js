import { createClient } from '@supabase/supabase-js'
import { config, validateConfig } from '../config/env'

// Initialize Supabase client
let supabase = null

if (validateConfig()) {
  supabase = createClient(config.supabase.url, config.supabase.anonKey)
} else {
  console.warn('Supabase not configured - using mock data')
}

// Database schema types for TypeScript-like documentation
/*
Database Schema:

users table:
- user_id (uuid, primary key)
- email (text, optional)
- username (text, optional)
- style_preferences (jsonb)
- saved_items (jsonb)
- onboarding_complete (boolean)
- subscription_tier (text, default: 'free')
- created_at (timestamp)
- updated_at (timestamp)

brands table:
- brand_id (uuid, primary key)
- name (text)
- description (text)
- website_url (text)
- sustainability_score (float)
- certifications (text[])
- aesthetic_tags (text[])
- created_at (timestamp)
- updated_at (timestamp)

products table:
- product_id (uuid, primary key)
- brand_id (uuid, foreign key)
- name (text)
- description (text)
- image_url (text)
- product_url (text)
- price (decimal)
- sustainable_materials (text[])
- aesthetic_tags (text[])
- category (text)
- created_at (timestamp)
- updated_at (timestamp)

saved_items table:
- saved_item_id (uuid, primary key)
- user_id (uuid, foreign key)
- product_id (uuid, foreign key)
- saved_at (timestamp)
*/

// User operations
export const userService = {
  // Create or update user profile
  async upsertUser(userData) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'user_id' })
      .select()
      .single()
    
    if (error) {
      console.error('Error upserting user:', error)
      return null
    }
    
    return data
  },

  // Get user by ID
  async getUser(userId) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    
    return data
  },

  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('users')
      .update({ 
        style_preferences: preferences,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating preferences:', error)
      return null
    }
    
    return data
  }
}

// Brand operations
export const brandService = {
  // Get all brands
  async getBrands() {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Error fetching brands:', error)
      return []
    }
    
    return data || []
  },

  // Get brands by aesthetic tags
  async getBrandsByAesthetic(aestheticTags) {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .overlaps('aesthetic_tags', aestheticTags)
      .order('sustainability_score', { ascending: false })
    
    if (error) {
      console.error('Error fetching brands by aesthetic:', error)
      return []
    }
    
    return data || []
  }
}

// Product operations
export const productService = {
  // Get products with optional filtering
  async getProducts(filters = {}) {
    if (!supabase) return []
    
    let query = supabase
      .from('products')
      .select(`
        *,
        brands (
          name,
          sustainability_score,
          certifications
        )
      `)
    
    // Apply filters
    if (filters.brandId) {
      query = query.eq('brand_id', filters.brandId)
    }
    
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters.aestheticTags && filters.aestheticTags.length > 0) {
      query = query.overlaps('aesthetic_tags', filters.aestheticTags)
    }
    
    if (filters.priceMin) {
      query = query.gte('price', filters.priceMin)
    }
    
    if (filters.priceMax) {
      query = query.lte('price', filters.priceMax)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching products:', error)
      return []
    }
    
    return data || []
  },

  // Get personalized product recommendations
  async getPersonalizedProducts(userId, stylePreferences) {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brands (
          name,
          sustainability_score,
          certifications
        )
      `)
      .overlaps('aesthetic_tags', stylePreferences)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (error) {
      console.error('Error fetching personalized products:', error)
      return []
    }
    
    return data || []
  }
}

// Saved items operations
export const savedItemsService = {
  // Save an item for a user
  async saveItem(userId, productId) {
    if (!supabase) return null
    
    const { data, error } = await supabase
      .from('saved_items')
      .insert({
        saved_item_id: crypto.randomUUID(),
        user_id: userId,
        product_id: productId,
        saved_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error saving item:', error)
      return null
    }
    
    return data
  },

  // Remove a saved item
  async unsaveItem(userId, productId) {
    if (!supabase) return false
    
    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
    
    if (error) {
      console.error('Error unsaving item:', error)
      return false
    }
    
    return true
  },

  // Get user's saved items
  async getSavedItems(userId) {
    if (!supabase) return []
    
    const { data, error } = await supabase
      .from('saved_items')
      .select(`
        *,
        products (
          *,
          brands (
            name,
            sustainability_score
          )
        )
      `)
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching saved items:', error)
      return []
    }
    
    return data || []
  }
}

export default supabase
