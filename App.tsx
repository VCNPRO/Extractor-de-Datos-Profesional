
import React, { useState, useMemo, useEffect } from 'react';
// Fix: Use explicit file extension in import.
import { FileUploader } from './components/FileUploader.tsx';
// Fix: Use explicit file extension in import.
import { ExtractionEditor } from './components/ExtractionEditor.tsx';
// Fix: Use explicit file extension in import.
import { HistoryViewer } from './components/HistoryViewer.tsx';
// Fix: Use explicit file extension in import.
import { TemplatesPanel } from './components/TemplatesPanel.tsx';
// Fix: Use explicit file extension in import.
import { PdfViewer } from './components/PdfViewer.tsx';
// Fix: Use explicit file extension in import.
import { HelpModal } from './components/HelpModal.tsx';
// Fix: Use explicit file extension in import.
import type { UploadedFile, ExtractionResult, SchemaField, Sector } from './types.ts';
import { setApiKey } from './services/geminiService.ts';
import { getSectorById, getDefaultTheme } from './utils/sectorsConfig.ts';

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
    const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
    const [currentSector, setCurrentSector] = useState<Sector>('general');

    // State for the editor, which can be reused across different files
    const [prompt, setPrompt] = useState<string>('Extrae la información clave del siguiente documento según el esquema JSON proporcionado.');
    const [schema, setSchema] = useState<SchemaField[]>([{ id: `field-${Date.now()}`, name: '', type: 'STRING' }]);

    // Obtener el tema basado en el sector actual
    const currentTheme = useMemo(() => {
        const sectorInfo = getSectorById(currentSector);
        return sectorInfo?.theme || getDefaultTheme();
    }, [currentSector]);

    // Determinar si estamos en modo salud
    const isHealthMode = currentSector === 'salud';

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
    
    const handleExtract = async (modelId?: string) => {
        if (!activeFile) return;

        // Lazy import the service
        const { extractDataFromDocument } = await import('./services/geminiService.ts');

        setIsLoading(true);
        // Reset status for the current file
        setFiles(currentFiles =>
            currentFiles.map(f => f.id === activeFile.id ? { ...f, status: 'procesando', error: undefined, extractedData: undefined } : f)
        );

        try {
            const extractedData = await extractDataFromDocument(activeFile.file, schema, prompt, modelId as any);

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

    const handleExtractAll = async (modelId?: string) => {
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
                const extractedData = await extractDataFromDocument(file.file, schema, prompt, modelId as any);

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

    const handleSelectTemplate = (template: any) => {
        const isHealthTemplate = 'secciones' in template;

        if (isHealthTemplate) {
            const newSchema: SchemaField[] = template.secciones.flatMap((seccion: any) =>
                seccion.campos.map((campo: any) => {
                    let type: SchemaFieldType = 'STRING';
                    switch (campo.tipo_dato) {
                        case 'numero':
                            type = 'NUMBER';
                            break;
                        case 'multiseleccion':
                            type = 'ARRAY_OF_STRINGS';
                            break;
                        case 'tabla':
                            type = 'ARRAY_OF_OBJECTS';
                            break;
                        default:
                            type = 'STRING';
                    }
                    return {
                        id: `field-${campo.nombre_campo}-${Date.now()}`,
                        name: campo.etiqueta,
                        type: type,
                    };
                })
            );
            setSchema(newSchema);
            setPrompt('Extrae la información clave del siguiente documento de salud.');
        } else {
            setSchema(JSON.parse(JSON.stringify(template.schema)));
            setPrompt(template.prompt);
        }

        if (template.sector) {
            setCurrentSector(template.sector);
        }
    };

    const handleSectorChange = (sector: Sector) => {
        setCurrentSector(sector);
    };

    const handleViewFile = (file: File) => {
        setViewingFile(file);
    };

    const handleCloseViewer = () => {
        setViewingFile(null);
    };

    return (
        <div
            className="min-h-screen font-sans transition-colors duration-500"
            style={{
                backgroundColor: isHealthMode ? currentTheme.background : '#0f172a',
                color: isHealthMode ? currentTheme.text : '#e2e8f0'
            }}
        >
            <header
                className="backdrop-blur-sm border-b-2 sticky top-0 z-10 transition-colors duration-500 shadow-md"
                style={{
                    backgroundColor: isHealthMode ? '#ffffff' : 'rgba(2, 6, 23, 0.7)',
                    borderBottomColor: isHealthMode ? '#6ee7b7' : 'rgba(51, 65, 85, 0.5)'
                }}
            >
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-baseline gap-3">
                            <h1
                                className="text-3xl font-bold font-orbitron tracking-wider transition-colors duration-500"
                                style={{
                                    color: isHealthMode ? '#047857' : '#f1f5f9'
                                }}
                            >
                                verbadoc
                            </h1>
                            <p
                                className="text-sm font-sans transition-colors duration-500"
                                style={{
                                    color: isHealthMode ? '#064e3b' : '#94a3b8'
                                }}
                            >
                                trabajando para {isHealthMode && <span className="font-bold px-2 py-1 bg-green-100 text-green-800 rounded-md">🏥 Sector Salud</span>}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsHelpModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg text-sm transition-all duration-500 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                            style={{
                                backgroundColor: isHealthMode ? '#047857' : '#0891b2',
                                borderColor: isHealthMode ? '#059669' : '#06b6d4',
                                color: '#ffffff'
                            }}
                            title="Ayuda y Guía de Usuario"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="hidden sm:inline">Ayuda</span>
                        </button>
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
                        <TemplatesPanel
                            onSelectTemplate={handleSelectTemplate}
                            currentSchema={schema}
                            currentPrompt={prompt}
                            onSectorChange={handleSectorChange}
                            currentSector={currentSector}
                            theme={currentTheme}
                            isHealthMode={isHealthMode}
                        />
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
                            theme={currentTheme}
                            isHealthMode={isHealthMode}
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
                            theme={currentTheme}
                            isHealthMode={isHealthMode}
                        />
                    </div>
                    <div className="lg:col-span-2 h-full">
                        <HistoryViewer
                            history={history}
                            onReplay={handleReplay}
                            theme={currentTheme}
                            isHealthMode={isHealthMode}
                        />
                    </div>
                </div>
            </main>

            <PdfViewer
                file={viewingFile}
                onClose={handleCloseViewer}
            />

            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
            />
        </div>
    );
}

export default App;
