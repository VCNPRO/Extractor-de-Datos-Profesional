import React from 'react';
import { XIcon, InformationCircleIcon } from './Icons';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <InformationCircleIcon className="w-8 h-8 text-cyan-400" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100">
                                Guía Rápida
                            </h2>
                            <p className="text-sm text-slate-400">Aprende a usar el Extractor de Datos</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Cerrar"
                    >
                        <XIcon className="w-6 h-6 text-slate-300" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {/* Paso 1 */}
                    <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-white">
                                1
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Subir Documentos</h3>
                                <p className="text-slate-300 text-sm mb-3">
                                    Arrastra tus archivos (PDF, imágenes) a la zona de carga o haz clic para seleccionarlos.
                                </p>
                                <div className="bg-slate-800/50 p-3 rounded border border-slate-700/30">
                                    <p className="text-xs text-slate-400">
                                        <strong className="text-cyan-300">💡 Tip:</strong> Puedes subir múltiples archivos a la vez si son del mismo tipo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Paso 2 */}
                    <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-white">
                                2
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Escribir el Prompt</h3>
                                <p className="text-slate-300 text-sm mb-3">
                                    El <strong>prompt</strong> es la instrucción que le das a la IA. Sé específico sobre qué información quieres extraer.
                                </p>
                                <div className="bg-slate-800/50 p-3 rounded border border-green-700/30">
                                    <p className="text-xs text-green-300 mb-1"><strong>✅ Ejemplo bueno:</strong></p>
                                    <code className="text-xs text-slate-300">
                                        "Extrae el nombre del cliente, fecha de factura, lista de productos y total"
                                    </code>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded border border-red-700/30 mt-2">
                                    <p className="text-xs text-red-300 mb-1"><strong>❌ Ejemplo malo:</strong></p>
                                    <code className="text-xs text-slate-300">
                                        "Dame todo"
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Paso 3 */}
                    <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-white">
                                3
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Definir el Esquema</h3>
                                <p className="text-slate-300 text-sm mb-3">
                                    El <strong>esquema</strong> es la estructura de los datos que quieres extraer.
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-slate-800/50 p-2 rounded border border-slate-700/30">
                                        <code className="text-blue-400">STRING</code>
                                        <p className="text-slate-400 mt-1">Texto (nombre, dirección)</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-2 rounded border border-slate-700/30">
                                        <code className="text-green-400">NUMBER</code>
                                        <p className="text-slate-400 mt-1">Números (precio, cantidad)</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-2 rounded border border-slate-700/30">
                                        <code className="text-purple-400">BOOLEAN</code>
                                        <p className="text-slate-400 mt-1">Sí/No (¿pagado?)</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-2 rounded border border-slate-700/30">
                                        <code className="text-amber-400">ARRAY</code>
                                        <p className="text-slate-400 mt-1">Listas (productos)</p>
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded border border-slate-700/30 mt-3">
                                    <p className="text-xs text-slate-400">
                                        <strong className="text-cyan-300">💡 Tip:</strong> Usa nombres sin espacios: <code className="text-cyan-300">nombre_cliente</code> en vez de "Nombre del Cliente"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Paso 4 */}
                    <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-white">
                                4
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Ejecutar y Exportar</h3>
                                <p className="text-slate-300 text-sm mb-3">
                                    Haz clic en <strong>"Ejecutar Extracción"</strong> y espera los resultados.
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                    <div className="bg-blue-900/30 border border-blue-700/50 rounded px-3 py-2">
                                        <p className="text-xs text-blue-300 font-semibold">JSON</p>
                                        <p className="text-xs text-slate-400">Para sistemas</p>
                                    </div>
                                    <div className="bg-green-900/30 border border-green-700/50 rounded px-3 py-2">
                                        <p className="text-xs text-green-300 font-semibold">CSV</p>
                                        <p className="text-xs text-slate-400">Para Excel/Sheets</p>
                                    </div>
                                    <div className="bg-emerald-900/30 border border-emerald-700/50 rounded px-3 py-2">
                                        <p className="text-xs text-emerald-300 font-semibold">Excel</p>
                                        <p className="text-xs text-slate-400">Archivo .xls</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Procesamiento en lote */}
                    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-5 border border-purple-700/50">
                        <h3 className="text-lg font-semibold text-purple-400 mb-2">🚀 Procesamiento en Lote</h3>
                        <p className="text-slate-300 text-sm mb-2">
                            ¿Tienes muchos documentos similares?
                        </p>
                        <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
                            <li>Sube todos los archivos</li>
                            <li>Configura el esquema con el primero</li>
                            <li>Haz clic en <strong className="text-cyan-400">"Procesar Todos"</strong></li>
                            <li>¡Todos los archivos se procesarán automáticamente!</li>
                        </ol>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 bg-slate-900/50">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-slate-400">
                            Para más detalles, consulta el archivo <code className="bg-slate-800 px-2 py-1 rounded text-cyan-400">GUIA_DE_USUARIO.md</code>
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
                        >
                            ¡Entendido!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
