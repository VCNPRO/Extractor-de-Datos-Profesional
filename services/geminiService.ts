
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
// Fix: Use explicit file extension in import.
import type { SchemaField } from '../types.ts';

// This function is a helper to convert file to base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should handle ArrayBuffer case if necessary, for now empty string.
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};


// Recursive function to convert our custom schema to Gemini's format
const convertSchemaToGemini = (schema: SchemaField[]): { type: Type, properties: any, required: string[] } => {
    const properties: { [key: string]: any } = {};
    const required: string[] = [];

    schema.forEach(field => {
        if (field.name) {
            required.push(field.name);
            let fieldSchema: any = {};
            switch (field.type) {
                case 'STRING':
                    fieldSchema.type = Type.STRING;
                    break;
                case 'NUMBER':
                    fieldSchema.type = Type.NUMBER;
                    break;
                case 'BOOLEAN':
                    fieldSchema.type = Type.BOOLEAN;
                    break;
                case 'ARRAY_OF_STRINGS':
                    fieldSchema.type = Type.ARRAY;
                    fieldSchema.items = { type: Type.STRING };
                    break;
                case 'OBJECT':
                    if (field.children && field.children.length > 0) {
                        const nestedSchema = convertSchemaToGemini(field.children);
                        fieldSchema.type = Type.OBJECT;
                        fieldSchema.properties = nestedSchema.properties;
                        fieldSchema.required = nestedSchema.required;
                    } else {
                        // Gemini requires object properties to be defined.
                        fieldSchema.type = Type.OBJECT;
                        fieldSchema.properties = { placeholder: { type: Type.STRING, description: "Placeholder for empty object" } };
                    }
                    break;
                case 'ARRAY_OF_OBJECTS':
                    fieldSchema.type = Type.ARRAY;
                    if (field.children && field.children.length > 0) {
                        const nestedSchema = convertSchemaToGemini(field.children);
                        fieldSchema.items = {
                            type: Type.OBJECT,
                            properties: nestedSchema.properties,
                            required: nestedSchema.required,
                        };
                    } else {
                        // Add placeholder if empty.
                        fieldSchema.items = { type: Type.OBJECT, properties: { placeholder: { type: Type.STRING, description: "Placeholder for empty object" } } };
                    }
                    break;
            }
            properties[field.name] = fieldSchema;
        }
    });

    return {
        type: Type.OBJECT,
        properties,
        required,
    };
};

let ai: GoogleGenAI | null = null;
let currentApiKey: string | null = null;

export const setApiKey = (apiKey: string) => {
    currentApiKey = apiKey;
    ai = null; // Reset AI instance to use new key
};

export const getApiKey = (): string | null => {
    return currentApiKey;
};

const getGenAI = () => {
    if (!currentApiKey) {
        throw new Error("An API Key must be set when running in a browser");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: currentApiKey });
    }
    return ai;
}

export type GeminiModel = 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-1.5-flash' | 'gemini-1.5-pro';

export interface ModelInfo {
    id: GeminiModel;
    name: string;
    description: string;
    bestFor: string;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
    {
        id: 'gemini-2.5-flash',
        name: 'Flash 2.5 (Rápido)',
        description: 'Modelo rápido y eficiente',
        bestFor: 'Documentos simples, facturas básicas, textos cortos'
    },
    {
        id: 'gemini-2.5-pro',
        name: 'Pro 2.5 (Avanzado)',
        description: 'Modelo avanzado con mejor precisión',
        bestFor: 'Documentos complejos, múltiples tablas, análisis profundo'
    },
    {
        id: 'gemini-1.5-flash',
        name: 'Flash 1.5',
        description: 'Versión anterior del modelo rápido',
        bestFor: 'Documentos simples con compatibilidad legacy'
    }
];

export const extractDataFromDocument = async (
    file: File,
    schema: SchemaField[],
    prompt: string,
    modelId: GeminiModel = 'gemini-2.5-flash'
): Promise<object> => {
    const genAI = getGenAI();
    const model = modelId;

    const generativePart = await fileToGenerativePart(file);

    const textPart = {
        text: prompt,
    };
    
    // Filter out fields without a name from the final schema
    const validSchemaFields = schema.filter(f => f.name.trim() !== '');
    if (validSchemaFields.length === 0) {
        throw new Error("El esquema está vacío o no contiene campos con nombre válidos.");
    }
    
    const geminiSchema = convertSchemaToGemini(validSchemaFields);


    try {
        const response: GenerateContentResponse = await genAI.models.generateContent({
            model: model,
            contents: { parts: [textPart, generativePart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: geminiSchema,
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error al llamar a la API de Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Error de la API de Gemini: ${error.message}`);
        }
        throw new Error("Ocurrió un error desconocido al comunicarse con la API de Gemini.");
    }
};

/**
 * Busca una imagen/logo de referencia en un documento
 */
export const searchImageInDocument = async (
    documentFile: File,
    referenceImageFile: File,
    modelId: GeminiModel = 'gemini-2.5-flash'
): Promise<{ found: boolean; description: string; location?: string; confidence?: string }> => {
    const genAI = getGenAI();
    const model = modelId;

    const documentPart = await fileToGenerativePart(documentFile);
    const referencePart = await fileToGenerativePart(referenceImageFile);

    const prompt = {
        text: `Analiza el documento y busca si contiene una imagen o logo similar a la imagen de referencia proporcionada.

Proporciona la respuesta en formato JSON con los siguientes campos:
- found: boolean (true si se encontró una imagen similar, false si no)
- description: string (descripción de lo que encontraste o no encontraste)
- location: string (opcional, ubicación aproximada en el documento: "arriba izquierda", "centro", "pie de página", etc.)
- confidence: string (opcional, nivel de confianza: "alta", "media", "baja")

Sé específico en la descripción sobre las similitudes o diferencias encontradas.`
    };

    try {
        const response: GenerateContentResponse = await genAI.models.generateContent({
            model: model,
            contents: {
                parts: [
                    prompt,
                    { text: "Imagen de referencia a buscar:" },
                    referencePart,
                    { text: "Documento donde buscar:" },
                    documentPart
                ]
            },
            config: {
                responseMimeType: "application/json",
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error al buscar imagen en documento:", error);
        if (error instanceof Error) {
            throw new Error(`Error de búsqueda: ${error.message}`);
        }
        throw new Error("Ocurrió un error desconocido al buscar la imagen.");
    }
};
