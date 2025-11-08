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
];

export const getSectorById = (sectorId: string): SectorInfo | undefined => {
    return SECTORS.find(sector => sector.id === sectorId);
};