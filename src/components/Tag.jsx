import React from 'react'

export function Tag({ children, variant = 'primary', size = 'base' }) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variantClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-gray-100 text-text-secondary',
    outline: 'border border-gray-300 text-text-secondary bg-transparent'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    base: 'px-3 py-1 text-sm'
  }
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </span>
  )
}