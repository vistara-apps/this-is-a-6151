import React, { useState } from 'react'
import { ChevronRight, Sparkles } from 'lucide-react'

const styleOptions = [
  { id: 'minimalist', label: 'Minimalist', description: 'Clean lines, neutral colors' },
  { id: 'bohemian', label: 'Bohemian', description: 'Free-spirited, flowing fabrics' },
  { id: 'vintage', label: 'Vintage', description: 'Retro-inspired, timeless pieces' },
  { id: 'streetwear', label: 'Streetwear', description: 'Urban, casual, trendy' },
  { id: 'formal', label: 'Formal', description: 'Professional, structured' },
  { id: 'casual', label: 'Casual', description: 'Comfortable, everyday wear' },
  { id: 'artsy', label: 'Artsy', description: 'Creative, unique patterns' },
  { id: 'athletic', label: 'Athletic', description: 'Sporty, functional' }
]

export function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0)
  const [username, setUsername] = useState('')
  const [selectedStyles, setSelectedStyles] = useState([])

  const toggleStyle = (styleId) => {
    setSelectedStyles(prev => 
      prev.includes(styleId)
        ? prev.filter(id => id !== styleId)
        : [...prev, styleId]
    )
  }

  const handleComplete = () => {
    onComplete(selectedStyles, username)
  }

  if (step === 0) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center text-white animate-fade-in">
          <div className="mb-8">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/80" />
            <h1 className="text-4xl font-bold mb-4">EcoStyle Finder</h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Discover sustainable fashion that truly matches your style.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setStep(1)}
              className="w-full bg-white text-primary font-semibold py-4 px-6 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => onComplete([], '')}
              className="w-full text-white/80 font-medium py-3 px-6 hover:text-white transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 1) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-slide-up">
          <div className="glass-effect rounded-lg p-8 text-white">
            <h2 className="text-2xl font-semibold mb-6 text-center">What should we call you?</h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name (optional)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              
              <button
                onClick={() => setStep(2)}
                className="w-full bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-slide-up">
        <div className="glass-effect rounded-lg p-8 text-white">
          <h2 className="text-2xl font-semibold mb-2 text-center">Choose Your Style</h2>
          <p className="text-white/80 text-center mb-8">Select the aesthetics that speak to you</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {styleOptions.map((style) => (
              <button
                key={style.id}
                onClick={() => toggleStyle(style.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedStyles.includes(style.id)
                    ? 'border-white bg-white/20'
                    : 'border-white/30 hover:border-white/50 hover:bg-white/10'
                }`}
              >
                <h3 className="font-semibold mb-1">{style.label}</h3>
                <p className="text-sm text-white/70">{style.description}</p>
              </button>
            ))}
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-white/20 text-white font-medium py-3 px-6 rounded-lg hover:bg-white/30 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={selectedStyles.length === 0}
              className="flex-1 bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}