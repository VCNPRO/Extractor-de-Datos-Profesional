import React, { useState, useEffect } from 'react';
import { setApiKey, getApiKey } from '../services/geminiService.ts';

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
    const [apiKey, setApiKeyInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Load API key from localStorage on mount
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            setApiKeyInput(savedKey);
            setApiKey(savedKey);
        }
    }, []);

    const handleSave = () => {
        if (!apiKey.trim()) {
            setError('Por favor ingresa una API Key válida');
            return;
        }

        // Save to localStorage
        localStorage.setItem('gemini_api_key', apiKey.trim());

        // Set in service
        setApiKey(apiKey.trim());

        setError('');
        onClose();
    };

    const handleGetKey = () => {
        window.open('https://aistudio.google.com/apikey', '_blank');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-md w-full p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-slate-100 mb-4">
                    Configurar API Key de Gemini
                </h2>

                <p className="text-sm text-slate-400 mb-4">
                    Para usar la extracción de datos, necesitas una API Key de Google AI Studio.
                </p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-2">
                            API Key
                        </label>
                        <input
                            id="apiKey"
                            type="password"
                            value={apiKey}
                            onChange={(e) => {
                                setApiKeyInput(e.target.value);
                                setError('');
                            }}
                            placeholder="AIza..."
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-400">{error}</p>
                        )}
                    </div>

                    <button
                        onClick={handleGetKey}
                        className="w-full text-sm text-blue-400 hover:text-blue-300 underline text-left"
                    >
                        ¿No tienes una API Key? Obtén una gratis aquí
                    </button>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Guardar
                        </button>
                        {getApiKey() && (
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <p className="text-xs text-slate-400">
                        <strong className="text-slate-300">Nota:</strong> Tu API Key se guarda localmente en tu navegador y nunca se comparte con terceros.
                    </p>
                </div>
            </div>
        </div>
    );
}
