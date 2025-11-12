import React, { useState, useCallback, useRef } from 'react';
// Fix: Use explicit file extension in import.
import type { UploadedFile } from '../types.ts';
import { UploadCloudIcon, FileIcon, TrashIcon, CheckCircleIcon, ExclamationCircleIcon, SparklesIcon, EyeIcon } from './Icons';

interface FileUploaderProps {
    files: UploadedFile[];
    setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
    activeFileId: string | null;
    onFileSelect: (id: string | null) => void;
    onExtractAll?: () => void;
    isLoading?: boolean;
    onViewFile?: (file: File) => void;
    theme?: any;
    isLightMode?: boolean;
}

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const StatusIndicator = ({ status }: { status: UploadedFile['status'] }) => {
    switch (status) {
        case 'completado':
            return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
        case 'error':
            return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
        default:
            return null;
    }
};

export const FileUploader: React.FC<FileUploaderProps> = ({ files, setFiles, activeFileId, onFileSelect, onExtractAll, isLoading, onViewFile, theme, isLightMode }) => {
    const cardBg = isLightMode ? '#ffffff' : 'rgba(30, 41, 59, 0.5)';
    const borderColor = isLightMode ? '#dbeafe' : 'rgba(51, 65, 85, 0.5)';
    const textColor = isLightMode ? '#1e3a8a' : '#f1f5f9';
    const textSecondary = isLightMode ? '#475569' : '#94a3b8';
    const accentColor = isLightMode ? '#2563eb' : '#06b6d4';
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (fileList: FileList) => {
        const newFiles = Array.from(fileList).map(file => ({
            id: `file-${Date.now()}-${Math.random()}`,
            file,
            status: 'pendiente' as const,
        }));
        setFiles(currentFiles => [...currentFiles, ...newFiles]);
        if (!activeFileId && newFiles.length > 0) {
            onFileSelect(newFiles[0].id);
        }
    };

    const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };
    
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };
    
    const onRemoveFile = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updatedFiles = files.filter(f => f.id !== id);
        setFiles(updatedFiles);
        if (activeFileId === id) {
            onFileSelect(updatedFiles.length > 0 ? updatedFiles[0].id : null);
        }
    };
    
    const onClearAll = () => {
        setFiles([]);
        onFileSelect(null);
    }
    
    return (
        <div
            className="rounded-lg border p-4 md:p-6 flex flex-col h-full transition-colors duration-500"
            style={{
                backgroundColor: cardBg,
                borderColor: borderColor
            }}
        >
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold transition-colors duration-500" style={{ color: textColor }}>
                    Lote de Documentos
                </h2>
            </div>

            <div
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    borderColor: isDragging ? accentColor : (isLightMode ? '#93c5fd' : '#475569'),
                                    backgroundColor: isDragging ? (isLightMode ? '#eff6ff' : 'rgba(71, 85, 105, 0.5)') : 'transparent'
                                }}
                                className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:border-opacity-70"
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={onFileChange}
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png,.tiff,.txt,.json"
                                />
                                <UploadCloudIcon className="w-10 h-10 mb-2" style={{ color: isLightMode ? '#93c5fd' : '#94a3b8' }} />
                                <p className="text-center" style={{ color: textColor }}>
                                    <span className="font-semibold" style={{ color: accentColor }}>Haga clic para subir</span> o arrastre y suelte
                                </p>
                                <p className="text-xs text-center" style={{ color: textSecondary }}>PDF, JPG, PNG, TIFF, TXT, JSON (máx. 200MB/lote)</p>
                            </div>
                
                            {files.length > 0 && (
                                <div className="mt-4 flex flex-col flex-grow min-h-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-sm font-semibold" style={{ color: textColor }}>Archivos Cargados ({files.length})</h3>
                                        <div className="flex gap-2">
                                            {onExtractAll && (
                                                <button
                                                    onClick={onExtractAll}
                                                    disabled={isLoading || !files.some(f => f.status === 'pendiente' || f.status === 'error')}
                                                    className="text-xs px-3 py-1 text-white rounded-md transition-colors"
                                                    style={{
                                                        backgroundColor: isLoading || !files.some(f => f.status === 'pendiente' || f.status === 'error')
                                                            ? (isLightMode ? '#d1d5db' : '#334155')
                                                            : accentColor
                                                    }}
                                                >
                                                    {isLoading ? 'Procesando...' : 'Procesar Todos'}
                                                </button>
                                            )}
                                            <button onClick={onClearAll} className="text-xs transition-colors" style={{ color: isLightMode ? '#ef4444' : '#f87171' }}>Limpiar Todo</button>
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto pr-2 flex-grow">
                                        <ul className="space-y-2">
                                            {files.map(f => (
                                                <li key={f.id}>
                                                    <button
                                                        onClick={() => onFileSelect(f.id)}
                                                        className="w-full text-left p-2 rounded-md transition-all duration-200 border-l-4"
                                                        style={{
                                                            backgroundColor: activeFileId === f.id
                                                                ? (isLightMode ? '#dbeafe' : 'rgba(8, 145, 178, 0.2)')
                                                                : (isLightMode ? '#eff6ff' : 'rgba(51, 65, 85, 0.3)')
                                                            ,
                                                            borderLeftColor: activeFileId === f.id ? accentColor : 'transparent'
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <FileIcon className="w-6 h-6 flex-shrink-0" style={{ color: isLightMode ? '#93c5fd' : '#94a3b8' }} />
                                                                <div className="flex-grow min-w-0">
                                                                    <p className="text-sm font-medium truncate" style={{ color: textColor }}>{f.file.name}</p>
                                                                    <p className="text-xs" style={{ color: textSecondary }}>{formatBytes(f.file.size)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                                <StatusIndicator status={f.status} />
                                                                {onViewFile && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onViewFile(f.file);
                                                                        }}
                                                                        className="p-1 transition-colors rounded-full"
                                                                        style={{ color: textSecondary }}
                                                                        title="Ver documento"
                                                                    >
                                                                        <EyeIcon className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={(e) => onRemoveFile(f.id, e)}
                                                                    className="p-1 transition-colors rounded-full"
                                                                    style={{ color: textSecondary }}
                                                                >
                                                                    <TrashIcon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
        </div>
    );
};