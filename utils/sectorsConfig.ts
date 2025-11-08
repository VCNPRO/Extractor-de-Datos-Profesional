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

export const getDefaultTheme = (sectorId: string) => {
    const themes: { [key: string]: any } = {
        general: {
            primary: '#4CAF50',
            secondary: '#81C784',
            accent: '#66BB6A',
            background: '#E8F5E9',
        },
        contabilidad: {
            primary: '#2196F3',
            secondary: '#64B5F6',
            accent: '#42A5F5',
            background: '#E3F2FD',
        },
        finanzas: {
            primary: '#FF9800',
            secondary: '#FFB74D',
            accent: '#FFA726',
            background: '#FFF3E0',
        },
        marketing: {
            primary: '#9C27B0',
            secondary: '#BA68C8',
            accent: '#AB47BC',
            background: '#F3E5F5',
        },
        legal: {
            primary: '#795548',
            secondary: '#A1887F',
            accent: '#8D6E63',
            background: '#EFEBE9',
        },
    };

    return themes[sectorId] || themes.general;
};