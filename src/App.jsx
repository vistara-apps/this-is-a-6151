import React, { useState, useEffect } from 'react'
import { AppShell } from './components/AppShell'
import { OnboardingFlow } from './components/OnboardingFlow'
import { DiscoveryFeed } from './components/DiscoveryFeed'
import { BrandsDirectory } from './components/BrandsDirectory'
import { SavedItems } from './components/SavedItems'
import { UserContext } from './contexts/UserContext'

function App() {
  const [currentPage, setCurrentPage] = useState('onboarding')
  const [user, setUser] = useState({
    userId: crypto.randomUUID(),
    username: '',
    email: '',
    stylePreferences: [],
    savedItems: [],
    onboardingComplete: false
  })

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ecostyle-user')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      if (userData.onboardingComplete) {
        setCurrentPage('feed')
      }
    }
  }, [])

  // Save user data to localStorage whenever user state changes
  useEffect(() => {
    localStorage.setItem('ecostyle-user', JSON.stringify(user))
  }, [user])

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const completeOnboarding = (stylePreferences, username) => {
    updateUser({
      stylePreferences,
      username: username || 'Style Explorer',
      onboardingComplete: true
    })
    setCurrentPage('feed')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'onboarding':
        return <OnboardingFlow onComplete={completeOnboarding} />
      case 'feed':
        return <DiscoveryFeed user={user} updateUser={updateUser} />
      case 'brands':
        return <BrandsDirectory user={user} />
      case 'saved':
        return <SavedItems user={user} updateUser={updateUser} />
      default:
        return <DiscoveryFeed user={user} updateUser={updateUser} />
    }
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <div className="min-h-screen bg-bg">
        {user.onboardingComplete ? (
          <AppShell 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            user={user}
          >
            {renderPage()}
          </AppShell>
        ) : (
          renderPage()
        )}
      </div>
    </UserContext.Provider>
  )
}

export default App