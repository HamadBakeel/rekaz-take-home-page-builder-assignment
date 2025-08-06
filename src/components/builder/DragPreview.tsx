'use client'

import React from 'react'
import { GripVertical } from 'lucide-react'

import { Section } from '@/types'

interface DragPreviewProps {
  section: Section
}

const DragPreview: React.FC<DragPreviewProps> = ({ section }) => {
  return (
    <div className="relative bg-background border-2 border-primary rounded-lg shadow-2xl p-3 min-w-[200px] max-w-[300px] opacity-95 transform rotate-2 scale-105 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <GripVertical className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-sm font-medium text-foreground capitalize">
          {section.type} Section
        </span>
      </div>
      
      <div className="bg-gradient-to-r from-muted to-muted/50 rounded p-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Moving section...</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
      
      {/* Section type indicator with animated dots */}
      <div className="mt-2 flex items-center gap-1">
        <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
        <div className="w-1 h-1 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
        <div className="w-1 h-1 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
      </div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-lg border border-primary/30 animate-pulse" />
    </div>
  )
}

export default DragPreview