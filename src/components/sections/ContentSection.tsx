import React from 'react'
import { SectionProps } from '@/types'

interface ContentSectionProps extends SectionProps {
  layout?: 'text-only' | 'text-image' | 'image-text'
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title = 'Content Section',
  description = 'This is a flexible content section that can display text and images.',
  imageUrl,
  layout = 'text-only',
}) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className={`grid gap-8 ${layout !== 'text-only' ? 'md:grid-cols-2' : ''} items-center`}>
          {(layout === 'image-text' && imageUrl) && (
            <div className="order-1 md:order-1">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className={layout === 'image-text' ? 'order-2 md:order-2' : 'order-1'}>
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
          </div>
          
          {(layout === 'text-image' && imageUrl) && (
            <div className="order-2 md:order-2">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContentSection