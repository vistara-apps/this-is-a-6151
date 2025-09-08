# EcoStyle Finder

A comprehensive sustainable fashion discovery platform that helps users find eco-friendly clothing curated to their personal style preferences. Built with React, Vite, and integrated with AI-powered recommendations.

## 🌟 Features

### Core Features
- **Personalized Style Curation**: AI-powered recommendations based on user style preferences
- **Verified Sustainable Brand Directory**: Curated database of eco-friendly fashion brands
- **Style Inspiration Feed**: Visually engaging feed of sustainable outfits and items
- **Smart Filtering**: Advanced filtering by category, price, sustainability criteria
- **Save & Organize**: Personal collection of favorite sustainable fashion items

### Premium Features
- **Unlimited AI Recommendations**: Get unlimited personalized style suggestions
- **Advanced Analytics**: Detailed insights into your style preferences and sustainability impact
- **Early Brand Access**: First access to new sustainable brands and collections
- **Premium Support**: Priority customer support

### Technical Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Data**: Integration with Supabase for live data updates
- **AI Integration**: OpenAI-powered style analysis and recommendations
- **Subscription Management**: Stripe-powered premium subscriptions
- **Performance Optimized**: Caching, lazy loading, and optimized queries

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ecostyle-finder
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your actual API keys:
```env
# Required for full functionality
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional - enables AI recommendations
VITE_OPENAI_API_KEY=your-openai-api-key

# Optional - enables subscription features
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:5173](http://localhost:5173)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: OpenAI GPT-3.5 for style recommendations
- **Payments**: Stripe for subscription management
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ProductCard.jsx     # Product display component
│   ├── StyleSelector.jsx   # Style preference selector
│   ├── FilterBar.jsx       # Product filtering
│   ├── RecommendationsSection.jsx  # AI recommendations
│   └── SubscriptionModal.jsx       # Premium upgrade modal
├── services/           # API and business logic
│   ├── supabase.js        # Database operations
│   ├── openai.js          # AI recommendations
│   ├── stripe.js          # Subscription management
│   └── dataService.js     # Unified data layer
├── data/              # Mock data and constants
│   └── mockData.js        # Sample products and brands
├── config/            # Configuration
│   └── env.js             # Environment setup
└── styles/            # Global styles
    └── globals.css        # Tailwind and custom styles
```

## 🎨 Design System

The application uses a comprehensive design system built with Tailwind CSS:

### Colors
- **Primary**: `hsl(170 55% 35%)` - Sustainable green
- **Accent**: `hsl(45 80% 50%)` - Warm accent
- **Background**: `hsl(220 30% 98%)` - Light neutral
- **Surface**: `hsl(0 0% 100%)` - Pure white
- **Text Primary**: `hsl(220 20% 20%)` - Dark text
- **Text Secondary**: `hsl(220 20% 40%)` - Muted text

### Typography
- **Display**: Large headings (text-5xl font-bold)
- **H1**: Main headings (text-4xl font-semibold)
- **H2**: Section headings (text-2xl font-semibold)
- **Body**: Regular text (text-base font-normal)
- **Label**: Form labels (text-sm font-medium)

## 🔧 API Integration

### Supabase Database Schema

```sql
-- Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  username TEXT,
  style_preferences JSONB,
  saved_items JSONB,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Brands table
CREATE TABLE brands (
  brand_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  sustainability_score FLOAT,
  certifications TEXT[],
  aesthetic_tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(brand_id),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  product_url TEXT,
  price DECIMAL,
  sustainable_materials TEXT[],
  aesthetic_tags TEXT[],
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Saved items table
CREATE TABLE saved_items (
  saved_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  product_id UUID REFERENCES products(product_id),
  saved_at TIMESTAMP DEFAULT NOW()
);
```

### OpenAI Integration
The app uses OpenAI's GPT-3.5 model for:
- Generating personalized style recommendations
- Creating style insights based on user preferences
- Enhancing product descriptions with sustainability focus

### Stripe Integration
Subscription management includes:
- Free tier: Limited recommendations and saved items
- Premium tier ($7/month): Unlimited access and exclusive features

## 🚀 Deployment

### Environment Setup
1. Set up Supabase project and configure database
2. Get OpenAI API key (optional but recommended)
3. Set up Stripe account for subscriptions (optional)
4. Configure environment variables

### Build for Production
```bash
npm run build
```

### Deploy
The built files in `dist/` can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## 🧪 Development

### Mock Data Mode
The app works without API keys using mock data:
- Sample products and brands are provided
- Local storage simulates user data
- All features work in demo mode

### Adding New Features
1. Create components in `src/components/`
2. Add business logic to `src/services/`
3. Update data models in `src/services/supabase.js`
4. Test with both real APIs and mock data

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use Tailwind for styling
- Include proper error handling
- Add loading states for async operations

## 📱 Features Walkthrough

### User Onboarding
1. **Style Quiz**: Users select aesthetic preferences
2. **AI Analysis**: System generates style insights
3. **Personalized Feed**: Curated products appear

### Product Discovery
1. **AI Recommendations**: Personalized suggestions with explanations
2. **Filter & Search**: Advanced filtering options
3. **Save Items**: Build personal collections
4. **Brand Exploration**: Discover sustainable brands

### Subscription Features
1. **Usage Tracking**: Monitor recommendation and save limits
2. **Upgrade Prompts**: Contextual premium feature promotion
3. **Stripe Integration**: Secure payment processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation above
- Review the code comments
- Open an issue on GitHub

---

Built with ❤️ for sustainable fashion and a better planet 🌍
