'use client'

import React from 'react'
import { useDrop } from 'react-dnd'

interface DropZoneProps {
  index: number
  onDrop: (dragIndex: number, dropIndex: number) => void
}

interface DragItem {
  type: string
  id: string
  index: number
}

const SECTION_TYPE = 'SECTION'

const DropZone: React.FC<DropZoneProps> = ({ index, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: SECTION_TYPE,
    drop: (item: DragItem) => {
      try {
        // Validate the drop operation
        if (typeof item.index !== 'number' || typeof index !== 'number') {
          console.warn('Invalid drop indices:', { dragIndex: item.index, dropIndex: index })
          return { success: false, error: 'Invalid indices' }
        }

        onDrop(item.index, index)
        return { success: true, targetIndex: index }
      } catch (error) {
        console.error('Error during drop zone drop:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = isOver && canDrop

  return (
    <div
      ref={drop as any}
      className={`
        mx-4 rounded-full transition-all duration-300 ease-out relative
        ${isActive 
          ? 'h-6 bg-gradient-to-r from-blue-500/20 via-blue-500 to-blue-500/20 shadow-lg shadow-blue-500/25' 
          : 'h-2 bg-transparent hover:bg-muted/30'
        }
      `}
      style={{
        minHeight: isActive ? '24px' : '8px',
      }}
    >
      {isActive && (
        <>
          {/* Animated drop indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
          
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse" />
          
          {/* Text indicator */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded whitespace-nowrap">
            Drop here
          </div>
        </>
      )}
    </div>
  )
}

export default DropZone