import { create } from 'zustand'

import { Section, SectionTemplate, ExportData } from '@/types'

interface BuilderStore {
  // State
  sections: Section[]
  selectedSectionId: string | null
  isDragging: boolean
  
  // Actions
  addSection: (template: SectionTemplate) => void
  updateSection: (id: string, props: Partial<Section['props']>) => void
  deleteSection: (id: string) => void
  reorderSections: (fromIndex: number, toIndex: number) => void
  selectSection: (id: string | null) => void
  exportDesign: () => ExportData
  importDesign: (data: ExportData) => void
  
  // Computed
  getSectionById: (id: string) => Section | undefined
  getOrderedSections: () => Section[]
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
    // Initial state
    sections: [],
    selectedSectionId: null,
    isDragging: false,
    
    // Actions
    addSection: (template: SectionTemplate) => {
      set((state) => {
        const newSection: Section = {
          id: crypto.randomUUID(),
          type: template.id,
          props: { ...template.defaultProps },
          order: state.sections.length,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        return {
          ...state,
          sections: [...state.sections, newSection]
        }
      })
    },
    
    updateSection: (id: string, props: Partial<Section['props']>) => {
      set((state) => ({
        ...state,
        sections: state.sections.map(section =>
          section.id === id
            ? { ...section, props: { ...section.props, ...props }, updatedAt: new Date() }
            : section
        )
      }))
    },
    
    deleteSection: (id: string) => {
      set((state) => ({
        ...state,
        sections: state.sections.filter(s => s.id !== id),
        selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId
      }))
    },
    
    reorderSections: (fromIndex: number, toIndex: number) => {
      set((state) => {
        const newSections = [...state.sections]
        const [removed] = newSections.splice(fromIndex, 1)
        
        if (removed) {
          newSections.splice(toIndex, 0, removed)
          
          // Update order property
          newSections.forEach((section, index) => {
            section.order = index
          })
        }
        
        return {
          ...state,
          sections: newSections
        }
      })
    },
    
    selectSection: (id: string | null) => {
      set((state) => ({
        ...state,
        selectedSectionId: id
      }))
    },
    
    exportDesign: () => {
      const state = get()
      return {
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        sections: state.sections,
        metadata: {
          title: 'Website Design',
          description: 'Created with Mini Website Builder',
        }
      }
    },
    
    importDesign: (data: ExportData) => {
      set((state) => ({
        ...state,
        sections: data.sections,
        selectedSectionId: null
      }))
    },
    
    // Computed
    getSectionById: (id: string) => {
      return get().sections.find(s => s.id === id)
    },
    
    getOrderedSections: () => {
      return get().sections.sort((a, b) => a.order - b.order)
    },
  }))