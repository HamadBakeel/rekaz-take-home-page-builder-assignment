import { z } from 'zod'

// Core types for the website builder

// Section-related interfaces
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
  buttonText?: string
  buttonUrl?: string
  logoUrl?: string
  navigationItems?: Array<{ label: string; url: string }>
  socialLinks?: Array<{ platform: string; url: string; icon: string }>
  content?: string
  imagePosition?: 'left' | 'right' | 'top' | 'bottom'
  linkGroups?: Array<{
    title: string
    links: Array<{ label: string; url: string }>
  }>
  copyright?: string
  [key: string]: any
}

export interface SectionTemplate {
  id: string
  name: string
  category: string
  defaultProps: Record<string, any>
  component: string
  thumbnail: string
  description?: string
}

// Store interfaces
export interface BuilderStore {
  // State
  sections: Section[]
  selectedSectionId: string | null
  isDragging: boolean
  draggedSectionId: string | null
  
  // Actions
  addSection: (template: SectionTemplate) => void
  updateSection: (id: string, props: Partial<SectionProps>) => void
  deleteSection: (id: string) => void
  reorderSections: (fromIndex: number, toIndex: number) => void
  selectSection: (id: string | null) => void
  setDragging: (isDragging: boolean, draggedSectionId?: string | null) => void
  exportDesign: () => ExportData
  importDesign: (data: ExportData) => void
  clearSections: () => void
  
  // Computed selectors
  getSectionById: (id: string) => Section | undefined
  getOrderedSections: () => Section[]
  getSelectedSection: () => Section | undefined
}

export interface AppState {
  sections: Section[]
  selectedSectionId: string | null
  editMode: 'select' | 'edit' | 'drag'
  isDragging: boolean
  draggedSectionId: string | null
  history: {
    past: Section[][]
    present: Section[]
    future: Section[][]
  }
}

// Import/Export interfaces
export interface ExportData {
  version: string
  createdAt: string
  sections: Section[]
  metadata: {
    title?: string
    description?: string
    author?: string
    tags?: string[]
  }
}

// Error handling types
export interface BuilderError {
  type: 'SECTION_RENDER' | 'IMPORT_INVALID' | 'EXPORT_FAILED' | 'DRAG_DROP_ERROR' | 'VALIDATION_ERROR' | 'NETWORK_ERROR'
  message: string
  sectionId?: string
  timestamp: Date
  details?: Record<string, any>
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface ValidationError {
  field: string
  message: string
  value?: any
}

// Component prop interfaces

export interface SectionLibraryProps {
  availableSections: SectionTemplate[]
  onSectionAdd: (template: SectionTemplate) => void
}

export interface PreviewAreaProps {
  sections: Section[]
  selectedSectionId: string | null
  onSectionSelect: (id: string) => void
  onSectionDelete: (id: string) => void
  isDragging: boolean
}

export interface SectionEditorProps {
  section: Section | null
  onSectionUpdate: (id: string, props: Record<string, any>) => void
  onClose: () => void
}

export interface DragDropContextProps {
  onSectionReorder: (fromIndex: number, toIndex: number) => void
  children: React.ReactNode
}

// Validation schemas using Zod
export const SectionPropsSchema = z.record(z.string(), z.any()).optional()

export const SectionSchema = z.object({
  id: z.string().min(1, 'Section ID is required'),
  type: z.string().min(1, 'Section type is required'),
  props: SectionPropsSchema.default({}),
  order: z.number().int().min(0, 'Order must be a non-negative integer'),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const ExportDataSchema = z.object({
  version: z.string().min(1, 'Version is required'),
  createdAt: z.string().datetime('Invalid date format'),
  sections: z.array(SectionSchema).min(0, 'Sections must be an array'),
  metadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional()
  }).optional().default({})
})

export const SectionTemplateSchema = z.object({
  id: z.string().min(1, 'Template ID is required'),
  name: z.string().min(1, 'Template name is required'),
  category: z.string().min(1, 'Template category is required'),
  defaultProps: z.record(z.string(), z.any()).default({}),
  thumbnail: z.string().url('Invalid thumbnail URL'),
  description: z.string().optional()
})

// URL validation schema
export const UrlSchema = z.string().url('Invalid URL format').or(z.string().length(0))

// Image URL validation with additional checks
export const ImageUrlSchema = z.string().refine(
  (url) => {
    if (!url) return true // Allow empty URLs
    try {
      const parsedUrl = new URL(url)
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
      return validExtensions.some(ext => 
        parsedUrl.pathname.toLowerCase().endsWith(ext)
      ) || parsedUrl.protocol === 'data:'
    } catch {
      return false
    }
  },
  'Invalid image URL or unsupported format'
)

// Navigation item validation
export const NavigationItemSchema = z.object({
  label: z.string().min(1, 'Navigation label is required'),
  url: UrlSchema
})

// Social link validation
export const SocialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: UrlSchema,
  icon: z.string().min(1, 'Icon is required')
})

// Link group validation
export const LinkGroupSchema = z.object({
  title: z.string().min(1, 'Link group title is required'),
  links: z.array(z.object({
    label: z.string().min(1, 'Link label is required'),
    url: UrlSchema
  }))
})

// Specific section props validation schemas
export const HeaderSectionPropsSchema = z.object({
  title: z.string().optional(),
  logoUrl: ImageUrlSchema.optional(),
  navigationItems: z.array(NavigationItemSchema).optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional()
})

export const HeroSectionPropsSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().optional(),
  buttonUrl: UrlSchema.optional(),
  imageUrl: ImageUrlSchema.optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional()
})

export const ContentSectionPropsSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  imageUrl: ImageUrlSchema.optional(),
  imagePosition: z.enum(['left', 'right', 'top', 'bottom']).optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional()
})

export const FooterSectionPropsSchema = z.object({
  linkGroups: z.array(LinkGroupSchema).optional(),
  socialLinks: z.array(SocialLinkSchema).optional(),
  copyright: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional()
})

// Type guards
export const isSectionTemplate = (obj: any): obj is SectionTemplate => {
  return SectionTemplateSchema.safeParse(obj).success
}

export const isValidSection = (obj: any): obj is Section => {
  return SectionSchema.safeParse(obj).success
}

export const isValidExportData = (obj: any): obj is ExportData => {
  return ExportDataSchema.safeParse(obj).success
}

// Utility types
export type SectionType = 'header' | 'hero' | 'content' | 'footer' | 'gallery' | 'contact'

export type EditMode = 'select' | 'edit' | 'drag'

export type DragItem = {
  id: string
  type: string
  index: number
}

export type DropResult = {
  dragIndex: number
  hoverIndex: number
}