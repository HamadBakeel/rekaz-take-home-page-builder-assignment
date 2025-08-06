import React from 'react'

interface SectionThumbnailProps {
  type: string
  className?: string
}

export function SectionThumbnail({ type, className = '' }: SectionThumbnailProps) {
  const getThumbnailSVG = (sectionType: string) => {
    const baseClasses = "w-full h-full"
    
    switch (sectionType) {
      case 'header':
        return (
          <svg viewBox="0 0 120 40" className={baseClasses} fill="none">
            <rect width="120" height="40" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
            <rect x="8" y="12" width="20" height="4" fill="#64748b" rx="2"/>
            <rect x="92" y="10" width="8" height="2" fill="#64748b" rx="1"/>
            <rect x="92" y="14" width="12" height="2" fill="#64748b" rx="1"/>
            <rect x="92" y="18" width="10" height="2" fill="#64748b" rx="1"/>
            <rect x="92" y="22" width="14" height="2" fill="#64748b" rx="1"/>
          </svg>
        )
      
      case 'hero':
        return (
          <svg viewBox="0 0 120 40" className={baseClasses} fill="none">
            <rect width="120" height="40" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1"/>
            <rect x="30" y="8" width="60" height="6" fill="#1e293b" rx="3"/>
            <rect x="35" y="16" width="50" height="3" fill="#64748b" rx="1.5"/>
            <rect x="45" y="22" width="30" height="8" fill="#3b82f6" rx="4"/>
          </svg>
        )
      
      case 'content':
        return (
          <svg viewBox="0 0 120 40" className={baseClasses} fill="none">
            <rect width="120" height="40" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1"/>
            <rect x="8" y="6" width="48" height="28" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" rx="2"/>
            <rect x="64" y="8" width="48" height="3" fill="#1e293b" rx="1.5"/>
            <rect x="64" y="14" width="44" height="2" fill="#64748b" rx="1"/>
            <rect x="64" y="18" width="40" height="2" fill="#64748b" rx="1"/>
            <rect x="64" y="22" width="46" height="2" fill="#64748b" rx="1"/>
            <rect x="64" y="26" width="38" height="2" fill="#64748b" rx="1"/>
          </svg>
        )
      
      case 'footer':
        return (
          <svg viewBox="0 0 120 40" className={baseClasses} fill="none">
            <rect width="120" height="40" fill="#1f2937" stroke="#374151" strokeWidth="1"/>
            <rect x="8" y="8" width="24" height="2" fill="#9ca3af" rx="1"/>
            <rect x="8" y="12" width="20" height="1.5" fill="#6b7280" rx="0.75"/>
            <rect x="8" y="15" width="18" height="1.5" fill="#6b7280" rx="0.75"/>
            <rect x="8" y="18" width="22" height="1.5" fill="#6b7280" rx="0.75"/>
            
            <rect x="40" y="8" width="24" height="2" fill="#9ca3af" rx="1"/>
            <rect x="40" y="12" width="20" height="1.5" fill="#6b7280" rx="0.75"/>
            <rect x="40" y="15" width="18" height="1.5" fill="#6b7280" rx="0.75"/>
            <rect x="40" y="18" width="22" height="1.5" fill="#6b7280" rx="0.75"/>
            
            <rect x="8" y="28" width="104" height="1" fill="#4b5563" rx="0.5"/>
            <rect x="8" y="32" width="80" height="1.5" fill="#6b7280" rx="0.75"/>
          </svg>
        )
      
      default:
        return (
          <svg viewBox="0 0 120 40" className={baseClasses} fill="none">
            <rect width="120" height="40" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
            <rect x="40" y="15" width="40" height="10" fill="#e2e8f0" rx="5"/>
          </svg>
        )
    }
  }

  return (
    <div className={`bg-background border border-border rounded overflow-hidden ${className}`}>
      {getThumbnailSVG(type)}
    </div>
  )
}