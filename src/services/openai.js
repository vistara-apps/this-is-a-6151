import OpenAI from 'openai'
import { config } from '../config/env'

// Initialize OpenAI client
let openai = null

if (config.openai.apiKey && config.openai.apiKey !== 'your-openai-key') {
  openai = new OpenAI({
    apiKey: config.openai.apiKey,
    dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
  })
} else {
  console.warn('OpenAI not configured - using fallback recommendations')
}

// Style recommendation service
export const styleRecommendationService = {
  // Generate personalized style recommendations
  async getStyleRecommendations(userPreferences, products) {
    if (!openai) {
      // Fallback to simple filtering when OpenAI is not available
      return this.getFallbackRecommendations(userPreferences, products)
    }

    try {
      const prompt = this.buildRecommendationPrompt(userPreferences, products)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a sustainable fashion stylist expert. Analyze user preferences and recommend the most suitable eco-friendly clothing items. Focus on style compatibility, sustainability, and personal taste alignment."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })

      const recommendations = this.parseRecommendations(completion.choices[0].message.content, products)
      return recommendations
    } catch (error) {
      console.error('Error getting OpenAI recommendations:', error)
      return this.getFallbackRecommendations(userPreferences, products)
    }
  },

  // Generate style insights for onboarding
  async generateStyleInsights(selectedStyles) {
    if (!openai) {
      return this.getFallbackStyleInsights(selectedStyles)
    }

    try {
      const prompt = `Based on these style preferences: ${selectedStyles.join(', ')}, provide a brief, encouraging insight about the user's style personality and what sustainable fashion options would work best for them. Keep it under 100 words and make it personal and inspiring.`
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a friendly, knowledgeable fashion stylist who specializes in sustainable fashion. Provide encouraging, personalized style insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.8
      })

      return completion.choices[0].message.content.trim()
    } catch (error) {
      console.error('Error generating style insights:', error)
      return this.getFallbackStyleInsights(selectedStyles)
    }
  },

  // Generate product descriptions with sustainability focus
  async enhanceProductDescription(product) {
    if (!openai) {
      return product.description
    }

    try {
      const prompt = `Enhance this sustainable fashion product description to be more engaging and highlight its eco-friendly aspects:
      
Product: ${product.name}
Brand: ${product.brand?.name || 'Unknown'}
Current Description: ${product.description}
Sustainable Materials: ${product.sustainableMaterials?.join(', ') || 'Not specified'}
Style Tags: ${product.aestheticTags?.join(', ') || 'Not specified'}

Make it compelling, eco-conscious, and under 150 words.`
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a sustainable fashion copywriter. Create engaging, eco-conscious product descriptions that highlight both style and sustainability."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })

      return completion.choices[0].message.content.trim()
    } catch (error) {
      console.error('Error enhancing product description:', error)
      return product.description
    }
  },

  // Build recommendation prompt
  buildRecommendationPrompt(userPreferences, products) {
    const productList = products.slice(0, 20).map((product, index) => 
      `${index + 1}. ${product.name} by ${product.brand?.name || 'Unknown'} - ${product.aestheticTags?.join(', ') || 'No tags'} - $${product.price}`
    ).join('\n')

    return `User's style preferences: ${userPreferences.join(', ')}

Available sustainable fashion products:
${productList}

Please recommend the top 5 products that best match the user's style preferences. Consider:
1. Style compatibility with user preferences
2. Sustainability aspects
3. Versatility and wardrobe integration

Format your response as a JSON array with product indices (1-based) and brief reasons:
[{"index": 1, "reason": "Perfect minimalist piece that aligns with your clean aesthetic"}, ...]`
  },

  // Parse OpenAI recommendations
  parseRecommendations(response, products) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\[.*\]/s)
      if (jsonMatch) {
        const recommendations = JSON.parse(jsonMatch[0])
        return recommendations.map(rec => ({
          product: products[rec.index - 1],
          reason: rec.reason,
          confidence: 0.8 // Default confidence score
        })).filter(rec => rec.product) // Filter out invalid indices
      }
    } catch (error) {
      console.error('Error parsing recommendations:', error)
    }

    // Fallback to simple recommendations
    return this.getFallbackRecommendations(userPreferences, products)
  },

  // Fallback recommendations when OpenAI is not available
  getFallbackRecommendations(userPreferences, products) {
    const matchingProducts = products.filter(product => 
      product.aestheticTags?.some(tag => userPreferences.includes(tag))
    )

    // Sort by number of matching tags and sustainability score
    const scored = matchingProducts.map(product => {
      const matchingTags = product.aestheticTags?.filter(tag => userPreferences.includes(tag)) || []
      const sustainabilityScore = product.brand?.sustainability_score || 0
      const score = matchingTags.length * 2 + sustainabilityScore * 0.1
      
      return {
        product,
        reason: `Matches your ${matchingTags.join(' and ')} style preferences`,
        confidence: Math.min(score / 10, 1),
        score
      }
    })

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  },

  // Fallback style insights
  getFallbackStyleInsights(selectedStyles) {
    const styleInsights = {
      minimalist: "Your minimalist aesthetic shows you value quality over quantity and timeless design. Sustainable fashion aligns perfectly with this philosophy!",
      bohemian: "Your bohemian spirit embraces natural materials and flowing designs. Eco-friendly fashion offers beautiful organic fabrics that match your free-spirited style.",
      vintage: "Your love for vintage pieces shows you appreciate lasting quality and unique character. Sustainable fashion shares these values of longevity and craftsmanship.",
      streetwear: "Your streetwear style is all about making a statement. Sustainable streetwear lets you express yourself while supporting ethical fashion practices.",
      formal: "Your professional style demands quality and sophistication. Sustainable formal wear offers the same elegance with the added benefit of ethical production.",
      casual: "Your casual approach to style values comfort and versatility. Sustainable casual wear provides the same ease with eco-friendly materials.",
      artsy: "Your artistic eye appreciates unique designs and creative expression. Sustainable fashion offers innovative materials and creative approaches to design.",
      athletic: "Your active lifestyle needs functional, durable pieces. Sustainable activewear combines performance with environmental responsibility."
    }

    const insights = selectedStyles.map(style => styleInsights[style]).filter(Boolean)
    
    if (insights.length === 0) {
      return "Your unique style preferences show you have a great eye for fashion. Sustainable fashion offers endless possibilities to express your personal aesthetic while caring for our planet."
    }

    return insights[0] // Return the first matching insight
  }
}

export default openai
