import React, { useState } from 'react';
import type { ExtractionResult } from '../types.ts';
import { JsonViewer } from './JsonViewer.tsx';
import { downloadExcel, downloadCSV } from '../utils/exportUtils.ts';

interface ResultsViewerProps {
    results: ExtractionResult[];
    theme?: any;
    isLightMode?: boolean;
    onClose?: () => void;
    onClearHistory?: () => void;
    onExportHistory?: () => void;
    onExportExcel?: () => void;
    onImportHistory?: () => void;
}

export const ResultsViewer: React.FC<ResultsViewerProps> = ({
    results,
    theme,
    isLightMode,
    onClose,
    onClearHistory,
    onExportHistory,
    onExportExcel,
    onImportHistory
}) => {
    const [selectedResult, setSelectedResult] = useState<ExtractionResult | null>(
        results.length > 0 ? results[0] : null
    );

    const cardBg = isLightMode ? '#ffffff' : 'rgba(30, 41, 59, 0.5)';
    const borderColor = isLightMode ? '#dbeafe' : 'rgba(51, 65, 85, 0.5)';
    const textColor = isLightMode ? '#1e3a8a' : '#f1f5f9';
    const textSecondary = isLightMode ? '#475569' : '#94a3b8';
    const accentColor = isLightMode ? '#2563eb' : '#06b6d4';
    const headerBg = isLightMode ? '#eff6ff' : 'rgba(2, 6, 23, 0.5)';

    const handleDownloadJSON = () => {
        if (!selectedResult) return;

        const dataStr = JSON.stringify(selectedResult.extractedData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedResult.fileName.replace(/\.[^/.]+$/, '')}_extraccion.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadCSV = () => {
        if (!selectedResult) return;
        downloadCSV(
            selectedResult.extractedData,
            `${selectedResult.fileName.replace(/\.[^/.]+$/, '')}_extraccion`,
            selectedResult.schema
        );
    };

    const handleDownloadExcel = () => {
        if (!selectedResult) return;
        downloadExcel(
            selectedResult.extractedData,
            `${selectedResult.fileName.replace(/\.[^/.]+$/, '')}_extraccion`,
            selectedResult.schema
        );
    };

    const handleCopyToClipboard = () => {
        if (!selectedResult) return;

        const dataStr = JSON.stringify(selectedResult.extractedData, null, 2);
        navigator.clipboard.writeText(dataStr);
        alert('Datos copiados al portapapeles');
    };

    if (results.length === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center h-full rounded-lg border p-6 text-center transition-colors duration-500"
                style={{
                    backgroundColor: cardBg,
                    borderColor: borderColor
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: textSecondary }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold" style={{ color: textColor }}>Sin Resultados</h3>
                <p className="max-w-sm mx-auto mt-1" style={{ color: textSecondary }}>
                    Los resultados de las extracciones aparecerán aquí.
                </p>
            </div>
        );
    }

    return (
        <div
            className="rounded-lg border flex flex-col h-full transition-colors duration-500"
            style={{
                backgroundColor: cardBg,
                borderColor: borderColor
            }}
        >
            {/* Header */}
            <div
                className="p-4 border-b transition-colors duration-500"
                style={{
                    backgroundColor: headerBg,
                    borderBottomColor: borderColor
                }}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: textColor }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: accentColor }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Resultados
                    </h2>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 rounded transition-colors hover:opacity-80"
                            style={{ color: textSecondary }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Selector de resultado */}
                {results.length > 1 && (
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>
                            Seleccionar extracción:
                        </label>
                        <select
                            value={selectedResult?.id || ''}
                            onChange={(e) => {
                                const result = results.find(r => r.id === e.target.value);
                                if (result) setSelectedResult(result);
                            }}
                            className="w-full rounded-md p-2 text-sm transition-colors"
                            style={{
                                backgroundColor: isLightMode ? '#ffffff' : '#1e293b',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: borderColor,
                                color: textColor
                            }}
                        >
                            {results.map(result => (
                                <option key={result.id} value={result.id}>
                                    {result.fileName} - {new Date(result.timestamp).toLocaleString()}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Gestión de Historial */}
                {(onClearHistory || onExportHistory || onImportHistory) && (
                    <div
                        className="p-3 rounded-lg border transition-colors"
                        style={{
                            backgroundColor: isLightMode ? '#eff6ff' : 'rgba(55, 65, 81, 0.5)',
                            borderColor: borderColor
                        }}
                    >
                        <h3 className="text-sm font-semibold mb-2" style={{ color: textColor }}>
                            📂 Gestión de Historial ({results.length} extracciones)
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {onExportHistory && (
                                <button
                                    onClick={onExportHistory}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:opacity-90"
                                    style={{
                                        backgroundColor: isLightMode ? '#10b981' : '#059669',
                                        color: '#ffffff'
                                    }}
                                    title="Descargar historial completo como JSON"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Exportar JSON
                                </button>
                            )}
                            {onExportExcel && (
                                <button
                                    onClick={onExportExcel}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:opacity-90"
                                    style={{
                                        backgroundColor: isLightMode ? '#059669' : '#047857',
                                        color: '#ffffff'
                                    }}
                                    title="Descargar historial completo como Excel"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Exportar Excel
                                </button>
                            )}
                            {onImportHistory && (
                                <button
                                    onClick={onImportHistory}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:opacity-90"
                                    style={{
                                        backgroundColor: isLightMode ? '#2563eb' : '#1d4ed8',
                                        color: '#ffffff'
                                    }}
                                    title="Importar historial desde archivo JSON"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Importar
                                </button>
                            )}
                            {onClearHistory && (
                                <button
                                    onClick={onClearHistory}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:opacity-90"
                                    style={{
                                        backgroundColor: isLightMode ? '#ef4444' : '#dc2626',
                                        color: '#ffffff'
                                    }}
                                    title="Eliminar todo el historial (no se puede deshacer)"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Limpiar
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {selectedResult && (
                    <>
                        {/* Info del archivo */}
                        <div
                            className="p-3 rounded-lg border transition-colors"
                            style={{
                                backgroundColor: isLightMode ? '#f0fdf4' : 'rgba(15, 23, 42, 0.5)',
                                borderColor: borderColor
                            }}
                        >
                            <p className="text-sm font-semibold" style={{ color: textColor }}>
                                {selectedResult.fileName}
                            </p>
                            <p className="text-xs mt-1" style={{ color: textSecondary }}>
                                Extraído el {new Date(selectedResult.timestamp).toLocaleString()}
                            </p>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleDownloadJSON}
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all hover:opacity-90"
                                style={{
                                    backgroundColor: isLightMode ? '#047857' : '#06b6d4',
                                    color: '#ffffff'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Descargar JSON
                            </button>
                            <button
                                onClick={handleDownloadCSV}
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all hover:opacity-90"
                                style={{
                                    backgroundColor: isLightMode ? '#059669' : '#0891b2',
                                    color: '#ffffff'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Descargar CSV
                            </button>
                            <button
                                onClick={handleDownloadExcel}
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all hover:opacity-90"
                                style={{
                                    backgroundColor: isLightMode ? '#10b981' : '#0e7490',
                                    color: '#ffffff'
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Descargar Excel
                            </button>
                            <button
                                onClick={handleCopyToClipboard}
                                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all hover:opacity-90"
                                style={{
                                    backgroundColor: isLightMode ? '#6ee7b7' : 'rgba(100, 116, 139, 0.5)',
                                    color: isLightMode ? '#064e3b' : '#f1f5f9',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: borderColor
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copiar
                            </button>
                        </div>

                        {/* Visualizador de datos */}
                        <div>
                            <h3 className="text-sm font-semibold mb-2" style={{ color: textColor }}>
                                Datos Extraídos:
                            </h3>
                            <div
                                className="p-4 rounded-lg border transition-colors overflow-x-auto"
                                style={{
                                    backgroundColor: isLightMode ? '#f9fafb' : 'rgba(15, 23, 42, 0.5)',
                                    borderColor: borderColor
                                }}
                            >
                                <JsonViewer data={selectedResult.extractedData} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
