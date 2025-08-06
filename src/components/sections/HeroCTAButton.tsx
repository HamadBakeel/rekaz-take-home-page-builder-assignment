'use client'

import React, { useCallback, useMemo } from 'react'

interface HeroCTAButtonProps {
  text: string
  link?: string
  textColor: string
  backgroundColor: string
}

const HeroCTAButton: React.FC<HeroCTAButtonProps> = React.memo(({
  text,
  link = '#',
  textColor,
  backgroundColor
}) => {
  // Memoized button styles
  const buttonStyles = useMemo(() => {
    // Create contrasting button color
    const isLightBackground = backgroundColor === '#ffffff' || backgroundColor.includes('rgb(255') || backgroundColor.includes('hsl(0, 0%, 100%)')
    const buttonBg = isLightBackground ? '#000000' : '#ffffff'
    const buttonText = isLightBackground ? '#ffffff' : '#000000'
    
    return {
      backgroundColor: buttonBg,
      color: buttonText,
      border: `2px solid ${buttonBg}`,
      transition: 'all 0.3s ease',
      transform: 'translateY(0px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    }
  }, [backgroundColor])

  // Callback for hover effects
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget
    target.style.transform = 'translateY(-2px) scale(1.05)'
    target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)'
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget
    target.style.transform = 'translateY(0px) scale(1)'
    target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
  }, [])

  // Callback for click interactions
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget
    target.style.transform = 'translateY(1px) scale(0.98)'
    
    // Reset after animation
    setTimeout(() => {
      target.style.transform = 'translateY(-2px) scale(1.05)'
    }, 150)

    // Handle invalid URLs gracefully
    if (link && link !== '#') {
      try {
        new URL(link)
      } catch {
        e.preventDefault()
        console.warn('Invalid CTA link provided:', link)
      }
    }
  }, [link])

  return (
    <a
      href={link}
      className="inline-block px-8 py-4 text-lg font-semibold rounded-lg cursor-pointer select-none"
      style={buttonStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label={`${text} - Call to action button`}
    >
      {text}
    </a>
  )
})

HeroCTAButton.displayName = 'HeroCTAButton'

export default HeroCTAButton