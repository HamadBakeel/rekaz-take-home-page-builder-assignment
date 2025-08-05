import React from 'react'

import { SectionTemplate } from '@/types'

// Mock section templates - this would typically come from a database or API
const availableSections: SectionTemplate[] = [
  {
    id: 'header',
    name: 'Header',
    category: 'Navigation',
    defaultProps: {
      title: 'Your Website',
      logoUrl: '',
      navigationItems: ['Home', 'About', 'Services', 'Contact']
    },
    component: 'HeaderSection',
    thumbnail: '/thumbnails/header.png'
  },
  {
    id: 'hero',
    name: 'Hero Banner',
    category: 'Content',
    defaultProps: {
      title: 'Welcome to Our Website',
      subtitle: 'Create amazing experiences with our platform',
      ctaText: 'Get Started',
      backgroundImage: ''
    },
    component: 'HeroSection',
    thumbnail: '/thumbnails/hero.png'
  },
  {
    id: 'content',
    name: 'Content Block',
    category: 'Content',
    defaultProps: {
      title: 'About Us',
      content: 'Tell your story here...',
      imageUrl: '',
      imagePosition: 'left'
    },
    component: 'ContentSection',
    thumbnail: '/thumbnails/content.png'
  },
  {
    id: 'footer',
    name: 'Footer',
    category: 'Navigation',
    defaultProps: {
      companyName: 'Your Company',
      links: ['Privacy', 'Terms', 'Contact'],
      socialMedia: [],
      copyright: '© 2024 Your Company. All rights reserved.'
    },
    component: 'FooterSection',
    thumbnail: '/thumbnails/footer.png'
  }
]

export function SectionLibraryServer() {
  return (
    <div className="space-y-4">
      {/* Categories */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Navigation</h3>
          <div className="space-y-2">
            {availableSections
              .filter(section => section.category === 'Navigation')
              .map(section => (
                <SectionTemplateCard key={section.id} template={section} />
              ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Content</h3>
          <div className="space-y-2">
            {availableSections
              .filter(section => section.category === 'Content')
              .map(section => (
                <SectionTemplateCard key={section.id} template={section} />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionTemplateCard({ template }: { template: SectionTemplate }) {
  return (
    <div className="border border-border rounded-lg p-3 hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="flex items-center space-x-3">
        {/* Placeholder thumbnail */}
        <div className="w-12 h-8 bg-muted rounded border border-border flex items-center justify-center">
          <span className="text-xs text-muted-foreground">{template.name.charAt(0)}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-foreground truncate">{template.name}</h4>
          <p className="text-xs text-muted-foreground">Click to add</p>
        </div>
      </div>
    </div>
  )
}