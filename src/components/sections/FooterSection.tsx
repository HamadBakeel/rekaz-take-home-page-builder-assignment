import React from 'react'
import { SectionProps } from '@/types'

interface FooterSectionProps extends SectionProps {
  linkGroups?: Array<{
    title: string
    links: Array<{ label: string; url: string }>
  }>
  socialLinks?: Array<{ platform: string; url: string; icon: string }>
  copyright?: string
}

const FooterSection: React.FC<FooterSectionProps> = ({
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
}) => {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          {linkGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h4 className="font-semibold mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title={social.platform}
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection