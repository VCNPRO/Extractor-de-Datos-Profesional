
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
