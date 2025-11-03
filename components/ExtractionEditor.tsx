
import React, { useEffect, useState, useMemo } from 'react';
// Fix: Use explicit file extension in import.
import type { UploadedFile, SchemaField } from '../types.ts';
// Fix: Use explicit file extension in import.
import { SchemaBuilder } from './SchemaBuilder.tsx';
// Fix: Use explicit file extension in import.
import { ImageSearchPanel } from './ImageSearchPanel.tsx';
// Fix: Use explicit file extension in import.
import { CubeIcon, ExclamationTriangleIcon, SparklesIcon } from './Icons.tsx';
import { downloadCSV, downloadExcel, downloadJSON, downloadPDF, generatePDFPreviewURL } from '../utils/exportUtils.ts';
import { AVAILABLE_MODELS, type GeminiModel, searchImageInDocument } from '../services/geminiService.ts';

interface ExtractionEditorProps {
    file: UploadedFile | undefined;
    schema: SchemaField[];
    setSchema: React.Dispatch<React.SetStateAction<SchemaField[]>>;
    prompt: string;
    setPrompt: React.Dispatch<React.SetStateAction<string>>;
    onExtract: (modelId?: GeminiModel) => void;
    isLoading: boolean;
}

// Example prompt
const EXAMPLE_PROMPT = `
Extraer la siguiente información del documento:
- Nombre completo del cliente
- Fecha de la factura
- Lista de artículos comprados, incluyendo nombre del artículo y precio
- Total de la factura
`;

// Example schema corresponding to the prompt
const EXAMPLE_SCHEMA: SchemaField[] = [
    { id: 'f1', name: 'nombre_cliente', type: 'STRING' },
    { id: 'f2', name: 'fecha_factura', type: 'STRING' },
    { id: 'f3', name: 'articulos', type: 'ARRAY_OF_OBJECTS', children: [
        { id: 'f3_1', name: 'descripcion', type: 'STRING' },
        { id: 'f3_2', name: 'precio', type: 'NUMBER' },
    ]},
    { id: 'f4', name: 'total', type: 'NUMBER' },
];


export const ExtractionEditor: React.FC<ExtractionEditorProps> = ({ file, schema, setSchema, prompt, setPrompt, onExtract, isLoading }) => {
    const [pdfPreviewURL, setPdfPreviewURL] = useState<string | null>(null);
    const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-2.5-flash');
    const [isSearchingImage, setIsSearchingImage] = useState(false);
    const [imageSearchResult, setImageSearchResult] = useState<any>(null);
    const [showImageSearch, setShowImageSearch] = useState(false);

    // When the active file changes, clear previous results.
    // The schema and prompt are managed by App.tsx so they persist.
    useEffect(() => {
        // Cleanup previous PDF URL
        if (pdfPreviewURL) {
            URL.revokeObjectURL(pdfPreviewURL);
            setPdfPreviewURL(null);
        }
    }, [file?.id]);

    // Generate PDF preview when extracted data changes
    useEffect(() => {
        if (file?.extractedData && !file.error) {
            const url = generatePDFPreviewURL(file.extractedData, file.file.name.replace(/\.[^/.]+$/, ""));
            setPdfPreviewURL(url);

            // Cleanup on unmount or when data changes
            return () => {
                if (url) {
                    URL.revokeObjectURL(url);
                }
            };
        }
    }, [file?.extractedData, file?.error]);

    const handleImageSearch = async (referenceImage: File, modelId: GeminiModel) => {
        if (!file) return;

        setIsSearchingImage(true);
        setImageSearchResult(null);

        try {
            const result = await searchImageInDocument(file.file, referenceImage, modelId);
            setImageSearchResult(result);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setImageSearchResult({
                found: false,
                description: `Error: ${errorMessage}`
            });
        } finally {
            setIsSearchingImage(false);
        }
    };

    const useExample = () => {
        setPrompt(EXAMPLE_PROMPT.trim());
        // Deep copy example schema with new IDs to avoid state mutation issues
        const newSchema = JSON.parse(JSON.stringify(EXAMPLE_SCHEMA)).map((field: SchemaField, i: number) => ({
             ...field,
             id: `field-${Date.now()}-${i}`,
             children: field.children?.map((child: SchemaField, j: number) => ({
                 ...child,
                 id: `field-${Date.now()}-${i}-${j}`
             }))
        }));
        setSchema(newSchema);
    };

    if (!file) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 text-center">
                <CubeIcon className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-300">Seleccione un archivo</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-1">
                    Elija un documento del lote de la izquierda para comenzar a definir su esquema de extracción y ver los resultados.
                </p>
            </div>
        );
    }
    
    const hasSchemaErrors = schema.some(field => field.error || (field.children && field.children.some(child => child.error)));

    return (
        <div className="flex flex-col h-full bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="p-4 md:p-6 border-b border-slate-700/50">
                <h2 className="text-lg font-semibold text-slate-100 mb-1">Editor de Extracción: <span className="font-normal text-cyan-400">{file.file.name}</span></h2>
                <p className="text-sm text-slate-400">Defina la estructura de datos que desea extraer del documento.</p>
            </div>

            <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="prompt" className="block text-base font-medium text-slate-200">
                            1. Prompt (Instrucción)
                        </label>
                         <button
                            onClick={useExample}
                            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                        >
                            <SparklesIcon className="w-4 h-4" />
                            Usar Ejemplo
                        </button>
                    </div>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-sm text-slate-300"
                        placeholder="Ej: Extrae los detalles de la factura del documento."
                    />
                </div>

                <div>
                    <label htmlFor="model-select" className="block text-base font-medium text-slate-200 mb-2">
                        2. Modelo de IA
                    </label>
                    <select
                        id="model-select"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value as GeminiModel)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-sm text-slate-300"
                    >
                        {AVAILABLE_MODELS.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name} - {model.bestFor}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-400 mt-1">
                        {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.description}
                    </p>
                </div>

                <div>
                    <h3 className="text-base font-medium text-slate-200 mb-2">3. Definición del Esquema JSON</h3>
                    <SchemaBuilder schema={schema} setSchema={setSchema} />
                </div>

                {/* Búsqueda de imágenes - sección colapsable */}
                <div className="border-t border-slate-700/50 pt-4">
                    <button
                        onClick={() => setShowImageSearch(!showImageSearch)}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <h3 className="text-base font-medium text-slate-200 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            4. Búsqueda de Imágenes/Logos (Opcional)
                        </h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 text-slate-400 transition-transform ${showImageSearch ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {showImageSearch && (
                        <>
                            <ImageSearchPanel
                                file={file}
                                onSearch={handleImageSearch}
                                isSearching={isSearchingImage}
                            />

                            {/* Mostrar resultado de búsqueda */}
                            {imageSearchResult && (
                                <div className={`mt-4 p-4 rounded-lg border ${imageSearchResult.found ? 'bg-green-900/20 border-green-700/50' : 'bg-slate-800/50 border-slate-600'}`}>
                                    <div className="flex items-start gap-3">
                                        {imageSearchResult.found ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-slate-200 mb-1">
                                                {imageSearchResult.found ? '✓ Imagen encontrada' : 'Imagen no encontrada'}
                                            </h4>
                                            <p className="text-sm text-slate-300 mb-2">{imageSearchResult.description}</p>
                                            {imageSearchResult.location && (
                                                <p className="text-xs text-slate-400">
                                                    <span className="font-medium">Ubicación:</span> {imageSearchResult.location}
                                                </p>
                                            )}
                                            {imageSearchResult.confidence && (
                                                <p className="text-xs text-slate-400">
                                                    <span className="font-medium">Confianza:</span> {imageSearchResult.confidence}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="p-4 md:p-6 border-t border-slate-700/50 bg-slate-800/80">
                <button
                    onClick={() => onExtract(selectedModel)}
                    disabled={isLoading || !file || hasSchemaErrors || schema.length === 0}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Extrayendo Datos con {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}...
                        </>
                    ) : (
                        `Ejecutar Extracción con ${AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}`
                    )}
                </button>
                {hasSchemaErrors && (
                    <p className="text-xs text-red-400 mt-2 text-center flex items-center justify-center gap-1">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        Corrija los errores en los nombres de los campos del esquema para continuar.
                    </p>
                )}
            </div>

            {file.extractedData && !file.error && (
                 <div className="border-t border-slate-700/50">
                    <div className="flex justify-between items-center p-4 md:p-6 pb-2">
                        <h3 className="text-base font-medium text-slate-200">Resultados Extraídos (Vista PDF)</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => downloadPDF(file.extractedData!, file.file.name.replace(/\.[^/.]+$/, ""))}
                                className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors flex items-center gap-1"
                                title="Descargar PDF"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                PDF
                            </button>
                            <button
                                onClick={() => downloadJSON(file.extractedData!, file.file.name.replace(/\.[^/.]+$/, ""))}
                                className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-1"
                                title="Descargar JSON"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                JSON
                            </button>
                            <button
                                onClick={() => downloadCSV(file.extractedData!, file.file.name.replace(/\.[^/.]+$/, ""))}
                                className="text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-1"
                                title="Descargar CSV"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                CSV
                            </button>
                            <button
                                onClick={() => downloadExcel(file.extractedData!, file.file.name.replace(/\.[^/.]+$/, ""))}
                                className="text-xs px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors flex items-center gap-1"
                                title="Descargar Excel"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Excel
                            </button>
                        </div>
                    </div>
                    <div className="p-4 md:p-6 pt-0 bg-slate-900/50">
                        {pdfPreviewURL ? (
                            <iframe
                                src={pdfPreviewURL}
                                className="w-full h-96 border border-slate-600 rounded-md"
                                title="Vista previa del PDF"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-96 text-slate-400">
                                Generando vista previa del PDF...
                            </div>
                        )}
                    </div>
                </div>
            )}
             {file.error && (
                <div className="border-t border-slate-700/50 p-4 md:p-6">
                    <h3 className="text-base font-medium text-red-400 mb-2">Error de Extracción</h3>
                    <p className="text-sm bg-red-900/30 p-3 rounded-md text-red-300">{file.error}</p>
                </div>
            )}
        </div>
    );
};
