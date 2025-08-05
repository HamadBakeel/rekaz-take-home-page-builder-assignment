'use client'

import React from 'react'

import { Section } from '@/types'

interface WebsiteBuilderProps {
  initialSections?: Section[]
}

const WebsiteBuilder: React.FC<WebsiteBuilderProps> = ({ initialSections: _initialSections = [] }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Website Builder</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Section Library */}
          <div className="bg-card rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Section Library</h2>
            <p className="text-muted-foreground">Components will be added here</p>
          </div>
          
          {/* Preview Area */}
          <div className="bg-card rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Preview</h2>
            <p className="text-muted-foreground">Preview will be rendered here</p>
          </div>
          
          {/* Section Editor */}
          <div className="bg-card rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Properties</h2>
            <p className="text-muted-foreground">Section properties will be edited here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebsiteBuilder