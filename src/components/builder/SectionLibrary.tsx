import React from 'react'
import { SectionTemplate } from '@/types'

interface SectionLibraryProps {
  availableSections: SectionTemplate[]
}

const SectionLibrary: React.FC<SectionLibraryProps> = ({ availableSections }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Available Sections</h3>
      <div className="grid gap-2">
        {availableSections.map((section) => (
          <div
            key={section.id}
            className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
          >
            <h4 className="font-medium">{section.name}</h4>
            <p className="text-sm text-muted-foreground">{section.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionLibrary