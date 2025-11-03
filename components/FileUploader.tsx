
import React, { useState, useCallback, useRef } from 'react';
// Fix: Use explicit file extension in import.
import type { UploadedFile } from '../types.ts';
import { UploadCloudIcon, FileIcon, TrashIcon, CheckCircleIcon, ExclamationCircleIcon, SparklesIcon, EyeIcon } from './Icons';

interface FileUploaderProps {
    files: UploadedFile[];
    setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
    activeFileId: string | null;
    onFileSelect: (id: string | null) => void;
    onUseExample: () => void;
    onExtractAll?: () => void;
    isLoading?: boolean;
    onViewFile?: (file: File) => void;
    theme?: any;
    isHealthMode?: boolean;
}

const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const StatusIndicator: React.FC<{ status: UploadedFile['status'] }> = ({ status }) => {
    switch(status) {
        case 'completado':
            return <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircleIcon className="w-4 h-4" /> Completado</span>;
        case 'error':
            return <span className="flex items-center gap-1 text-xs text-red-400"><ExclamationCircleIcon className="w-4 h-4" /> Error</span>;
        case 'procesando':
            return <span className="flex items-center gap-1 text-xs text-cyan-400"><div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div> Procesando</span>;
        default:
            return <span className="text-xs text-slate-400">Pendiente</span>;
    }
}

export const FileUploader: React.FC<FileUploaderProps> = ({ files, setFiles, activeFileId, onFileSelect, onUseExample, onExtractAll, isLoading, onViewFile, theme, isHealthMode }) => {
    const cardBg = isHealthMode ? '#ffffff' : 'rgba(30, 41, 59, 0.5)';
    const borderColor = isHealthMode ? theme?.border || '#6ee7b7' : 'rgba(51, 65, 85, 0.5)';
    const textColor = isHealthMode ? theme?.text || '#064e3b' : '#f1f5f9';
    const textSecondary = isHealthMode ? theme?.textSecondary || '#065f46' : '#94a3b8';
    const accentColor = isHealthMode ? theme?.primary || '#047857' : '#06b6d4';
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
                <button
                    onClick={onUseExample}
                    className="text-sm hover:opacity-80 transition-all flex items-center gap-1 font-medium"
                    style={{ color: accentColor }}
                >
                    <SparklesIcon className="w-4 h-4" />
                    Usar Ejemplo
                </button>
            </div>

            <div
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    isHealthMode
                        ? isDragging ? 'border-green-400 bg-green-100/50' : 'border-green-300 hover:border-green-400'
                        : isDragging ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500'
                }`}            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={onFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.tiff,.txt"
                />
                <UploadCloudIcon className="w-10 h-10 text-slate-400 mb-2" />
                <p className="text-slate-300 text-center">
                    <span className="font-semibold text-cyan-400">Haga clic para subir</span> o arrastre y suelte
                </p>
                <p className="text-xs text-slate-500 text-center">PDF, JPG, PNG, TIFF, TXT (máx. 200MB/lote)</p>
            </div>

            {files.length > 0 && (
                <div className="mt-4 flex flex-col flex-grow min-h-0">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-slate-300">Archivos Cargados ({files.length})</h3>
                        <div className="flex gap-2">
                            {onExtractAll && (
                                <button
                                    onClick={onExtractAll}
                                    disabled={isLoading || !files.some(f => f.status === 'pendiente' || f.status === 'error')}
                                    className="text-xs px-3 py-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-md transition-colors"
                                >
                                    {isLoading ? 'Procesando...' : 'Procesar Todos'}
                                </button>
                            )}
                            <button onClick={onClearAll} className="text-xs text-red-400 hover:text-red-300 transition-colors">Limpiar Todo</button>
                        </div>
                    </div>
                    <div className="overflow-y-auto pr-2 flex-grow">
                        <ul className="space-y-2">
                            {files.map(f => (
                                <li key={f.id}>
                                    <button 
                                        onClick={() => onFileSelect(f.id)}
                                        className={`w-full text-left p-2 rounded-md transition-all duration-200 border-l-4 ${
                                            isHealthMode
                                                ? activeFileId === f.id ? 'bg-green-200/50 border-green-500' : 'bg-green-100/30 border-transparent hover:bg-green-100/60'
                                                : activeFileId === f.id ? 'bg-cyan-900/50 border-cyan-400' : 'bg-slate-700/30 border-transparent hover:bg-slate-700/60'
                                        }`}                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <FileIcon className="w-6 h-6 text-slate-400 flex-shrink-0" />
                                                <div className="flex-grow min-w-0">
                                                    <p className="text-sm font-medium text-slate-200 truncate">{f.file.name}</p>
                                                    <p className="text-xs text-slate-400">{formatBytes(f.file.size)}</p>
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
                                                        className="p-1 text-slate-500 hover:text-cyan-400 transition-colors rounded-full"
                                                        title="Ver documento"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button onClick={(e) => onRemoveFile(f.id, e)} className="p-1 text-slate-500 hover:text-red-400 transition-colors rounded-full">
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