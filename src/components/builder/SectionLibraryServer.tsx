import React from 'react'

import { sectionTemplates } from '@/data/section-templates'

import { SectionLibraryClient } from './SectionLibraryClient'

export function SectionLibraryServer() {
  // Server component that provides the template data to the client component
  // This allows the template data to be server-rendered while keeping
  // interactive functionality on the client side
  return <SectionLibraryClient templates={sectionTemplates} />
}