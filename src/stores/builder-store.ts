import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

import { Section, SectionTemplate, ExportData, BuilderStore } from '@/types'

export const useBuilderStore = create<BuilderStore>()(
  subscribeWithSelector((set, get) => ({
  // Initial state
  sections: [],
  selectedSectionId: null,
  isDragging: false,
  draggedSectionId: null,
  
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
          ? { 
              ...section, 
              props: { ...section.props, ...props }, 
              updatedAt: new Date() 
            }
          : section
      )
    }))
  },
  
  deleteSection: (id: string) => {
    set((state) => {
      const filteredSections = state.sections.filter(s => s.id !== id)
      // Update order for remaining sections
      const reorderedSections = filteredSections.map((section, index) => ({
        ...section,
        order: index,
        updatedAt: new Date()
      }))
      
      return {
        ...state,
        sections: reorderedSections,
        selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId
      }
    })
  },
  
  reorderSections: (fromIndex: number, toIndex: number) => {
    set((state) => {
      if (fromIndex < 0 || fromIndex >= state.sections.length || 
          toIndex < 0 || toIndex >= state.sections.length || 
          fromIndex === toIndex) {
        return state
      }
      
      const newSections = [...state.sections]
      const [removed] = newSections.splice(fromIndex, 1)
      
      if (removed) {
        newSections.splice(toIndex, 0, removed)
        
        // Update order property for all sections
        const reorderedSections = newSections.map((section, index) => ({
          ...section,
          order: index,
          updatedAt: new Date()
        }))
        
        return {
          ...state,
          sections: reorderedSections
        }
      }
      
      return state
    })
  },
  
  selectSection: (id: string | null) => {
    set((state) => ({
      ...state,
      selectedSectionId: id
    }))
  },
  
  setDragging: (isDragging: boolean, draggedSectionId?: string | null) => {
    set((state) => ({
      ...state,
      isDragging,
      draggedSectionId: draggedSectionId || null
    }))
  },

  cancelDrag: () => {
    set((state) => ({
      ...state,
      isDragging: false,
      draggedSectionId: null
    }))
  },
  
  exportDesign: () => {
    const state = get()
    return {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      sections: state.sections.map(section => ({
        ...section,
        createdAt: section.createdAt instanceof Date ? section.createdAt.toISOString() : section.createdAt,
        updatedAt: section.updatedAt instanceof Date ? section.updatedAt.toISOString() : section.updatedAt
      })),
      metadata: {
        title: 'Website Design',
        description: 'Created with Mini Website Builder',
        author: 'Mini Website Builder User',
        tags: ['website', 'builder', 'design']
      }
    }
  },
  
  importDesign: (data: ExportData) => {
    set((state) => {
      // Validate and import sections
      if (!data.sections || !Array.isArray(data.sections)) {
        console.error('Invalid sections data provided to importDesign')
        return state
      }
      
      const importedSections = data.sections.map((section, index) => {
        try {
          return {
            ...section,
            order: index,
            createdAt: new Date(section.createdAt),
            updatedAt: new Date(section.updatedAt)
          }
        } catch (error) {
          console.error('Error processing section:', section, error)
          // Return section with current dates if date parsing fails
          return {
            ...section,
            order: index,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      })
      
      return {
        ...state,
        sections: importedSections,
        selectedSectionId: null,
        isDragging: false,
        draggedSectionId: null
      }
    })
  },
  
  clearSections: () => {
    set((state) => ({
      ...state,
      sections: [],
      selectedSectionId: null,
      isDragging: false,
      draggedSectionId: null
    }))
  },
  
  // Computed selectors
  getSectionById: (id: string) => {
    return get().sections.find(s => s.id === id)
  },
  
  getOrderedSections: () => {
    return get().sections.slice().sort((a, b) => a.order - b.order)
  },
  
  getSelectedSection: () => {
    const state = get()
    return state.selectedSectionId ? state.getSectionById(state.selectedSectionId) : undefined
  },
})))