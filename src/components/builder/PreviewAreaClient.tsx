'use client'

import React from 'react'

import { useBuilderStore } from '@/stores/builder-store'

import PreviewArea from './PreviewArea'

export function PreviewAreaClient() {
  const { 
    selectedSectionId, 
    selectSection, 
    deleteSection,
    getOrderedSections 
  } = useBuilderStore()

  const orderedSections = getOrderedSections()

  return (
    <PreviewArea
      sections={orderedSections}
      selectedSectionId={selectedSectionId}
      onSectionSelect={selectSection}
      onSectionDelete={deleteSection}
    />
  )
}