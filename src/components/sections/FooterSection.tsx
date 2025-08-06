import React, { useMemo } from 'react'
import { SectionProps } from '@/types'
import { Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Mail, Phone, MapPin } from 'lucide-react'

interface FooterSectionProps extends SectionProps {
  linkGroups?: Array<{
    title: string
    links: Array<{ label: string; url: string }>
  }>
  socialLinks?: Array<{ platform: string; url: string; icon: string }>
  copyright?: string
  backgroundColor?: string
  textColor?: string
}

const FooterSection: React.FC<FooterSectionProps> = React.memo(({
  title = 'Your Company',
  description = 'Building amazing experiences',
  linkGroups = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Privacy Policy', url: '#' },
        { label: 'Terms of Service', url: '#' },
        { label: 'Contact', url: '#' },
      ]
    }
  ],
  socialLinks = [
    { platform: 'Twitter', url: '#', icon: 'twitter' },
    { platform: 'LinkedIn', url: '#', icon: 'linkedin' },
    { platform: 'GitHub', url: '#', icon: 'github' },
  ],
  copyright = '© 2024 Your Company. All rights reserved.',
  backgroundColor = '#1a1a1a',
  textColor = '#ffffff',
}) => {
  // Memoized link processing with validation
  const validLinkGroups = useMemo(() => {
    if (!Array.isArray(linkGroups)) return []
    
    return linkGroups
      .filter(group => 
        group && 
        typeof group === 'object' && 
        typeof group.title === 'string' && 
        group.title.trim() !== '' &&
        Array.isArray(group.links)
      )
      .map(group => ({
        ...group,
        links: group.links.filter(link => 
          link && 
          typeof link === 'object' && 
          typeof link.label === 'string' && 
          link.label.trim() !== '' &&
          typeof link.url === 'string'
        )
      }))
      .filter(group => group.links.length > 0)
  }, [linkGroups])

  // Memoized social links with validation and icon mapping
  const validSocialLinks = useMemo(() => {
    if (!Array.isArray(socialLinks)) return []
    
    const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
      facebook: Facebook,
      twitter: Twitter,
      instagram: Instagram,
      linkedin: Linkedin,
      github: Github,
      youtube: Youtube,
      email: Mail,
      mail: Mail,
      phone: Phone,
      location: MapPin,
      mappin: MapPin
    }
    
    return socialLinks
      .filter(social => 
        social && 
        typeof social === 'object' && 
        typeof social.platform === 'string' && 
        social.platform.trim() !== '' &&
        typeof social.url === 'string'
      )
      .map(social => {
        const iconKey = social.icon?.toLowerCase() || social.platform.toLowerCase()
        const IconComponent = iconMap[iconKey]
        
        return {
          ...social,
          IconComponent,
          isValidUrl: isValidUrl(social.url)
        }
      })
  }, [socialLinks])

  // URL validation helper
  function isValidUrl(url: string): boolean {
    if (!url || url === '#') return true // Allow empty or placeholder URLs
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Memoized responsive grid classes
  const gridClasses = useMemo(() => {
    const totalColumns = 1 + validLinkGroups.length + (validSocialLinks.length > 0 ? 1 : 0)
    
    if (totalColumns <= 2) return 'grid grid-cols-1 md:grid-cols-2 gap-8'
    if (totalColumns === 3) return 'grid grid-cols-1 md:grid-cols-3 gap-8'
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'
  }, [validLinkGroups.length, validSocialLinks.length])

  // Memoized footer styles
  const footerStyles = useMemo(() => ({
    backgroundColor,
    color: textColor
  }), [backgroundColor, textColor])

  // Memoized muted text color
  const mutedTextColor = useMemo(() => {
    // Create a muted version of the text color
    return `${textColor}80`
  }, [textColor])

  return (
    <footer 
      className="py-12 lg:py-16"
      style={footerStyles}
    >
      <div className="container mx-auto px-4">
        <div className={gridClasses}>
          {/* Company Info */}
          <div className="space-y-4">
            <h3 
              className="text-lg md:text-xl font-bold"
              style={{ color: textColor }}
            >
              {title}
            </h3>
            {description && (
              <p 
                className="leading-relaxed"
                style={{ color: mutedTextColor }}
              >
                {description}
              </p>
            )}
          </div>
          
          {/* Link Groups */}
          {validLinkGroups.map((group, groupIndex) => (
            <div key={`${group.title}-${groupIndex}`} className="space-y-4">
              <h4 
                className="font-semibold text-base md:text-lg"
                style={{ color: textColor }}
              >
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link, linkIndex) => (
                  <li key={`${link.label}-${linkIndex}`}>
                    <a
                      href={link.url}
                      className="transition-all duration-200 hover:scale-105 inline-block"
                      style={{ 
                        color: mutedTextColor,
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = textColor
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = mutedTextColor
                      }}
                      onClick={(e) => {
                        // Handle invalid URLs gracefully
                        if (link.url && link.url !== '#' && !isValidUrl(link.url)) {
                          e.preventDefault()
                          console.warn('Invalid footer link URL:', link.url)
                        }
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Social Links */}
          {validSocialLinks.length > 0 && (
            <div className="space-y-4">
              <h4 
                className="font-semibold text-base md:text-lg"
                style={{ color: textColor }}
              >
                Follow Us
              </h4>
              <div className="flex flex-wrap gap-4">
                {validSocialLinks.map((social, index) => {
                  const { IconComponent } = social
                  
                  return (
                    <a
                      key={`${social.platform}-${index}`}
                      href={social.isValidUrl ? social.url : '#'}
                      className="transition-all duration-200 hover:scale-110 active:scale-95 p-2 rounded-lg"
                      style={{ 
                        color: mutedTextColor,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = textColor
                        e.currentTarget.style.backgroundColor = `${textColor}10`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = mutedTextColor
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      title={social.platform}
                      aria-label={`Follow us on ${social.platform}`}
                      onClick={(e) => {
                        if (!social.isValidUrl) {
                          e.preventDefault()
                          console.warn('Invalid social media URL:', social.url)
                        }
                      }}
                    >
                      {IconComponent ? (
                        <IconComponent size={20} />
                      ) : (
                        <span className="text-sm font-medium">
                          {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                        </span>
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Copyright */}
        {copyright && (
          <div 
            className="border-t mt-8 lg:mt-12 pt-8 text-center"
            style={{ borderTopColor: `${textColor}20` }}
          >
            <p 
              className="text-sm md:text-base"
              style={{ color: mutedTextColor }}
            >
              {copyright}
            </p>
          </div>
        )}
      </div>
    </footer>
  )
})

FooterSection.displayName = 'FooterSection'

export default FooterSection