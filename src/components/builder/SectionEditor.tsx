'use client'

import React from 'react'
import { Section } from '@/types'
import PropertyEditor from './PropertyEditor'

interface SectionEditorProps {
  section: Section | null
  onSectionUpdate: (id: string, props: Record<string, any>) => void
}

const SectionEditor: React.FC<SectionEditorProps> = React.memo(({ 
  section, 
  onSectionUpdate 
}) => {
  return (
    <PropertyEditor 
      section={section} 
      onSectionUpdate={onSectionUpdate} 
    />
  )
})

SectionEditor.displayName = 'SectionEditor'

export default SectionEditor