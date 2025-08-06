'use client'

import React, { useCallback, useState, useRef } from 'react'
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react'

import { useBuilderStore } from '@/stores/builder-store'
import { ExportDataSchema } from '@/types'

interface ImportExportProps {
  className?: string
}

interface ExportState {
  isExporting: boolean
  exportError: string | null
  exportSuccess: boolean
}

interface ImportState {
  isImporting: boolean
  importError: string | null
  importSuccess: boolean
}

export const ImportExport: React.FC<ImportExportProps> = ({ className = '' }) => {
  const { exportDesign, importDesign, sections } = useBuilderStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [exportState, setExportState] = useState<ExportState>({
    isExporting: false,
    exportError: null,
    exportSuccess: false
  })

  const [importState, setImportState] = useState<ImportState>({
    isImporting: false,
    importError: null,
    importSuccess: false
  })

  // Clear success/error messages after a delay
  const clearMessages = useCallback((type: 'export' | 'import') => {
    setTimeout(() => {
      if (type === 'export') {
        setExportState(prev => ({ ...prev, exportSuccess: false, exportError: null }))
      } else {
        setImportState(prev => ({ ...prev, importSuccess: false, importError: null }))
      }
    }, 3000)
  }, [])

  const handleExport = useCallback(async () => {
    try {
      setExportState({
        isExporting: true,
        exportError: null,
        exportSuccess: false
      })

      // Validate that we have sections to export
      if (!sections || sections.length === 0) {
        throw new Error('No sections to export. Please add some sections to your design first.')
      }

      // Get export data from store
      const exportData = exportDesign()

      // Validate export data structure
      const validationResult = ExportDataSchema.safeParse(exportData)
      if (!validationResult.success) {
        const errorMessages = validationResult.error.issues.map((err: any) =>
          `${err.path.join('.')}: ${err.message}`
        ).join(', ')
        throw new Error(`Export validation failed: ${errorMessages}`)
      }

      // Create JSON string
      const jsonString = JSON.stringify(exportData, null, 2)

      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      // Generate descriptive filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      const filename = `website-design-${timestamp}.json`

      // Create download link and trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up blob URL
      URL.revokeObjectURL(url)

      setExportState({
        isExporting: false,
        exportError: null,
        exportSuccess: true
      })

      clearMessages('export')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export design'

      setExportState({
        isExporting: false,
        exportError: errorMessage,
        exportSuccess: false
      })

      clearMessages('export')

      // Log error for debugging (development only)
      if (process.env.NODE_ENV === 'development') {
        console.error('Export error:', error)
      }
    }
  }, [sections, exportDesign, clearMessages])

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setImportState({
        isImporting: true,
        importError: null,
        importSuccess: false
      })

      // Validate file type
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        throw new Error('Please select a valid JSON file')
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Please select a file smaller than 10MB')
      }

      // Read file content
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result
          if (typeof result === 'string') {
            resolve(result)
          } else {
            reject(new Error('Failed to read file content'))
          }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
      })

      // Parse JSON
      let parsedData: unknown
      try {
        parsedData = JSON.parse(fileContent)
      } catch {
        throw new Error('Invalid JSON file. Please check the file format and try again.')
      }

      // Validate data structure using Zod schema
      const validationResult = ExportDataSchema.safeParse(parsedData)
      if (!validationResult.success) {
        const errorMessages = validationResult.error.issues.map((err: any) =>
          `${err.path.join('.')}: ${err.message}`
        ).join(', ')
        throw new Error(`Invalid file format: ${errorMessages}`)
      }

      const validatedData = validationResult.data

      // Additional validation for sections
      if (validatedData.sections.length === 0) {
        throw new Error('The imported file contains no sections')
      }

      // Convert string dates back to Date objects for the store
      const processedData = {
        ...validatedData,
        sections: validatedData.sections.map(section => ({
          ...section,
          createdAt: new Date(section.createdAt),
          updatedAt: new Date(section.updatedAt)
        }))
      }

      // Import the processed data
      importDesign(processedData)

      setImportState({
        isImporting: false,
        importError: null,
        importSuccess: true
      })

      clearMessages('import')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import design'

      setImportState({
        isImporting: false,
        importError: errorMessage,
        importSuccess: false
      })

      clearMessages('import')

      // Log error for debugging (development only)
      if (process.env.NODE_ENV === 'development') {
        console.error('Import error:', error)
      }
    } finally {
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [importDesign, clearMessages])

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Export Section */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleExport}
          disabled={exportState.isExporting || sections.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={16} />
          {exportState.isExporting ? 'Exporting...' : 'Export Design'}
        </button>

        {exportState.exportError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={16} />
            <span className="text-sm">{exportState.exportError}</span>
          </div>
        )}

        {exportState.exportSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle size={16} />
            <span className="text-sm">Design exported successfully!</span>
          </div>
        )}
      </div>

      {/* Import Section */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleImportClick}
          disabled={importState.isImporting}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Upload size={16} />
          {importState.isImporting ? 'Importing...' : 'Import Design'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileSelect}
          className="hidden"
        />

        {importState.importError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={16} />
            <span className="text-sm">{importState.importError}</span>
          </div>
        )}

        {importState.importSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle size={16} />
            <span className="text-sm">Design imported successfully!</span>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Export saves your current design as a JSON file</p>
        <p>• Import replaces your current design with the imported one</p>
        <p>• Only JSON files exported from this builder are supported</p>
      </div>
    </div>
  )
}

export default ImportExport