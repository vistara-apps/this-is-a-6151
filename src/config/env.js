// Environment configuration
export const config = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
  },
  
  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'your-openai-key'
  },
  
  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your-key'
  },
  
  // App Configuration
  app: {
    name: 'EcoStyle Finder',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development'
  }
}

// Validation function to check if required env vars are present
export const validateConfig = () => {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName])
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing)
    console.warn('The app will use mock data until these are configured.')
  }
  
  return missing.length === 0
}
