
export type UploadedFileStatus = 'pendiente' | 'procesando' | 'completado' | 'error';

export interface UploadedFile {
  id: string;
  file: File;
  status: UploadedFileStatus;
  extractedData?: object;
  error?: string;
}

export type SchemaFieldType = 'STRING' | 'NUMBER' | 'BOOLEAN' | 'ARRAY_OF_STRINGS' | 'OBJECT' | 'ARRAY_OF_OBJECTS';

export interface SchemaField {
  id: string;
  name: string;
  type: SchemaFieldType;
  children?: SchemaField[];
  error?: string;
}

export interface ExtractionResult {
    id: string;
    fileId: string;
    fileName: string;
    schema: SchemaField[];
    extractedData: object;
    timestamp: string;
}

export type Sector = 'contabilidad' | 'finanzas' | 'marketing' | 'legal' | 'salud' | 'general';

export interface SectorInfo {
    id: Sector;
    name: string;
    description: string;
    icon: string;
    theme?: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        cardBg: string;
        border: string;
        text: string;
        textSecondary: string;
    };
    recommendedModel?: 'gemini-2.5-flash' | 'gemini-2.5-pro';
    certifications?: string[];
}
