'use client'

import React, { useMemo, useCallback } from 'react'

import { HeaderSection, HeroSection, ContentSection, FooterSection } from '@/components/sections'
import { Section } from '@/types'
import DraggableSection from './DraggableSection'
import DropZone from './DropZone'

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
  index: number
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}>(({ section, index, isSelected, onSelect, onDelete }) => {


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
    <DraggableSection
      section={section}
      index={index}
      isSelected={isSelected}
      onSelect={onSelect}
      onDelete={onDelete}
    >
      <SectionErrorBoundary sectionId={section.id} sectionType={section.type}>
        <SectionComponent {...section.props} />
      </SectionErrorBoundary>
    </DraggableSection>
  )
})

SectionRenderer.displayName = 'SectionRenderer'

// Custom comparison function to prevent unnecessary re-renders
const arePropsEqual = (
  prevProps: { section: Section; index: number; isSelected: boolean; onSelect: (id: string) => void; onDelete: (id: string) => void },
  nextProps: { section: Section; index: number; isSelected: boolean; onSelect: (id: string) => void; onDelete: (id: string) => void }
) => {
  // Only re-render if section data, selection state, index, or handlers change
  return (
    prevProps.section.id === nextProps.section.id &&
    prevProps.section.updatedAt.getTime() === nextProps.section.updatedAt.getTime() &&
    prevProps.index === nextProps.index &&
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
  const [isReordering, setIsReordering] = React.useState(false)

  // Track when sections are being reordered
  React.useEffect(() => {
    setIsReordering(true)
    const timer = setTimeout(() => setIsReordering(false), 300)
    return () => clearTimeout(timer)
  }, [sections.map(s => s.order).join(',')])
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
    return `w-full space-y-0 transition-all duration-300 ${isReordering ? 'opacity-95' : 'opacity-100'}` // No spacing between sections for seamless preview
  }, [isReordering])

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
            {/* Drop zone at the top */}
            <DropZone 
              index={0} 
              onDrop={(dragIndex, dropIndex) => {
                // Handle drop at the beginning
                if (dragIndex !== dropIndex) {
                  // This will be handled by the DraggableSection's hover logic
                }
              }} 
            />
            
            {orderedSections.map((section, index) => (
              <React.Fragment key={section.id}>
                <OptimizedSectionRenderer
                  section={section}
                  index={index}
                  isSelected={selectedSectionId === section.id}
                  onSelect={onSectionSelect}
                  onDelete={onSectionDelete}
                />
                
                {/* Drop zone after each section */}
                <DropZone 
                  index={index + 1} 
                  onDrop={(dragIndex, dropIndex) => {
                    // Handle drop between sections
                    if (dragIndex !== dropIndex) {
                      // This will be handled by the DraggableSection's hover logic
                    }
                  }} 
                />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviewArea