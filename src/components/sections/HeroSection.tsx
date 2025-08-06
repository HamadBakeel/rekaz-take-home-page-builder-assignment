import React, { useMemo } from 'react'
import Image from 'next/image'
import { SectionProps } from '@/types'
import HeroCTAButton from './HeroCTAButton'

interface HeroSectionProps extends SectionProps {
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: string
  overlayOpacity?: number
  backgroundColor?: string
  textColor?: string
}

const HeroSection: React.FC<HeroSectionProps> = React.memo(({
  title = 'Welcome to Our Website',
  subtitle = 'Create amazing experiences with our platform',
  description = 'Build beautiful websites with our drag-and-drop builder',
  ctaText = 'Get Started',
  ctaLink = '#',
  backgroundImage,
  overlayOpacity = 0.5,
  backgroundColor = '#1a1a1a',
  textColor = '#ffffff',
}) => {
  // Memoized style calculations for background and overlay
  const backgroundStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      backgroundColor,
      color: textColor,
      position: 'relative',
      overflow: 'hidden'
    }

    return baseStyles
  }, [backgroundColor, textColor])

  // Memoized overlay styles
  const overlayStyles = useMemo(() => {
    if (!backgroundImage) return {}
    
    return {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: backgroundColor,
      opacity: overlayOpacity,
      zIndex: 1
    }
  }, [backgroundImage, backgroundColor, overlayOpacity])

  // Memoized content styles for z-index layering
  const contentStyles = useMemo(() => ({
    position: 'relative' as const,
    zIndex: 2
  }), [])

  // Memoized responsive text sizes
  const titleClasses = useMemo(() => 
    'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight'
  , [])

  const subtitleClasses = useMemo(() => 
    'text-lg sm:text-xl md:text-2xl mb-6 opacity-90 leading-relaxed'
  , [])

  const descriptionClasses = useMemo(() => 
    'text-base sm:text-lg mb-8 opacity-80 max-w-2xl mx-auto leading-relaxed'
  , [])

  return (
    <section 
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 min-h-[60vh] flex items-center"
      style={backgroundStyles}
    >
      {/* Background Image */}
      {backgroundImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt="Hero background"
              fill
              className="object-cover"
              priority
              sizes="100vw"
              onError={(e) => {
                // Hide image on error and show fallback background
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          {/* Overlay */}
          <div style={overlayStyles} />
        </>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 text-center" style={contentStyles}>
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 
            className={titleClasses}
            style={{ color: textColor }}
          >
            {title || 'Welcome to Our Website'}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <h2 
              className={subtitleClasses}
              style={{ color: textColor }}
            >
              {subtitle}
            </h2>
          )}

          {/* Description */}
          {description && (
            <p 
              className={descriptionClasses}
              style={{ color: textColor }}
            >
              {description}
            </p>
          )}

          {/* CTA Button */}
          {ctaText && (
            <HeroCTAButton
              text={ctaText}
              link={ctaLink}
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          )}
        </div>
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

export default HeroSection