// Application constants
export const BREAKPOINTS = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
} as const

export const SECTION_TYPES = {
  HEADER: 'header',
  HERO: 'hero',
  CONTENT: 'content',
  FOOTER: 'footer',
} as const

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const

export const MAX_SECTIONS = 50
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB