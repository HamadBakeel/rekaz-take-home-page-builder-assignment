import { SectionTemplate } from '@/types'

export const sectionTemplates: SectionTemplate[] = [
  {
    id: 'header',
    name: 'Header',
    category: 'Navigation',
    description: 'Navigation header with logo and menu items',
    defaultProps: {
      title: 'Your Website',
      logoUrl: '',
      navigationItems: [
        { label: 'Home', url: '#' },
        { label: 'About', url: '#about' },
        { label: 'Services', url: '#services' },
        { label: 'Contact', url: '#contact' }
      ],
      backgroundColor: '#ffffff',
      textColor: '#000000'
    },
    component: 'HeaderSection',
    thumbnail: '/thumbnails/header.svg'
  },
  {
    id: 'hero',
    name: 'Hero Banner',
    category: 'Content',
    description: 'Large banner with title, subtitle, and call-to-action',
    defaultProps: {
      title: 'Welcome to Our Website',
      description: 'Create amazing experiences with our platform',
      buttonText: 'Get Started',
      buttonUrl: '#',
      imageUrl: '',
      backgroundColor: '#f8fafc',
      textColor: '#1e293b'
    },
    component: 'HeroSection',
    thumbnail: '/thumbnails/hero.svg'
  },
  {
    id: 'content',
    name: 'Content Block',
    category: 'Content',
    description: 'Flexible content section with text and optional image',
    defaultProps: {
      title: 'About Us',
      content: 'Tell your story here. Add compelling content that engages your visitors and communicates your value proposition.',
      imageUrl: '',
      imagePosition: 'left',
      backgroundColor: '#ffffff',
      textColor: '#374151'
    },
    component: 'ContentSection',
    thumbnail: '/thumbnails/content.svg'
  },
  {
    id: 'footer',
    name: 'Footer',
    category: 'Navigation',
    description: 'Footer with links, social media, and copyright',
    defaultProps: {
      linkGroups: [
        {
          title: 'Company',
          links: [
            { label: 'About', url: '#about' },
            { label: 'Careers', url: '#careers' },
            { label: 'Contact', url: '#contact' }
          ]
        },
        {
          title: 'Support',
          links: [
            { label: 'Help Center', url: '#help' },
            { label: 'Privacy Policy', url: '#privacy' },
            { label: 'Terms of Service', url: '#terms' }
          ]
        }
      ],
      socialLinks: [
        { platform: 'Twitter', url: '#', icon: 'twitter' },
        { platform: 'Facebook', url: '#', icon: 'facebook' },
        { platform: 'LinkedIn', url: '#', icon: 'linkedin' }
      ],
      copyright: '© 2024 Your Company. All rights reserved.',
      backgroundColor: '#1f2937',
      textColor: '#f9fafb'
    },
    component: 'FooterSection',
    thumbnail: '/thumbnails/footer.svg'
  }
]

export const getSectionTemplatesByCategory = () => {
  const categories = Array.from(new Set(sectionTemplates.map(template => template.category)))
  return categories.reduce((acc, category) => {
    acc[category] = sectionTemplates.filter(template => template.category === category)
    return acc
  }, {} as Record<string, SectionTemplate[]>)
}

export const getSectionTemplateById = (id: string): SectionTemplate | undefined => {
  return sectionTemplates.find(template => template.id === id)
}