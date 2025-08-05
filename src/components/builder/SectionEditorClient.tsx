'use client'

import React from 'react'

export function SectionEditorClient() {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-muted rounded-lg mx-auto flex items-center justify-center mb-3">
          <svg 
            className="w-6 h-6 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
            />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1">No section selected</h3>
        <p className="text-xs text-muted-foreground">
          Select a section from the preview to edit its properties
        </p>
      </div>
    </div>
  )
}