
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
import { PdfViewer } from './components/PdfViewer.tsx';
// Fix: Use explicit file extension in import.
import type { UploadedFile, ExtractionResult, SchemaField } from './types.ts';
import { setApiKey } from './services/geminiService.ts';

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
    const [viewingFile, setViewingFile] = useState<File | null>(null);
    const [apiKeyError, setApiKeyError] = useState<boolean>(false);

    // State for the editor, which can be reused across different files
    const [prompt, setPrompt] = useState<string>('Extrae la información clave del siguiente documento según el esquema JSON proporcionado.');
    const [schema, setSchema] = useState<SchemaField[]>([{ id: `field-${Date.now()}`, name: '', type: 'STRING' }]);

    // Set API key from environment variables on mount
    useEffect(() => {
        // En Vite, las variables de entorno se acceden via import.meta.env
        const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (envApiKey) {
            setApiKey(envApiKey);
            setApiKeyError(false);
        } else {
            console.error('VITE_GEMINI_API_KEY no está configurada en las variables de entorno.');
            setApiKeyError(true);
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

    const handleExtractAll = async () => {
        const pendingFiles = files.filter(f => f.status === 'pendiente' || f.status === 'error');
        if (pendingFiles.length === 0) return;

        // Lazy import the service
        const { extractDataFromDocument } = await import('./services/geminiService.ts');

        setIsLoading(true);

        for (const file of pendingFiles) {
            // Reset status for the current file
            setFiles(currentFiles =>
                currentFiles.map(f => f.id === file.id ? { ...f, status: 'procesando', error: undefined, extractedData: undefined } : f)
            );

            try {
                const extractedData = await extractDataFromDocument(file.file, schema, prompt);

                setFiles(currentFiles =>
                    currentFiles.map(f => f.id === file.id ? { ...f, status: 'completado', extractedData: extractedData, error: undefined } : f)
                );

                const newHistoryEntry: ExtractionResult = {
                    id: `hist-${Date.now()}-${file.id}`,
                    fileId: file.id,
                    fileName: file.file.name,
                    schema: JSON.parse(JSON.stringify(schema)), // Deep copy schema
                    extractedData: extractedData,
                    timestamp: new Date().toISOString(),
                };
                setHistory(currentHistory => [newHistoryEntry, ...currentHistory]);

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió.';
                setFiles(currentFiles =>
                    currentFiles.map(f => f.id === file.id ? { ...f, status: 'error', error: errorMessage, extractedData: undefined } : f)
                );
            }
        }

        setIsLoading(false);
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

    const handleViewFile = (file: File) => {
        setViewingFile(file);
    };

    const handleCloseViewer = () => {
        setViewingFile(null);
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
                    </div>
                </div>
            </header>

            {apiKeyError && (
                <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
                    <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="flex-grow">
                                <h3 className="text-red-300 font-semibold mb-2">Error de Configuración: API Key no encontrada</h3>
                                <p className="text-red-200/80 text-sm mb-3">
                                    La variable de entorno <code className="bg-red-950/50 px-2 py-0.5 rounded">VITE_GEMINI_API_KEY</code> no está configurada.
                                </p>
                                <div className="text-sm text-red-200/70">
                                    <p className="font-medium mb-1">Para configurarla en Vercel:</p>
                                    <ol className="list-decimal list-inside space-y-1 ml-2">
                                        <li>Ve a Settings → Environment Variables</li>
                                        <li>Agrega <code className="bg-red-950/50 px-1 rounded">VITE_GEMINI_API_KEY</code></li>
                                        <li>Obtén tu API key en <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-red-300 underline hover:text-red-200">Google AI Studio</a></li>
                                        <li>Redeploy la aplicación</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                            onExtractAll={handleExtractAll}
                            isLoading={isLoading}
                            onViewFile={handleViewFile}
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

            <PdfViewer
                file={viewingFile}
                onClose={handleCloseViewer}
            />
        </div>
    );
}

export default App;
