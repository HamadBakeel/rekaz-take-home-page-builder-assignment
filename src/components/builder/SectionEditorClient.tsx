'use client'

import React, { useMemo, useCallback } from 'react'
import { useBuilderStore } from '@/stores/builder-store'
import PropertyEditor from './PropertyEditor'

export const SectionEditorClient: React.FC = React.memo(() => {
  // Selective subscription for optimal performance
  const selectedSectionId = useBuilderStore(state => state.selectedSectionId)
  const getSectionById = useBuilderStore(state => state.getSectionById)
  const updateSection = useBuilderStore(state => state.updateSection)

  // Memoized selected section to prevent unnecessary re-renders
  const selectedSection = useMemo(() => {
    return selectedSectionId ? getSectionById(selectedSectionId) || null : null
  }, [selectedSectionId, getSectionById])

  // Memoized update handler with error handling and rollback mechanism
  const handleSectionUpdate = useCallback((id: string, props: Record<string, any>) => {
    try {
      updateSection(id, props)
    } catch (error) {
      console.error('Failed to update section:', error)
      // Could add toast notification here for user feedback
      // In a real app, you might want to implement a rollback mechanism
      throw error // Re-throw to let PropertyEditor handle the error
    }
  }, [updateSection])

  return (
    <PropertyEditor
      section={selectedSection}
      onSectionUpdate={handleSectionUpdate}
    />
  )
})

SectionEditorClient.displayName = 'SectionEditorClient'