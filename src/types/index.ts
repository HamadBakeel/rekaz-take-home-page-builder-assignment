// Core types for the website builder
export interface Section {
  id: string
  type: string
  props: Record<string, any>
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface SectionProps {
  title?: string
  description?: string
  imageUrl?: string
  backgroundColor?: string
  textColor?: string
  [key: string]: any
}

export interface SectionTemplate {
  id: string
  name: string
  category: string
  defaultProps: Record<string, any>
  component: React.ComponentType<any>
  thumbnail: string
}

export interface ExportData {
  version: string
  createdAt: string
  sections: Section[]
  metadata: {
    title?: string
    description?: string
    author?: string
  }
}

export interface BuilderError {
  type: 'SECTION_RENDER' | 'IMPORT_INVALID' | 'EXPORT_FAILED' | 'DRAG_DROP_ERROR'
  message: string
  sectionId?: string
  timestamp: Date
}

export interface AppState {
  sections: Section[]
  selectedSectionId: string | null
  editMode: 'select' | 'edit' | 'drag'
  history: {
    past: Section[][]
    present: Section[]
    future: Section[][]
  }
}