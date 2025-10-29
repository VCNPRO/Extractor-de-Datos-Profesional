
import React from 'react';
// Fix: Use explicit file extension in import.
import type { ExtractionResult } from '../types.ts';
// Fix: Use explicit file extension in import.
import { HistoryIcon } from './Icons.tsx';
// Fix: Use explicit file extension in import.
import { JsonViewer } from './JsonViewer.tsx';

interface HistoryViewerProps {
    history: ExtractionResult[];
    onReplay: (result: ExtractionResult) => void;
}

export const HistoryViewer: React.FC<HistoryViewerProps> = ({ history, onReplay }) => {
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-800/50 rounded-lg border border-slate-700/50 p-6 text-center">
                <HistoryIcon className="w-16 h-16 text-slate-600 mb-4" />
                <h3 className="text-xl font-semibold text-slate-300">Historial Vacío</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-1">
                    Las extracciones que complete aparecerán aquí para que pueda revisarlas y reutilizarlas.
                </p>
            </div>
        );
    }
    
    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 flex flex-col h-full">
            <div className="p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <HistoryIcon className="w-6 h-6" />
                    Historial de Extracciones
                </h2>
            </div>
            <div className="overflow-y-auto flex-grow">
                <ul className="divide-y divide-slate-700/50">
                    {history.map(item => (
                        <li key={item.id} className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-cyan-400">{item.fileName}</p>
                                    <p className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => onReplay(item)}
                                    className="text-xs text-slate-300 hover:text-white bg-slate-600 hover:bg-slate-500 px-2 py-1 rounded-md transition-colors"
                                >
                                    Reutilizar
                                </button>
                            </div>
                            <div className="mt-3 bg-slate-900/50 p-3 rounded-md max-h-60 overflow-y-auto">
                                <JsonViewer data={item.extractedData} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
