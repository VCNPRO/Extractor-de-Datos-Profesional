import { VertexAI } from '@google-cloud/vertexai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Configuración de Vertex AI en región europea
const PROJECT_ID = process.env.VITE_GEMINI_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT;
const LOCATION = 'europe-west1'; // 🇪🇺 BÉLGICA - DATOS EN EUROPA

// Parsear credenciales desde variable de entorno
let credentials: any = null;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS.startsWith('{')) {
      // Credenciales en formato JSON string (Vercel)
      credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    } else {
      // Ruta a archivo de credenciales (desarrollo local)
      credentials = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    }
    console.log('🔑 Credenciales cargadas correctamente');
  } catch (error) {
    console.error('⚠️ Error al parsear credenciales:', error);
  }
}

// Inicializar Vertex AI con credenciales explícitas
const vertexAI = new VertexAI({
  project: PROJECT_ID!,
  location: LOCATION,
  googleAuthOptions: credentials ? {
    credentials: credentials
  } : undefined,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers para llamadas desde el frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, contents, config } = req.body;

    if (!model || !contents) {
      return res.status(400).json({ error: 'Missing required fields: model, contents' });
    }

    console.log(`🇪🇺 Procesando con Vertex AI en ${LOCATION}`);
    console.log(`📍 Proyecto: ${PROJECT_ID}`);
    console.log(`🤖 Modelo: ${model}`);

    // Obtener el modelo generativo
    const generativeModel = vertexAI.getGenerativeModel({
      model: model,
      generationConfig: config?.generationConfig,
    });

    // Generar contenido
    const result = await generativeModel.generateContent({
      contents: [contents],
      generationConfig: {
        responseMimeType: config?.responseMimeType || 'application/json',
        responseSchema: config?.responseSchema,
        ...config?.generationConfig,
      },
    });

    const response = result.response;
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log(`✅ Respuesta generada (${text.length} caracteres)`);

    return res.status(200).json({
      text: text,
      model: model,
      location: LOCATION,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Error en Vertex AI:', error);

    return res.status(500).json({
      error: 'Error al procesar con Vertex AI',
      message: error.message || 'Error desconocido',
      details: error.details || null,
    });
  }
}
