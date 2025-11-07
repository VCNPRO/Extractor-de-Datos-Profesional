// Vertex AI Service - 🇪🇺 Procesamiento en Europa (Bélgica)
import type { SchemaField, SchemaFieldType } from '../types.ts';

const callVertexAIAPI = async (endpoint: string, body: any): Promise<any> => {
    const baseURL = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:5173';

    const url = `${baseURL}/api/${endpoint}`;
    console.log(`🇪🇺 Llamando a Vertex AI Europa: ${url}`);

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
};

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = (reader.result as string).split(',')[1];
            resolve({
                inlineData: {
                    data: base64data,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const convertSchemaToVertexAI = (fields: SchemaField[]): any => {
    const properties: any = {};
    const required: string[] = [];

    fields.forEach(field => {
        let fieldSchema: any;
        switch (field.type) {
            case 'STRING':
                fieldSchema = { type: 'STRING' };
                break;
            case 'NUMBER':
                fieldSchema = { type: 'NUMBER' };
                break;
            case 'BOOLEAN':
                fieldSchema = { type: 'BOOLEAN' };
                break;
            case 'ARRAY':
                fieldSchema = { type: 'ARRAY', items: { type: 'STRING' } };
                break;
            case 'OBJECT':
                fieldSchema = { type: 'OBJECT', properties: {} };
                break;
            default:
                fieldSchema = { type: 'STRING' };
        }

        if (field.description) {
            fieldSchema.description = field.description;
        }

        properties[field.name] = fieldSchema;

        if (field.required) {
            required.push(field.name);
        }
    });

    return {
        type: 'OBJECT',
        properties,
        required,
    };
};

export type GeminiModel = 'gemini-2.5-flash' | 'gemini-2.5-flash-lite' | 'gemini-2.5-pro';

export interface ModelInfo {
    id: GeminiModel;
    name: string;
    description: string;
    speed: 'fast' | 'balanced' | 'precise';
    costLevel: 'low' | 'medium' | 'high';
}

export const AVAILABLE_MODELS: ModelInfo[] = [
    {
        id: 'gemini-2.5-flash-lite',
        name: 'Gemini 2.5 Flash Lite 🇪🇺',
        description: 'Más rápido y económico - Ideal para documentos simples',
        speed: 'fast',
        costLevel: 'low',
    },
    {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash 🇪🇺',
        description: 'Balance óptimo velocidad/precisión - Recomendado',
        speed: 'balanced',
        costLevel: 'medium',
    },
    {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro 🇪🇺',
        description: 'Máxima precisión - Para documentos complejos',
        speed: 'precise',
        costLevel: 'high',
    },
];

export const extractDataFromDocument = async (
    file: File,
    schema: SchemaField[],
    prompt: string,
    modelId: GeminiModel = 'gemini-2.5-flash'
): Promise<object> => {
    const generativePart = await fileToGenerativePart(file);

    const validSchemaFields = schema.filter(field => field.name.trim() !== '');

    if (validSchemaFields.length === 0) {
        throw new Error('El esquema debe tener al menos un campo válido');
    }

    const vertexAISchema = convertSchemaToVertexAI(validSchemaFields);

    console.log(`📄 Procesando: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    console.log(`🤖 Modelo: ${modelId}`);
    console.log(`🇪🇺 Región: europe-west1 (Bélgica)`);

    const result = await callVertexAIAPI('extract', {
        model: modelId,
        contents: {
            role: 'user',
            parts: [{ text: prompt }, generativePart]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: vertexAISchema,
        },
    });

    console.log(`📍 Procesado en: ${result.location || 'europe-west1'}`);

    const trimmedText = result.text.trim();
    let jsonText = trimmedText;

    if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
        return JSON.parse(jsonText);
    } catch (parseError) {
        console.error('Error al parsear JSON:', parseError);
        console.error('Texto recibido:', jsonText);
        throw new Error('Error al parsear la respuesta JSON del modelo de IA');
    }
};

export const generateSchemaFromPrompt = async (
    prompt: string,
    modelId: GeminiModel = 'gemini-2.5-flash-lite'
): Promise<SchemaField[]> => {
    const systemPrompt = `Eres un asistente experto en crear esquemas de extracción de datos. 
A partir de la descripción del usuario, genera un esquema JSON con los campos necesarios.

IMPORTANTE: Devuelve SOLO un objeto JSON con esta estructura exacta:
{
  "fields": [
    {
      "name": "nombre_del_campo",
      "type": "STRING|NUMBER|BOOLEAN|ARRAY|OBJECT",
      "description": "descripción del campo",
      "required": true|false
    }
  ]
}

Tipos disponibles:
- STRING: texto simple
- NUMBER: números
- BOOLEAN: verdadero/falso
- ARRAY: lista de valores
- OBJECT: objeto con sub-campos

Usuario: ${prompt}`;

    console.log(`🧠 Generando schema con ${modelId}...`);
    console.log(`🇪🇺 Región: europe-west1 (Bélgica)`);

    try {
        const result = await callVertexAIAPI('extract', {
            model: modelId,
            contents: {
                role: 'user',
                parts: [{ text: systemPrompt }]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'OBJECT',
                    properties: {
                        fields: {
                            type: 'ARRAY',
                            items: {
                                type: 'OBJECT',
                                properties: {
                                    name: { type: 'STRING' },
                                    type: { type: 'STRING' },
                                    description: { type: 'STRING' },
                                    required: { type: 'BOOLEAN' }
                                },
                                required: ['name', 'type']
                            }
                        }
                    },
                    required: ['fields']
                }
            },
        });

        const trimmedText = result.text.trim();
        let jsonText = trimmedText;

        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const parsed = JSON.parse(jsonText);

        if (!parsed.fields || !Array.isArray(parsed.fields)) {
            throw new Error('Respuesta inválida: no contiene array de fields');
        }

        return parsed.fields.map((field: any, index: number) => ({
            id: `field-${Date.now()}-${index}`,
            name: field.name || '',
            type: (field.type?.toUpperCase() || 'STRING') as SchemaFieldType,
            description: field.description || '',
            required: field.required || false,
        }));
    } catch (error: any) {
        console.error('Error al generar schema desde prompt:', error);
        throw new Error(`Error al generar schema: ${error.message}`);
    }
};
