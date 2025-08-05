'use client'

import React from 'react'
import { Section } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface SectionEditorProps {
  section: Section | null
  onSectionUpdate: (id: string, props: Record<string, any>) => void
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, onSectionUpdate }) => {
  if (!section) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Properties</h3>
        <p className="text-muted-foreground">Select a section to edit its properties</p>
      </div>
    )
  }

  const handlePropertyChange = (key: string, value: string) => {
    onSectionUpdate(section.id, { [key]: value })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Properties</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={section.props.title || ''}
            onChange={(e) => handlePropertyChange('title', e.target.value)}
            placeholder="Enter title"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={section.props.description || ''}
            onChange={(e) => handlePropertyChange('description', e.target.value)}
            placeholder="Enter description"
          />
        </div>
        
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={section.props.imageUrl || ''}
            onChange={(e) => handlePropertyChange('imageUrl', e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
      </div>
    </div>
  )
}

export default SectionEditor