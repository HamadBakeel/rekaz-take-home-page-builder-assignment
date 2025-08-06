import { PreviewAreaClient, SectionEditorClient, SectionLibraryServer, ImportExport } from '@/components/builder'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-foreground">Mini Website Builder</h1>
          <p className="text-sm text-muted-foreground">Create beautiful websites with drag-and-drop simplicity</p>
        </div>
      </header>

      {/* Main Layout - Three Panel Structure */}
      <main className="container mx-auto p-4">
        <div className="builder-grid min-h-[calc(100vh-120px)]">
          {/* Section Library Panel - Server Component */}
          <div className="section-library">
            <div className="bg-card rounded-lg border border-border h-full builder-panel">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Section Library</h2>
                <p className="text-sm text-muted-foreground hidden sm:block">Drag sections to build your page</p>
                <p className="text-sm text-muted-foreground sm:hidden">Tap sections to add</p>
              </div>
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 80px)' }}>
                <div className="space-y-6">
                  <SectionLibraryServer />
                  
                  {/* Import/Export Section */}
                  <div className="border-t border-border pt-4">
                    <h3 className="text-sm font-medium text-foreground mb-3">Import/Export</h3>
                    <ImportExport />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Area Panel - Client Component */}
          <div className="preview-area">
            <div className="bg-card rounded-lg border border-border h-full builder-panel">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Preview</h2>
                <p className="text-sm text-muted-foreground">Live preview of your website</p>
              </div>
              <div className="p-4 h-full overflow-y-auto" style={{ maxHeight: 'calc(100% - 80px)' }}>
                <PreviewAreaClient />
              </div>
            </div>
          </div>

          {/* Section Editor Panel - Client Component */}
          <div className="section-editor">
            <div className="bg-card rounded-lg border border-border h-full builder-panel">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Properties</h2>
                <p className="text-sm text-muted-foreground">Edit selected section</p>
              </div>
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100% - 80px)' }}>
                <SectionEditorClient />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
