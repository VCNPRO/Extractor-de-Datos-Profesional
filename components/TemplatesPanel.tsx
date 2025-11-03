import React, { useState, useEffect } from 'react';
import { FileTextIcon, ReceiptIcon, FileIcon } from './Icons.tsx';
import type { SchemaField } from '../types.ts';

export interface Template {
    id: string;
    name: string;
    description: string;
    type: 'factura' | 'nota' | 'modelo';
    icon: 'receipt' | 'file' | 'document';
    schema: SchemaField[];
    prompt: string;
    archived?: boolean;
    custom?: boolean;
}

interface TemplatesPanelProps {
    onSelectTemplate: (template: Template) => void;
    onSaveTemplate?: (name: string, description: string) => void;
    currentSchema?: SchemaField[];
    currentPrompt?: string;
}

const defaultTemplates: Template[] = [
    {
        id: 'factura-basica',
        name: 'Factura Básica',
        description: 'Extrae datos básicos de facturas',
        type: 'factura',
        icon: 'receipt',
        schema: [
            { id: 'field-1', name: 'cliente', type: 'STRING' },
            { id: 'field-2', name: 'fecha', type: 'STRING' },
            { id: 'field-3', name: 'total', type: 'NUMBER' },
            { id: 'field-4', name: 'items', type: 'ARRAY' }
        ],
        prompt: 'Extrae la información de la factura: cliente, fecha, total e items.'
    },
    {
        id: 'factura-completa',
        name: 'Factura Completa',
        description: 'Extracción detallada de facturas',
        type: 'factura',
        icon: 'receipt',
        schema: [
            { id: 'field-1', name: 'numero_factura', type: 'STRING' },
            { id: 'field-2', name: 'cliente', type: 'STRING' },
            { id: 'field-3', name: 'fecha', type: 'STRING' },
            { id: 'field-4', name: 'subtotal', type: 'NUMBER' },
            { id: 'field-5', name: 'impuestos', type: 'NUMBER' },
            { id: 'field-6', name: 'total', type: 'NUMBER' },
            { id: 'field-7', name: 'items', type: 'ARRAY' }
        ],
        prompt: 'Extrae todos los detalles de la factura incluyendo número, cliente, fecha, subtotal, impuestos, total e items detallados.'
    },
    {
        id: 'nota-entrega',
        name: 'Nota de Entrega',
        description: 'Extrae datos de notas de entrega',
        type: 'nota',
        icon: 'document',
        schema: [
            { id: 'field-1', name: 'numero_nota', type: 'STRING' },
            { id: 'field-2', name: 'destinatario', type: 'STRING' },
            { id: 'field-3', name: 'fecha_entrega', type: 'STRING' },
            { id: 'field-4', name: 'productos', type: 'ARRAY' },
            { id: 'field-5', name: 'cantidad_total', type: 'NUMBER' }
        ],
        prompt: 'Extrae la información de la nota de entrega: número, destinatario, fecha, productos y cantidad total.'
    },
    {
        id: 'nota-credito',
        name: 'Nota de Crédito',
        description: 'Extrae datos de notas de crédito',
        type: 'nota',
        icon: 'document',
        schema: [
            { id: 'field-1', name: 'numero_nota', type: 'STRING' },
            { id: 'field-2', name: 'factura_referencia', type: 'STRING' },
            { id: 'field-3', name: 'fecha', type: 'STRING' },
            { id: 'field-4', name: 'monto_credito', type: 'NUMBER' },
            { id: 'field-5', name: 'motivo', type: 'STRING' }
        ],
        prompt: 'Extrae los datos de la nota de crédito: número, factura de referencia, fecha, monto y motivo.'
    }
];

export function TemplatesPanel({ onSelectTemplate, onSaveTemplate, currentSchema, currentPrompt }: TemplatesPanelProps) {
    const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [newTemplateDescription, setNewTemplateDescription] = useState('');
    const [showArchived, setShowArchived] = useState(false);

    // Load custom templates from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('customTemplates');
        if (stored) {
            try {
                setCustomTemplates(JSON.parse(stored));
            } catch (e) {
                console.error('Error loading custom templates:', e);
            }
        }
    }, []);

    // Save custom templates to localStorage
    const saveToLocalStorage = (templates: Template[]) => {
        localStorage.setItem('customTemplates', JSON.stringify(templates));
    };

    const handleSaveTemplate = () => {
        if (!newTemplateName.trim() || !currentSchema || !currentPrompt) return;

        const newTemplate: Template = {
            id: `custom-${Date.now()}`,
            name: newTemplateName.trim(),
            description: newTemplateDescription.trim() || 'Plantilla personalizada',
            type: 'modelo',
            icon: 'file',
            schema: JSON.parse(JSON.stringify(currentSchema)),
            prompt: currentPrompt,
            custom: true,
            archived: false
        };

        const updatedTemplates = [...customTemplates, newTemplate];
        setCustomTemplates(updatedTemplates);
        saveToLocalStorage(updatedTemplates);

        setNewTemplateName('');
        setNewTemplateDescription('');
        setShowSaveDialog(false);
    };

    const handleArchiveTemplate = (templateId: string) => {
        const updatedTemplates = customTemplates.map(t =>
            t.id === templateId ? { ...t, archived: !t.archived } : t
        );
        setCustomTemplates(updatedTemplates);
        saveToLocalStorage(updatedTemplates);
    };

    const handleDeleteTemplate = (templateId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
            const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
            setCustomTemplates(updatedTemplates);
            saveToLocalStorage(updatedTemplates);
        }
    };

    const facturas = defaultTemplates.filter(t => t.type === 'factura');
    const notas = defaultTemplates.filter(t => t.type === 'nota');
    const activeCustomTemplates = customTemplates.filter(t => showArchived || !t.archived);

    const renderIcon = (iconType: Template['icon']) => {
        switch (iconType) {
            case 'receipt':
                return <ReceiptIcon className="w-5 h-5" />;
            case 'document':
                return <FileTextIcon className="w-5 h-5" />;
            default:
                return <FileIcon className="w-5 h-5" />;
        }
    };

    const TemplateCard = ({ template, showActions = false }: { template: Template, showActions?: boolean }) => (
        <div className="relative group/card">
            <button
                onClick={() => onSelectTemplate(template)}
                className="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors group"
            >
                <div className="flex items-start gap-3">
                    <div className="text-blue-400 mt-0.5 group-hover:text-blue-300 transition-colors">
                        {renderIcon(template.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-200 group-hover:text-slate-100 transition-colors">
                            {template.name} {template.archived && <span className="text-xs text-slate-500">(Archivada)</span>}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                            {template.description}
                        </p>
                    </div>
                </div>
            </button>
            {showActions && (
                <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity flex gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveTemplate(template.id);
                        }}
                        className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 hover:text-white transition-colors"
                        title={template.archived ? "Desarchivar" : "Archivar"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTemplate(template.id);
                        }}
                        className="p-1 bg-red-700 hover:bg-red-600 rounded text-white transition-colors"
                        title="Eliminar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 bg-slate-950/50">
                <h2 className="text-lg font-semibold text-slate-100">Plantillas</h2>
                <p className="text-xs text-slate-400 mt-1">Modelos y plantillas predefinidas</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Facturas */}
                <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                        <ReceiptIcon className="w-4 h-4 text-blue-400" />
                        Facturas
                    </h3>
                    <div className="space-y-2">
                        {facturas.map(template => (
                            <TemplateCard key={template.id} template={template} />
                        ))}
                    </div>
                </div>

                {/* Notas */}
                <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                        <FileTextIcon className="w-4 h-4 text-green-400" />
                        Notas
                    </h3>
                    <div className="space-y-2">
                        {notas.map(template => (
                            <TemplateCard key={template.id} template={template} />
                        ))}
                    </div>
                </div>

                {/* Modelos Guardados */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <FileIcon className="w-4 h-4 text-purple-400" />
                            Mis Modelos
                        </h3>
                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
                        >
                            {showArchived ? 'Ocultar archivadas' : 'Ver archivadas'}
                        </button>
                    </div>

                    {/* Botón para guardar nueva plantilla */}
                    {currentSchema && currentPrompt && (
                        <button
                            onClick={() => setShowSaveDialog(true)}
                            className="w-full mb-3 p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg transition-colors flex items-center justify-center gap-2 text-purple-300 hover:text-purple-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Guardar Plantilla Actual
                        </button>
                    )}

                    {/* Dialog para guardar plantilla */}
                    {showSaveDialog && (
                        <div className="mb-3 p-3 bg-slate-700/50 border border-slate-600 rounded-lg space-y-2">
                            <input
                                type="text"
                                placeholder="Nombre de la plantilla"
                                value={newTemplateName}
                                onChange={(e) => setNewTemplateName(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200"
                            />
                            <input
                                type="text"
                                placeholder="Descripción (opcional)"
                                value={newTemplateDescription}
                                onChange={(e) => setNewTemplateDescription(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveTemplate}
                                    disabled={!newTemplateName.trim()}
                                    className="flex-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSaveDialog(false);
                                        setNewTemplateName('');
                                        setNewTemplateDescription('');
                                    }}
                                    className="flex-1 px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-sm transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )}

                    {activeCustomTemplates.length > 0 ? (
                        <div className="space-y-2">
                            {activeCustomTemplates.map(template => (
                                <TemplateCard key={template.id} template={template} showActions={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500 text-sm">
                            <p>No hay modelos guardados</p>
                            <p className="text-xs mt-1">Crea y guarda tus propios modelos</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
