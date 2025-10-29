
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

export const extractDataFromDocument = async (
    file: File,
    schema: SchemaField[],
    prompt: string
): Promise<object> => {
    const genAI = getGenAI();
    const model = 'gemini-2.5-flash';

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
