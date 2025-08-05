'use client'

import React from 'react'

export function PreviewAreaClient() {
  return (
    <div className="h-full min-h-[400px] bg-background border border-dashed border-border rounded-lg flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
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
        <div>
          <h3 className="text-sm font-medium text-foreground">No sections added yet</h3>
          <p className="text-xs text-muted-foreground">
            Add sections from the library to start building your website
          </p>
        </div>
      </div>
    </div>
  )
}