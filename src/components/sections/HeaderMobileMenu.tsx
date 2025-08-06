'use client'

import React, { useState, useCallback } from 'react'
import { Menu, X } from 'lucide-react'

interface HeaderMobileMenuProps {
  navigationItems: Array<{ label: string; url: string }>
  textColor: string
}

const HeaderMobileMenu: React.FC<HeaderMobileMenuProps> = React.memo(({
  navigationItems,
  textColor
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Callback for mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  // Close mobile menu when clicking on navigation links
  const handleNavClick = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ 
          color: textColor,
          backgroundColor: isMobileMenuOpen ? `${textColor}10` : 'transparent'
        }}
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X size={24} />
        ) : (
          <Menu size={24} />
        )}
      </button>

      {/* Mobile Navigation Menu */}
      <div
        className={`absolute top-full left-0 right-0 md:hidden overflow-hidden transition-all duration-300 ease-in-out z-50 ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
        style={{ backgroundColor: 'inherit' }}
      >
        <nav className="flex flex-col space-y-2 p-4 border-t" style={{ borderTopColor: `${textColor}20` }}>
          {navigationItems.map((item, index) => (
            <a
              key={`mobile-${item.label}-${index}`}
              href={item.url}
              onClick={handleNavClick}
              className="px-4 py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                color: textColor,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${textColor}10`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
})

HeaderMobileMenu.displayName = 'HeaderMobileMenu'

export default HeaderMobileMenu