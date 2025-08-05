import React from 'react'
import { SectionProps } from '@/types'
import { Button } from '@/components/ui/button'

interface HeroSectionProps extends SectionProps {
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'Welcome to Our Website',
  subtitle = 'Create amazing experiences with our platform',
  description = 'Build beautiful websites with our drag-and-drop builder',
  ctaText = 'Get Started',
  ctaLink = '#',
  backgroundColor = 'bg-primary',
  textColor = 'text-primary-foreground',
}) => {
  return (
    <section className={`py-20 ${backgroundColor} ${textColor}`}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
        {subtitle && (
          <h2 className="text-xl md:text-2xl mb-6 opacity-90">{subtitle}</h2>
        )}
        {description && (
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">{description}</p>
        )}
        <Button size="lg" variant="secondary">
          {ctaText}
        </Button>
      </div>
    </section>
  )
}

export default HeroSection