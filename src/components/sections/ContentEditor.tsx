'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'

interface ContentEditorProps {
  content: string
  onChange: (content: string) => void
  textColor: string
}

const ContentEditor: React.FC<ContentEditorProps> = React.memo(({
  content,
  onChange,
  textColor
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Update local state when content prop changes
  useEffect(() => {
    setEditContent(content)
  }, [content])

  // Callback for entering edit mode
  const handleEditStart = useCallback(() => {
    setIsEditing(true)
    // Focus textarea after state update
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }, [])

  // Callback for saving changes
  const handleSave = useCallback(() => {
    try {
      onChange(editContent)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving content:', error)
      // Revert to original content on error
      setEditContent(content)
      setIsEditing(false)
    }
  }, [editContent, onChange, content])

  // Callback for canceling edit
  const handleCancel = useCallback(() => {
    setEditContent(content)
    setIsEditing(false)
  }, [content])

  // Callback for content change
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value)
  }, [])

  // Callback for keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    }
  }, [handleCancel, handleSave])

  if (isEditing) {
    return (
      <div className="space-y-4">
        <textarea
          ref={textareaRef}
          value={editContent}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          className="w-full min-h-[200px] p-4 border rounded-lg resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ 
            color: textColor,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: `${textColor}30`
          }}
          placeholder="Enter your content here..."
        />
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="prose prose-lg max-w-none leading-relaxed cursor-pointer hover:bg-opacity-10 hover:bg-gray-500 p-2 rounded transition-colors"
      style={{ color: textColor }}
      onClick={handleEditStart}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
})

ContentEditor.displayName = 'ContentEditor'

export default ContentEditor