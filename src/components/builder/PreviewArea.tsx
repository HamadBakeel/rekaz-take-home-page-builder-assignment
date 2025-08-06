'use client'

import React, { useMemo, useCallback } from 'react'

import { HeaderSection, HeroSection, ContentSection, FooterSection } from '@/components/sections'
import { Section } from '@/types'

interface PreviewAreaProps {
  sections: Section[]
  selectedSectionId: string | null
  onSectionSelect: (id: string) => void
  onSectionDelete: (id: string) => void
}

// Error boundary component for individual sections
class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode; sectionId: string; sectionType: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; sectionId: string; sectionType: string }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for debugging - this is acceptable for error boundaries
    // eslint-disable-next-line no-console
    console.error(`Error rendering section ${this.props.sectionId} (${this.props.sectionType}):`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="font-medium">Section Render Error</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Failed to render {this.props.sectionType} section
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-xs px-2 py-1 bg-destructive/10 hover:bg-destructive/20 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Memoized section renderer component with optimized re-render prevention
const SectionRenderer = React.memo<{
  section: Section
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}>(({ section, isSelected, onSelect, onDelete }) => {
  // Enhanced click handler with visual feedback
  const handleSectionClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Add ripple effect for better feedback
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const ripple = document.createElement('div')
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(var(--primary), 0.1);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `
    
    target.appendChild(ripple)
    
    // Clean up ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple)
      }
    }, 600)
    
    onSelect(section.id)
  }, [section.id, onSelect])

  // Enhanced delete handler with confirmation feedback
  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Add visual feedback for delete action
    const button = e.currentTarget as HTMLElement
    button.style.transform = 'scale(0.9)'
    
    setTimeout(() => {
      button.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)'
    }, 100)
    
    onDelete(section.id)
  }, [section.id, onDelete, isSelected])

  // Keyboard event handlers
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(section.id)
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      onDelete(section.id)
    }
  }, [section.id, onSelect, onDelete])

  // Memoized section component selection
  const SectionComponent = useMemo(() => {
    switch (section.type) {
      case 'header':
        return HeaderSection
      case 'hero':
        return HeroSection
      case 'content':
        return ContentSection
      case 'footer':
        return FooterSection
      default:
        return null
    }
  }, [section.type])

  // Memoized container classes for enhanced selection highlighting
  const containerClasses = useMemo(() => {
    const baseClasses = 'relative group cursor-pointer rounded-lg overflow-hidden outline-none'
    const transitionClasses = 'transition-all duration-300 ease-out'
    const selectionClasses = isSelected 
      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg transform scale-[1.02]' 
      : 'hover:ring-1 hover:ring-primary/50 hover:ring-offset-1 hover:ring-offset-background hover:shadow-md hover:transform hover:scale-[1.01]'
    const focusClasses = 'focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
    
    return `${baseClasses} ${transitionClasses} ${selectionClasses} ${focusClasses}`
  }, [isSelected])

  // Memoized overlay classes for enhanced selection feedback
  const overlayClasses = useMemo(() => {
    const baseClasses = 'absolute inset-0 pointer-events-none'
    const transitionClasses = 'transition-all duration-300 ease-out'
    const selectionOverlay = isSelected 
      ? 'bg-primary/8 border-2 border-primary opacity-100' 
      : 'bg-primary/0 border-2 border-transparent group-hover:bg-primary/3 group-hover:border-primary/20 opacity-0 group-hover:opacity-100'
    
    return `${baseClasses} ${transitionClasses} ${selectionOverlay}`
  }, [isSelected])

  // Memoized selection indicator for better visual feedback
  const selectionIndicatorClasses = useMemo(() => {
    const baseClasses = 'absolute top-2 left-2 z-10 w-3 h-3 rounded-full'
    const transitionClasses = 'transition-all duration-200 ease-out'
    const indicatorClasses = isSelected 
      ? 'bg-primary shadow-lg scale-100 opacity-100' 
      : 'bg-primary/50 scale-75 opacity-0 group-hover:opacity-60 group-hover:scale-90'
    
    return `${baseClasses} ${transitionClasses} ${indicatorClasses}`
  }, [isSelected])

  // Memoized delete button positioning and styling
  const deleteButtonStyles = useMemo(() => {
    return {
      position: 'absolute' as const,
      top: '8px',
      right: '8px',
      zIndex: 10,
      transform: isSelected ? 'scale(1)' : 'scale(0.9)',
      opacity: isSelected ? 1 : 0,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }, [isSelected])

  // Memoized delete button classes
  const deleteButtonClasses = useMemo(() => {
    return 'p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 transition-all duration-200'
  }, [])

  if (!SectionComponent) {
    return (
      <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
        <div className="flex items-center gap-2 text-destructive">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="font-medium">Unknown Section Type: {section.type}</span>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={containerClasses} 
      onClick={handleSectionClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select ${section.type} section`}
      aria-pressed={isSelected}
    >
      {/* Selection overlay */}
      <div className={overlayClasses} />
      
      {/* Selection indicator */}
      <div className={selectionIndicatorClasses} />
      
      {/* Delete button with enhanced positioning and animations */}
      <button
        className={deleteButtonClasses}
        style={deleteButtonStyles}
        onClick={handleDeleteClick}
        title="Delete section"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)'
          e.currentTarget.style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = isSelected ? 'scale(1)' : 'scale(0.9)'
          e.currentTarget.style.opacity = isSelected ? '1' : '0'
        }}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Section content */}
      <SectionErrorBoundary sectionId={section.id} sectionType={section.type}>
        <SectionComponent {...section.props} />
      </SectionErrorBoundary>
    </div>
  )
})

SectionRenderer.displayName = 'SectionRenderer'

// Custom comparison function to prevent unnecessary re-renders
const arePropsEqual = (
  prevProps: { section: Section; isSelected: boolean; onSelect: (id: string) => void; onDelete: (id: string) => void },
  nextProps: { section: Section; isSelected: boolean; onSelect: (id: string) => void; onDelete: (id: string) => void }
) => {
  // Only re-render if section data, selection state, or handlers change
  return (
    prevProps.section.id === nextProps.section.id &&
    prevProps.section.updatedAt.getTime() === nextProps.section.updatedAt.getTime() &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.onSelect === nextProps.onSelect &&
    prevProps.onDelete === nextProps.onDelete
  )
}

// Apply custom comparison to SectionRenderer
const OptimizedSectionRenderer = React.memo(SectionRenderer, arePropsEqual)

const PreviewArea: React.FC<PreviewAreaProps> = ({
  sections,
  selectedSectionId,
  onSectionSelect,
  onSectionDelete,
}) => {
  // Add ripple animation styles
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  // Memoized ordered sections to prevent unnecessary re-sorting
  const orderedSections = useMemo(() => {
    return [...sections].sort((a, b) => a.order - b.order)
  }, [sections])

  // Memoized empty state component
  const EmptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
        <svg 
          className="w-8 h-8 text-muted-foreground" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-foreground">No sections added yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Add sections from the library to start building your website. Click on any section template to add it to your page.
        </p>
      </div>
    </div>
  ), [])

  // Memoized container classes for responsive scaling
  const containerClasses = useMemo(() => {
    return 'w-full min-h-[400px] bg-background border rounded-lg overflow-hidden'
  }, [])

  // Memoized preview content classes
  const previewContentClasses = useMemo(() => {
    return 'w-full space-y-0' // No spacing between sections for seamless preview
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Preview</h3>
        {sections.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {sections.length} section{sections.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      
      <div className={containerClasses}>
        {orderedSections.length === 0 ? (
          EmptyState
        ) : (
          <div className={previewContentClasses}>
            {orderedSections.map((section) => (
              <OptimizedSectionRenderer
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
                onSelect={onSectionSelect}
                onDelete={onSectionDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviewArea