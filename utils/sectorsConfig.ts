import type { SectorInfo } from '../types.ts';

export const SECTORS: SectorInfo[] = [
    {
        id: 'general',
        name: 'General',
        description: 'Documentos generales y variados',
        icon: '📄',
    },
    {
        id: 'contabilidad',
        name: 'Contabilidad',
        description: 'Facturas, balances, cuentas',
        icon: '🧾',
        recommendedModel: 'gemini-2.5-flash',
    },
    {
        id: 'finanzas',
        name: 'Finanzas',
        description: 'Estados financieros, reportes',
        icon: '💰',
        recommendedModel: 'gemini-2.5-pro',
    },
    {
        id: 'marketing',
        name: 'Marketing',
        description: 'Campañas, métricas, reportes',
        icon: '📊',
        recommendedModel: 'gemini-2.5-flash',
    },
    {
        id: 'legal',
        name: 'Legal',
        description: 'Contratos, documentos legales',
        icon: '⚖️',
        recommendedModel: 'gemini-2.5-pro',
    },
    {
        id: 'salud',
        name: 'Sector Salud',
        description: 'Documentos médicos, historias clínicas',
        icon: '🏥',
        theme: {
            primary: '#059669', // green-600 - más intenso y profesional
            secondary: '#10b981', // green-500
            accent: '#0284c7', // sky-600 - azul más visible
            background: '#f8fafc', // slate-50 - fondo muy claro pero neutro
            cardBg: '#ffffff',
            border: '#86efac', // green-300 - más visible
            text: '#0f172a', // slate-900 - texto muy oscuro para contraste
            textSecondary: '#475569', // slate-600 - gris oscuro para secundario
        },
        recommendedModel: 'gemini-2.5-pro',
        certifications: [
            'HIPAA Compliant (con BAA)',
            'ISO 42001 - Sistema de Gestión de IA',
            'HITRUST Certification',
            'ISO 27701, 27017, 27018',
            'ISO 9001'
        ]
    }
];

export const getSectorById = (sectorId: string): SectorInfo | undefined => {
    return SECTORS.find(s => s.id === sectorId);
};

export const getDefaultTheme = () => ({
    primary: '#06b6d4', // cyan-500
    secondary: '#22d3ee', // cyan-400
    accent: '#0891b2', // cyan-600
    background: '#0f172a', // slate-900
    cardBg: '#1e293b', // slate-800
    border: '#334155', // slate-700
    text: '#e2e8f0', // slate-200
    textSecondary: '#94a3b8', // slate-400
});
