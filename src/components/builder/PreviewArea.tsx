'use client'

import React from 'react'
import { Section } from '@/types'

interface PreviewAreaProps {
  sections: Section[]
  selectedSectionId: string | null
  onSectionSelect: (id: string) => void
  onSectionDelete: (id: string) => void
}

const PreviewArea: React.FC<PreviewAreaProps> = ({
  sections,
  selectedSectionId,
  onSectionSelect,
  onSectionDelete,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Preview</h3>
      <div className="border rounded-lg min-h-96 bg-background">
        {sections.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            Add sections from the library to start building
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`p-4 border rounded cursor-pointer transition-colors ${
                  selectedSectionId === section.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent'
                }`}
                onClick={() => onSectionSelect(section.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{section.type}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onSectionDelete(section.id)
                    }}
                    className="text-destructive hover:text-destructive/80"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviewArea