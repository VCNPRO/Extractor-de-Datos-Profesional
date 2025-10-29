import React from 'react';
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
}

interface TemplatesPanelProps {
    onSelectTemplate: (template: Template) => void;
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

export function TemplatesPanel({ onSelectTemplate }: TemplatesPanelProps) {
    const facturas = defaultTemplates.filter(t => t.type === 'factura');
    const notas = defaultTemplates.filter(t => t.type === 'nota');

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

    const TemplateCard = ({ template }: { template: Template }) => (
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
                        {template.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                        {template.description}
                    </p>
                </div>
            </div>
        </button>
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

                {/* Modelos Guardados - Placeholder para futuro */}
                <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                        <FileIcon className="w-4 h-4 text-purple-400" />
                        Mis Modelos
                    </h3>
                    <div className="text-center py-8 text-slate-500 text-sm">
                        <p>No hay modelos guardados</p>
                        <p className="text-xs mt-1">Crea y guarda tus propios modelos</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
