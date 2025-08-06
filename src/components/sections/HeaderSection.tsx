import React, { useMemo } from 'react'
import Image from 'next/image'
import { SectionProps } from '@/types'
import HeaderMobileMenu from './HeaderMobileMenu'

interface HeaderSectionProps extends SectionProps {
  logoUrl?: string
  navigationItems?: Array<{ label: string; url: string }>
  backgroundColor?: string
  textColor?: string
}

const HeaderSection: React.FC<HeaderSectionProps> = React.memo(({
  title = 'Your Logo',
  logoUrl,
  navigationItems = [
    { label: 'Home', url: '#' },
    { label: 'About', url: '#' },
    { label: 'Services', url: '#' },
    { label: 'Contact', url: '#' },
  ],
  backgroundColor = '#ffffff',
  textColor = '#000000',
}) => {
  // Memoized navigation items with validation
  const validNavigationItems = useMemo(() => {
    if (!Array.isArray(navigationItems)) return []
    
    return navigationItems.filter(item => 
      item && 
      typeof item === 'object' && 
      typeof item.label === 'string' && 
      item.label.trim() !== '' &&
      typeof item.url === 'string'
    )
  }, [navigationItems])

  return (
    <header 
      className="relative border-b transition-colors duration-200"
      style={{ 
        backgroundColor,
        color: textColor,
        borderBottomColor: `${textColor}20`
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title Section */}
          <div className="flex items-center space-x-3">
            {logoUrl && (
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image
                  src={logoUrl}
                  alt={`${title} logo`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 32px, 40px"
                  onError={(e) => {
                    // Hide image on error
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            <div 
              className="text-lg md:text-xl font-bold truncate max-w-[200px] md:max-w-none"
              style={{ color: textColor }}
            >
              {title}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {validNavigationItems.map((item, index) => (
              <a
                key={`${item.label}-${index}`}
                href={item.url}
                className="relative px-2 py-1 rounded transition-all duration-200 hover:scale-105 hover:shadow-sm hover:bg-opacity-10"
                style={{ 
                  color: textColor
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu - Client Component */}
          {validNavigationItems.length > 0 && (
            <HeaderMobileMenu 
              navigationItems={validNavigationItems}
              textColor={textColor}
            />
          )}
        </div>
      </div>
    </header>
  )
})

HeaderSection.displayName = 'HeaderSection'

export default HeaderSection