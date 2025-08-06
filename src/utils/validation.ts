import { z } from 'zod'

import { ExportData, ExportedSectionSchema } from '@/types'

// Validation schemas
export const SectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.string(), z.any()),
  order: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const ExportDataSchema = z.object({
  version: z.string(),
  createdAt: z.string(),
  sections: z.array(ExportedSectionSchema),
  metadata: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    author: z.string().optional(),
  }),
})

// Validation functions
export const validateExportData = (data: unknown): ExportData => {
  return ExportDataSchema.parse(data)
}

export const validateImageUrl = (url: string): boolean => {
  try {
    new URL(url)
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
  } catch {
    return false
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}