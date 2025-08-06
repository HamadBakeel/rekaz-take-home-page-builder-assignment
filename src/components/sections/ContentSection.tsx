import React, { useMemo } from 'react'
import Image from 'next/image'
import { SectionProps } from '@/types'
import ContentEditor from './ContentEditor'

interface ContentSectionProps extends SectionProps {
  content?: string
  imagePosition?: 'left' | 'right' | 'top' | 'bottom'
  backgroundColor?: string
  textColor?: string
  isEditing?: boolean
  onContentChange?: (content: string) => void
}

const ContentSection: React.FC<ContentSectionProps> = React.memo(({
  title = 'Content Section',
  description = 'This is a flexible content section that can display text and images.',
  content,
  imageUrl,
  imagePosition = 'right',
  backgroundColor = '#ffffff',
  textColor = '#000000',
  isEditing = false,
  onContentChange,
}) => {
  // Memoized content processing - sanitize and format rich text
  const processedContent = useMemo(() => {
    if (!content) return description

    // Basic content sanitization and formatting
    try {
      // Remove potentially dangerous HTML tags while preserving basic formatting
      const sanitized = content
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
        .replace(/<object[^>]*>.*?<\/object>/gi, '')
        .replace(/<embed[^>]*>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')

      return sanitized
    } catch (error) {
      console.warn('Content processing error:', error)
      return description
    }
  }, [content, description])

  // Memoized layout classes based on image position
  const layoutClasses = useMemo(() => {
    if (!imageUrl) return 'grid grid-cols-1'
    
    switch (imagePosition) {
      case 'top':
        return 'grid grid-cols-1 gap-8'
      case 'bottom':
        return 'grid grid-cols-1 gap-8'
      case 'left':
        return 'grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
      case 'right':
        return 'grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
    }
  }, [imageUrl, imagePosition])

  // Memoized order classes for responsive layout
  const imageOrderClasses = useMemo(() => {
    if (!imageUrl) return ''
    
    switch (imagePosition) {
      case 'top':
        return 'order-1'
      case 'bottom':
        return 'order-2'
      case 'left':
        return 'order-1 md:order-1'
      case 'right':
        return 'order-2 md:order-2'
      default:
        return 'order-2 md:order-2'
    }
  }, [imageUrl, imagePosition])

  const textOrderClasses = useMemo(() => {
    if (!imageUrl) return 'order-1'
    
    switch (imagePosition) {
      case 'top':
        return 'order-2'
      case 'bottom':
        return 'order-1'
      case 'left':
        return 'order-2 md:order-2'
      case 'right':
        return 'order-1 md:order-1'
      default:
        return 'order-1 md:order-1'
    }
  }, [imageUrl, imagePosition])

  // Memoized section styles
  const sectionStyles = useMemo(() => ({
    backgroundColor,
    color: textColor
  }), [backgroundColor, textColor])

  return (
    <section 
      className="py-12 md:py-16 lg:py-20"
      style={sectionStyles}
    >
      <div className="container mx-auto px-4">
        <div className={layoutClasses}>
          {/* Image */}
          {imageUrl && (
            <div className={`${imageOrderClasses} relative`}>
              <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={title || 'Content image'}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    // Hide image container on error
                    const container = e.currentTarget.closest('div')
                    if (container) {
                      container.style.display = 'none'
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Text Content */}
          <div className={`${textOrderClasses} space-y-6`}>
            {title && (
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                style={{ color: textColor }}
              >
                {title}
              </h2>
            )}

            {isEditing && onContentChange ? (
              <ContentEditor
                content={processedContent}
                onChange={onContentChange}
                textColor={textColor}
              />
            ) : (
              <div 
                className="prose prose-lg max-w-none leading-relaxed"
                style={{ color: textColor }}
                dangerouslySetInnerHTML={{ 
                  __html: processedContent 
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
})

ContentSection.displayName = 'ContentSection'

export default ContentSection