import React, { useState, useEffect } from 'react';
import { FileTextIcon, ReceiptIcon, FileIcon } from './Icons.tsx';
import type { SchemaField, Sector } from '../types.ts';
import { SECTORS, getSectorById } from '../utils/sectorsConfig.ts';

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
    sector?: Sector;
}

interface TemplatesPanelProps {
    onSelectTemplate: (template: Template) => void;
    onSaveTemplate?: (name: string, description: string) => void;
    currentSchema?: SchemaField[];
    currentPrompt?: string;
    onSectorChange?: (sector: Sector) => void;
    currentSector?: Sector;
    theme?: any;
    isHealthMode?: boolean;
}

const defaultTemplates: Template[] = [
    // Contabilidad
    {
        id: 'factura-basica',
        name: 'Factura Básica',
        description: 'Extrae datos básicos de facturas',
        type: 'factura',
        icon: 'receipt',
        sector: 'contabilidad',
        schema: [
            { id: 'field-1', name: 'cliente', type: 'STRING' },
            { id: 'field-2', name: 'fecha', type: 'STRING' },
            { id: 'field-3', name: 'total', type: 'NUMBER' },
            { id: 'field-4', name: 'items', type: 'ARRAY_OF_STRINGS' }
        ],
        prompt: 'Extrae la información de la factura: cliente, fecha, total e items.'
    },
    {
        id: 'factura-completa',
        name: 'Factura Completa',
        description: 'Extracción detallada de facturas',
        type: 'factura',
        icon: 'receipt',
        sector: 'contabilidad',
        schema: [
            { id: 'field-1', name: 'numero_factura', type: 'STRING' },
            { id: 'field-2', name: 'cliente', type: 'STRING' },
            { id: 'field-3', name: 'fecha', type: 'STRING' },
            { id: 'field-4', name: 'subtotal', type: 'NUMBER' },
            { id: 'field-5', name: 'impuestos', type: 'NUMBER' },
            { id: 'field-6', name: 'total', type: 'NUMBER' },
            { id: 'field-7', name: 'items', type: 'ARRAY_OF_STRINGS' }
        ],
        prompt: 'Extrae todos los detalles de la factura incluyendo número, cliente, fecha, subtotal, impuestos, total e items detallados.'
    },
    // Finanzas
    {
        id: 'estado-financiero',
        name: 'Estado Financiero',
        description: 'Extrae datos de estados financieros',
        type: 'nota',
        icon: 'document',
        sector: 'finanzas',
        schema: [
            { id: 'field-1', name: 'periodo', type: 'STRING' },
            { id: 'field-2', name: 'ingresos_totales', type: 'NUMBER' },
            { id: 'field-3', name: 'gastos_totales', type: 'NUMBER' },
            { id: 'field-4', name: 'resultado_neto', type: 'NUMBER' },
            { id: 'field-5', name: 'detalles', type: 'STRING' }
        ],
        prompt: 'Extrae los datos del estado financiero: periodo, ingresos totales, gastos totales, resultado neto y detalles relevantes.'
    },
    // Marketing
    {
        id: 'reporte-campana',
        name: 'Reporte de Campaña',
        description: 'Métricas de campañas de marketing',
        type: 'nota',
        icon: 'document',
        sector: 'marketing',
        schema: [
            { id: 'field-1', name: 'nombre_campana', type: 'STRING' },
            { id: 'field-2', name: 'fecha_inicio', type: 'STRING' },
            { id: 'field-3', name: 'fecha_fin', type: 'STRING' },
            { id: 'field-4', name: 'impresiones', type: 'NUMBER' },
            { id: 'field-5', name: 'clics', type: 'NUMBER' },
            { id: 'field-6', name: 'conversiones', type: 'NUMBER' },
            { id: 'field-7', name: 'roi', type: 'NUMBER' }
        ],
        prompt: 'Extrae las métricas de la campaña: nombre, fechas, impresiones, clics, conversiones y ROI.'
    },
    // Legal
    {
        id: 'contrato',
        name: 'Contrato Legal',
        description: 'Extrae datos clave de contratos',
        type: 'nota',
        icon: 'document',
        sector: 'legal',
        schema: [
            { id: 'field-1', name: 'tipo_contrato', type: 'STRING' },
            { id: 'field-2', name: 'partes', type: 'ARRAY_OF_STRINGS' },
            { id: 'field-3', name: 'fecha_firma', type: 'STRING' },
            { id: 'field-4', name: 'vigencia', type: 'STRING' },
            { id: 'field-5', name: 'monto', type: 'STRING' },
            { id: 'field-6', name: 'clausulas_principales', type: 'ARRAY_OF_STRINGS' }
        ],
        prompt: 'Extrae los datos del contrato: tipo, partes involucradas, fecha de firma, vigencia, monto y cláusulas principales.'
    },
    // Salud
    {
        id: 'historia-clinica',
        name: 'Historia Clínica',
        description: 'Extrae datos de historias clínicas',
        type: 'nota',
        icon: 'document',
        sector: 'salud',
        schema: [
            { id: 'field-1', name: 'nombre_paciente', type: 'STRING' },
            { id: 'field-2', name: 'numero_historia', type: 'STRING' },
            { id: 'field-3', name: 'fecha_consulta', type: 'STRING' },
            { id: 'field-4', name: 'diagnostico', type: 'STRING' },
            { id: 'field-5', name: 'tratamiento', type: 'STRING' },
            { id: 'field-6', name: 'medicamentos', type: 'ARRAY_OF_STRINGS' }
        ],
        prompt: 'Extrae los datos de la historia clínica: nombre del paciente, número de historia, fecha, diagnóstico, tratamiento y medicamentos prescritos.'
    },
    {
        id: 'orden-medica',
        name: 'Orden Médica',
        description: 'Extrae datos de órdenes médicas',
        type: 'nota',
        icon: 'document',
        sector: 'salud',
        schema: [
            { id: 'field-1', name: 'paciente', type: 'STRING' },
            { id: 'field-2', name: 'medico', type: 'STRING' },
            { id: 'field-3', name: 'fecha', type: 'STRING' },
            { id: 'field-4', name: 'tipo_orden', type: 'STRING' },
            { id: 'field-5', name: 'examenes_solicitados', type: 'ARRAY_OF_STRINGS' },
            { id: 'field-6', name: 'indicaciones', type: 'STRING' }
        ],
        prompt: 'Extrae los datos de la orden médica: paciente, médico, fecha, tipo de orden, exámenes solicitados e indicaciones.'
    },
    {
        id: 'resultado-laboratorio',
        name: 'Resultado de Laboratorio',
        description: 'Extrae resultados de análisis clínicos',
        type: 'nota',
        icon: 'document',
        sector: 'salud',
        schema: [
            { id: 'field-1', name: 'paciente', type: 'STRING' },
            { id: 'field-2', name: 'fecha_muestra', type: 'STRING' },
            { id: 'field-3', name: 'fecha_resultado', type: 'STRING' },
            { id: 'field-4', name: 'tipo_analisis', type: 'STRING' },
            { id: 'field-5', name: 'resultados', type: 'STRING' },
            { id: 'field-6', name: 'valores_referencia', type: 'STRING' }
        ],
        prompt: 'Extrae los datos del resultado de laboratorio: paciente, fechas, tipo de análisis, resultados y valores de referencia.'
    }
];

export function TemplatesPanel({ onSelectTemplate, onSaveTemplate, currentSchema, currentPrompt, onSectorChange, currentSector, theme, isHealthMode }: TemplatesPanelProps) {
    const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [newTemplateDescription, setNewTemplateDescription] = useState('');
    const [showArchived, setShowArchived] = useState(false);
    const [showCertificationsModal, setShowCertificationsModal] = useState(false);


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

    const handleSectorChange = (sector: Sector) => {
        if (onSectorChange) {
            onSectorChange(sector);
        }
    };

    // Filtrar plantillas por sector seleccionado
    const filteredTemplates = (currentSector || 'general') === 'general'
        ? defaultTemplates
        : defaultTemplates.filter(t => t.sector === (currentSector || 'general'));

    const activeCustomTemplates = customTemplates.filter(t => showArchived || !t.archived);
    const currentSectorInfo = getSectorById(currentSector || 'general');

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
                className="w-full text-left p-3 border rounded-lg transition-all group hover:shadow-md"
                style={{
                    backgroundColor: isHealthMode ? '#f0fdf4' : 'rgba(30, 41, 59, 0.5)',
                    borderColor: isHealthMode ? '#6ee7b7' : '#475569'
                }}
            >
                <div className="flex items-start gap-3">
                    <div
                        className="mt-0.5 transition-colors"
                        style={{ color: isHealthMode ? accentColor : '#60a5fa' }}
                    >
                        {renderIcon(template.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4
                            className="text-sm font-semibold transition-colors"
                            style={{ color: textColor }}
                        >
                            {template.name} {template.archived && <span className="text-xs opacity-50">(Archivada)</span>}
                        </h4>
                        <p
                            className="text-xs mt-0.5 line-clamp-2 transition-colors"
                            style={{ color: textSecondary }}
                        >
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

    const cardBg = isHealthMode ? '#ffffff' : 'rgba(30, 41, 59, 0.3)';
    const borderColor = isHealthMode ? theme?.border || '#6ee7b7' : 'rgba(51, 65, 85, 0.5)';
    const headerBg = isHealthMode ? '#ffffff' : 'rgba(2, 6, 23, 0.5)';
    const textColor = isHealthMode ? theme?.text || '#064e3b' : '#f1f5f9';
    const textSecondary = isHealthMode ? theme?.textSecondary || '#065f46' : '#94a3b8';

    return (
        <div
            className="h-full flex flex-col rounded-lg border overflow-hidden transition-colors duration-500"
            style={{
                backgroundColor: cardBg,
                borderColor: borderColor
            }}
        >
            <div
                className="p-4 border-b transition-colors duration-500"
                style={{
                    backgroundColor: headerBg,
                    borderBottomColor: borderColor
                }}
            >
                <h2 className="text-lg font-semibold transition-colors duration-500" style={{ color: textColor }}>Plantillas</h2>
                <p className="text-xs mt-1 transition-colors duration-500" style={{ color: textSecondary }}>Modelos y plantillas predefinidas</p>
            </div>

            {/* Selector de Sectores */}
            <div
                className="p-4 border-b transition-colors duration-500"
                style={{
                    backgroundColor: isHealthMode ? '#f0fdf4' : 'rgba(15, 23, 42, 0.5)',
                    borderBottomColor: borderColor
                }}
            >
                <label
                    htmlFor="sector-select"
                    className="block text-sm font-medium mb-2 transition-colors duration-500"
                    style={{ color: textColor }}
                >
                    Filtrar por Sector
                </label>
                <select
                    id="sector-select"
                    value={currentSector || 'general'}
                    onChange={(e) => handleSectorChange(e.target.value as Sector)}
                    className="w-full rounded-md p-2 text-sm transition-colors duration-500"
                    style={{
                        backgroundColor: isHealthMode ? '#ffffff' : '#1e293b',
                        borderColor: borderColor,
                        color: textColor,
                        border: `1px solid ${borderColor}`
                    }}
                >
                    {SECTORS.map(sector => (
                        <option key={sector.id} value={sector.id}>
                            {sector.icon} {sector.name}
                        </option>
                    ))}
                </select>
                {currentSectorInfo?.description && (
                    <p className="text-xs mt-1 transition-colors duration-500" style={{ color: textSecondary }}>
                        {currentSectorInfo.description}
                    </p>
                )}

                {/* Mostrar info de certificaciones para sector Salud */}
                {currentSector === 'salud' && currentSectorInfo?.certifications && (
                    <button
                        onClick={() => setShowCertificationsModal(true)}
                        className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 hover:opacity-90 border-2 rounded-md transition-all text-xs font-semibold"
                        style={{
                            backgroundColor: '#d1fae5',
                            borderColor: '#6ee7b7',
                            color: '#047857'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Ver Certificaciones HIPAA
                    </button>
                )}

                {/* Modelo recomendado */}
                {currentSectorInfo?.recommendedModel && (
                    <div
                        className="mt-3 p-2 border rounded text-xs transition-colors duration-500"
                        style={{
                            backgroundColor: isHealthMode ? '#dbeafe' : 'rgba(37, 99, 235, 0.1)',
                            borderColor: isHealthMode ? '#93c5fd' : 'rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        <p className="font-medium transition-colors duration-500" style={{ color: isHealthMode ? '#1e40af' : '#93c5fd' }}>
                            Modelo recomendado:
                        </p>
                        <p className="mt-0.5 transition-colors duration-500" style={{ color: isHealthMode ? '#1e3a8a' : '#bfdbfe' }}>
                            {currentSectorInfo.recommendedModel === 'gemini-2.5-pro' ? 'Gemini 2.5 Pro' : 'Gemini 2.5 Flash'}
                        </p>
                    </div>
                )}
            </div>

            <div
                className="flex-1 overflow-y-auto p-4 space-y-6"
                style={{
                    backgroundColor: isHealthMode ? '#f0fdf4' : 'transparent'
                }}
            >
                {/* Plantillas del sector seleccionado */}
                {filteredTemplates.length > 0 ? (
                    <div>
                        <h3
                            className="text-sm font-bold mb-3 flex items-center gap-2 transition-colors duration-500"
                            style={{ color: textColor }}
                        >
                            <span className="text-lg">{currentSectorInfo?.icon}</span>
                            Plantillas de {currentSectorInfo?.name}
                        </h3>
                        <div className="space-y-2">
                            {filteredTemplates.map(template => (
                                <TemplateCard key={template.id} template={template} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-sm transition-colors duration-500" style={{ color: textSecondary }}>
                        <p>No hay plantillas para este sector</p>
                    </div>
                )}

                {/* Modelos Guardados */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3
                            className="text-sm font-bold flex items-center gap-2 transition-colors duration-500"
                            style={{ color: textColor }}
                        >
                            <FileIcon className="w-4 h-4" style={{ color: isHealthMode ? '#a855f7' : '#c084fc' }} />
                            Mis Modelos
                        </h3>
                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className="text-xs hover:opacity-80 transition-all font-medium"
                            style={{ color: textSecondary }}
                        >
                            {showArchived ? 'Ocultar archivadas' : 'Ver archivadas'}
                        </button>
                    </div>

                    {/* Botón para guardar nueva plantilla */}
                    {currentSchema && currentPrompt && (
                        <button
                            onClick={() => setShowSaveDialog(true)}
                            className="w-full mb-3 p-3 border-2 rounded-lg transition-all flex items-center justify-center gap-2 font-bold hover:opacity-90"
                            style={{
                                backgroundColor: isHealthMode ? '#d1fae5' : 'rgba(147, 51, 234, 0.2)',
                                borderColor: isHealthMode ? '#6ee7b7' : 'rgba(168, 85, 247, 0.5)',
                                color: isHealthMode ? '#047857' : '#e9d5ff'
                            }}
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
                        <div className="text-center py-8 text-sm transition-colors duration-500" style={{ color: textSecondary }}>
                            <p>No hay modelos guardados</p>
                            <p className="text-xs mt-1 opacity-75">Crea y guarda tus propios modelos</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Certificaciones HIPAA */}
            {showCertificationsModal && currentSectorInfo?.certifications && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCertificationsModal(false)}>
                    <div className="bg-slate-800 rounded-lg border border-green-500/50 shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-green-300">Certificaciones del Sector Salud</h3>
                            </div>
                            <button
                                onClick={() => setShowCertificationsModal(false)}
                                className="text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-4 p-3 bg-green-900/20 border border-green-700/50 rounded-lg">
                            <p className="text-sm text-green-200">
                                Google Gemini cuenta con las certificaciones necesarias para trabajar con datos médicos y cumplir con regulaciones de salud.
                            </p>
                        </div>

                        <h4 className="text-sm font-medium text-slate-200 mb-3">Certificaciones Actuales (2025):</h4>
                        <ul className="space-y-2 mb-4">
                            {currentSectorInfo.certifications.map((cert, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>{cert}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg text-xs text-blue-200">
                            <p className="font-medium mb-1">Nota Importante:</p>
                            <p>Para usar Gemini con datos médicos protegidos (PHI), se requiere firmar un Business Associate Agreement (BAA) con Google y activar las configuraciones de proyectos regulados.</p>
                        </div>

                        <button
                            onClick={() => setShowCertificationsModal(false)}
                            className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
