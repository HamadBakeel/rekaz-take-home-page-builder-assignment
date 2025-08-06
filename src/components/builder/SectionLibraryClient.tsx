'use client'

import Image from 'next/image'
import React, { memo, useCallback, useMemo, useState } from 'react'

import { SectionTemplate } from '@/types'
import { useBuilderStore } from '@/stores/builder-store'

import { SectionThumbnail } from './SectionThumbnail'

interface SectionLibraryClientProps {
  templates: SectionTemplate[]
}

interface SectionTemplateCardProps {
  template: SectionTemplate
  onAddSection: (template: SectionTemplate) => void
}

// Memoized template card component to prevent unnecessary re-renders
const SectionTemplateCard = memo<SectionTemplateCardProps>(({ template, onAddSection }) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Memoized click handler to prevent re-renders
  const handleClick = useCallback(() => {
    onAddSection(template)
  }, [template, onAddSection])

  // Memoized image error handler
  const handleImageError = useCallback(() => {
    setImageError(true)
    setIsLoading(false)
  }, [])

  // Memoized image load handler
  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Memoized fallback content using SVG thumbnail
  const fallbackContent = useMemo(() => (
    <SectionThumbnail type={template.id} className="w-full h-full" />
  ), [template.id])

  return (
    <div 
      className="group relative bg-card border border-border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-primary/50 active:scale-[0.98]"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-label={`Add ${template.name} section`}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-20 bg-muted overflow-hidden">
        {!imageError ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <Image
              src={template.thumbnail}
              alt={`${template.name} thumbnail`}
              fill
              className={`object-cover transition-opacity duration-200 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              } group-hover:scale-105`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </>
        ) : (
          fallbackContent
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            Add Section
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h4 className="font-medium text-foreground text-sm mb-1 group-hover:text-primary transition-colors duration-200">
          {template.name}
        </h4>
        {template.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        )}
      </div>

      {/* Click feedback animation */}
      <div className="absolute inset-0 bg-primary/20 opacity-0 group-active:opacity-100 transition-opacity duration-75" />
    </div>
  )
})

SectionTemplateCard.displayName = 'SectionTemplateCard'

export const SectionLibraryClient = memo<SectionLibraryClientProps>(({ templates }) => {
  const addSection = useBuilderStore(state => state.addSection)

  // Memoized add section handler
  const handleAddSection = useCallback((template: SectionTemplate) => {
    try {
      addSection(template)
    } catch (error) {
      // TODO: Add toast notification for error handling
      // For now, we'll silently handle the error to avoid console warnings
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Failed to add section:', error)
      }
    }
  }, [addSection])

  // Memoized templates by category
  const templatesByCategory = useMemo(() => {
    const categories = Array.from(new Set(templates.map(template => template.category)))
    return categories.reduce((acc, category) => {
      acc[category] = templates.filter(template => template.category === category)
      return acc
    }, {} as Record<string, SectionTemplate[]>)
  }, [templates])

  // Memoized category entries
  const categoryEntries = useMemo(() => 
    Object.entries(templatesByCategory), 
    [templatesByCategory]
  )

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl text-muted-foreground">📄</span>
        </div>
        <h3 className="text-sm font-medium text-foreground mb-2">No Templates Available</h3>
        <p className="text-xs text-muted-foreground">
          Section templates will appear here when available.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {categoryEntries.map(([category, categoryTemplates]) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-foreground">
              {category}
            </h3>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {categoryTemplates.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {categoryTemplates.map(template => (
              <SectionTemplateCard
                key={template.id}
                template={template}
                onAddSection={handleAddSection}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
})

SectionLibraryClient.displayName = 'SectionLibraryClient'