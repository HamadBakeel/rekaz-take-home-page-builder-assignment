import React from 'react'
import { SectionProps } from '@/types'

interface HeaderSectionProps extends SectionProps {
  logo?: string
  navigationItems?: Array<{ label: string; href: string }>
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  title = 'Your Logo',
  navigationItems = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Services', href: '#' },
    { label: 'Contact', href: '#' },
  ],
}) => {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">{title}</div>
          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default HeaderSection