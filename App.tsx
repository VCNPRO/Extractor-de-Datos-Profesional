
import React, { useState, useMemo, useEffect } from 'react';
// Fix: Use explicit file extension in import.
import { FileUploader } from './components/FileUploader.tsx';
// Fix: Use explicit file extension in import.
import { ExtractionEditor } from './components/ExtractionEditor.tsx';
// Fix: Use explicit file extension in import.
import { HistoryViewer } from './components/HistoryViewer.tsx';
// Fix: Use explicit file extension in import.
import { TemplatesPanel, type Template } from './components/TemplatesPanel.tsx';
// Fix: Use explicit file extension in import.
import { ApiKeyModal } from './components/ApiKeyModal.tsx';
// Fix: Use explicit file extension in import.
import { KeyIcon } from './components/Icons.tsx';
// Fix: Use explicit file extension in import.
import type { UploadedFile, ExtractionResult, SchemaField } from './types.ts';
import { setApiKey, getApiKey } from './services/geminiService.ts';

// Helper to create a dummy file for the example
function createExampleFile(): File {
    const exampleContent = `
FACTURA
Cliente: Juan Pérez
Fecha: 2024-07-29

Artículos:
- Teclado Mecánico: 120.00
- Ratón Gaming: 75.50

Total: 195.50
`;
    return new File([exampleContent], "factura-ejemplo.txt", { type: "text/plain" });
}


function App() {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [history, setHistory] = useState<ExtractionResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

    // State for the editor, which can be reused across different files
    const [prompt, setPrompt] = useState<string>('Extrae la información clave del siguiente documento según el esquema JSON proporcionado.');
    const [schema, setSchema] = useState<SchemaField[]>([{ id: `field-${Date.now()}`, name: '', type: 'STRING' }]);

    // Check if API key is set on mount
    useEffect(() => {
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            setApiKey(savedKey);
        } else {
            // Show modal if no API key is set
            setIsApiKeyModalOpen(true);
        }
    }, []);

    const activeFile = useMemo(() => files.find(f => f.id === activeFileId), [files, activeFileId]);

    const handleFileSelect = (id: string | null) => {
        setActiveFileId(id);
    };
    
    const handleExtract = async () => {
        if (!activeFile) return;

        // Lazy import the service
        const { extractDataFromDocument } = await import('./services/geminiService.ts');

        setIsLoading(true);
        // Reset status for the current file
        setFiles(currentFiles => 
            currentFiles.map(f => f.id === activeFile.id ? { ...f, status: 'procesando', error: undefined, extractedData: undefined } : f)
        );

        try {
            const extractedData = await extractDataFromDocument(activeFile.file, schema, prompt);
            
            setFiles(currentFiles => 
                currentFiles.map(f => f.id === activeFile.id ? { ...f, status: 'completado', extractedData: extractedData, error: undefined } : f)
            );
    
            const newHistoryEntry: ExtractionResult = {
                id: `hist-${Date.now()}`,
                fileId: activeFile.id,
                fileName: activeFile.file.name,
                schema: JSON.parse(JSON.stringify(schema)), // Deep copy schema
                extractedData: extractedData,
                timestamp: new Date().toISOString(),
            };
            setHistory(currentHistory => [newHistoryEntry, ...currentHistory]);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
            setFiles(currentFiles =>
                currentFiles.map(f => f.id === activeFile.id ? { ...f, status: 'error', error: errorMessage, extractedData: undefined } : f)
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseExampleFile = () => {
        const exampleFile = createExampleFile();
        const newFile: UploadedFile = {
            id: `file-${Date.now()}`,
            file: exampleFile,
            status: 'pendiente',
        };
        setFiles([newFile]);
        setActiveFileId(newFile.id);
    };
    
    const handleReplay = (result: ExtractionResult) => {
        // Find if the file still exists in the current batch
        const originalFile = files.find(f => f.id === result.fileId);
        if (originalFile) {
            setActiveFileId(originalFile.id);
            setSchema(JSON.parse(JSON.stringify(result.schema))); // Deep copy schema
            // You might want to reuse the prompt as well if it were saved in history
        } else {
             alert(`El archivo original "${result.fileName}" ya no está en el lote actual. Cargue el archivo de nuevo para reutilizar esta extracción.`);
        }
    };

    const handleSelectTemplate = (template: Template) => {
        // Apply template schema and prompt
        setSchema(JSON.parse(JSON.stringify(template.schema))); // Deep copy schema
        setPrompt(template.prompt);
    };

    return (
        <div className="bg-slate-900 text-slate-300 min-h-screen font-sans">
            <header className="bg-slate-950/70 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-baseline gap-3">
                            <h1 className="text-3xl font-bold text-slate-100 font-orbitron tracking-wider">
                                verbadoc
                            </h1>
                            <p className="text-sm text-slate-400 font-sans">
                                trabajando para
                            </p>
                        </div>
                        <button
                            onClick={() => setIsApiKeyModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-sm transition-colors"
                            title="Configurar API Key"
                        >
                            <KeyIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">API Key</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" style={{height: 'calc(100vh - 112px)'}}>
                    <div className="lg:col-span-2 h-full">
                        <TemplatesPanel onSelectTemplate={handleSelectTemplate} />
                    </div>
                    <div className="lg:col-span-3 h-full">
                         <FileUploader
                            files={files}
                            setFiles={setFiles}
                            activeFileId={activeFileId}
                            onFileSelect={handleFileSelect}
                            onUseExample={handleUseExampleFile}
                        />
                    </div>
                    <div className="lg:col-span-5 h-full">
                        <ExtractionEditor
                            file={activeFile}
                            schema={schema}
                            setSchema={setSchema}
                            prompt={prompt}
                            setPrompt={setPrompt}
                            onExtract={handleExtract}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="lg:col-span-2 h-full">
                        <HistoryViewer history={history} onReplay={handleReplay} />
                    </div>
                </div>
            </main>

            <ApiKeyModal
                isOpen={isApiKeyModalOpen}
                onClose={() => setIsApiKeyModalOpen(false)}
            />
        </div>
    );
}

export default App;
