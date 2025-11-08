# 🇪🇺 Configuración de Vertex AI Europa para VerbaDoc Salud

## ✅ Cumplimiento GDPR para Datos Clínicos

Este documento explica cómo configurar Vertex AI en la región europea (Bélgica) para cumplir con las normativas de protección de datos de salud.

---

## 📋 Pasos de Configuración

### 1. Crear Proyecto en Google Cloud (si no existe)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el **Project ID** (lo necesitarás después)

### 2. Habilitar Vertex AI API

1. En Google Cloud Console, ve a **APIs & Services** > **Library**
2. Busca "Vertex AI API"
3. Haz clic en **Enable** (Habilitar)
4. Espera unos minutos a que se active

### 3. Crear Service Account (Cuenta de Servicio)

1. Ve a **IAM & Admin** > **Service Accounts**
2. Haz clic en **Create Service Account**
3. Completa:
   - **Name**: `verbadoc-vertex-ai`
   - **Description**: `Service account para VerbaDoc Salud - Vertex AI`
4. Haz clic en **Create and Continue**

### 4. Asignar Permisos

1. En la sección **Grant this service account access to project**:
   - Selecciona el rol: **Vertex AI User**
2. Haz clic en **Continue**
3. Haz clic en **Done**

### 5. Crear y Descargar Clave JSON

1. En la lista de Service Accounts, encuentra `verbadoc-vertex-ai`
2. Haz clic en los 3 puntos (⋮) > **Manage Keys**
3. Haz clic en **Add Key** > **Create New Key**
4. Selecciona **JSON**
5. Haz clic en **Create**
6. Se descargará un archivo `.json` - **GUÁRDALO DE FORMA SEGURA**

⚠️ **IMPORTANTE**: Este archivo contiene credenciales sensibles. No lo compartas ni lo subas a repositorios públicos.

---

## 🔧 Configuración Local (Desarrollo)

### 1. Crear archivo `.env`

En la raíz del proyecto, crea un archivo `.env`:

```bash
# Copia el contenido de .env.example
cp .env.example .env
```

### 2. Completar variables de entorno

Edita `.env` con tus datos:

```env
VITE_GEMINI_PROJECT_ID=tu-project-id-aqui
GOOGLE_CLOUD_PROJECT=tu-project-id-aqui
GOOGLE_APPLICATION_CREDENTIALS=./ruta/a/tu-service-account-key.json
VITE_GEMINI_LOCATION=europe-west1
```

### 3. Probar localmente

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Abre la aplicación y prueba una extracción. Deberías ver en la consola:
```
🇪🇺 Llamando a Vertex AI Europa: http://localhost:5173/api/extract
🇪🇺 Procesando con Vertex AI en europe-west1
📍 Proyecto: tu-project-id
✅ Respuesta generada
📍 Procesado en: europe-west1
```

---

## ☁️ Configuración en Vercel (Producción)

### 1. Ir al Dashboard de Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Selecciona tu proyecto VerbaDoc Salud
3. Ve a **Settings** > **Environment Variables**

### 2. Agregar Variables de Entorno

Agrega las siguientes variables:

#### Variable 1: VITE_GEMINI_PROJECT_ID
- **Name**: `VITE_GEMINI_PROJECT_ID`
- **Value**: Tu Project ID de Google Cloud
- **Environments**: Production, Preview, Development

#### Variable 2: GOOGLE_CLOUD_PROJECT
- **Name**: `GOOGLE_CLOUD_PROJECT`
- **Value**: Tu Project ID de Google Cloud (mismo que arriba)
- **Environments**: Production, Preview, Development

#### Variable 3: GOOGLE_APPLICATION_CREDENTIALS
- **Name**: `GOOGLE_APPLICATION_CREDENTIALS`
- **Value**: **CONTENIDO COMPLETO del archivo JSON** (copia y pega todo el contenido del archivo descargado)
- **Environments**: Production, Preview, Development

Ejemplo de cómo debe verse el JSON:
```json
{
  "type": "service_account",
  "project_id": "tu-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "verbadoc-vertex-ai@tu-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### 3. Desplegar

Una vez configuradas las variables:

```bash
# Desplegar a Vercel
vercel deploy --prod
```

O simplemente haz `git push` si tienes integración automática configurada.

### 4. Verificar en Producción

1. Abre tu aplicación desplegada en Vercel
2. Realiza una extracción de prueba
3. Abre la consola del navegador (F12)
4. Verifica que veas mensajes como:
   ```
   🇪🇺 Llamando a Vertex AI Europa: https://tu-app.vercel.app/api/extract
   📍 Procesado en: europe-west1
   ```

---

## ✅ Confirmación de Cumplimiento GDPR

Una vez desplegado, confirma:

- ✅ **Vercel**: Regiones `fra1` (Frankfurt) y `ams1` (Amsterdam) - Europa
- ✅ **Vertex AI**: Región `europe-west1` (Bélgica) - Europa
- ✅ **Procesamiento de datos**: 100% en servidores europeos
- ✅ **Modelos de IA**: Gemini 2.5 (Flash, Flash-Lite, Pro) disponibles en Europa
- ✅ **Sin transferencia a EE.UU.**: Todos los datos se procesan exclusivamente en la UE

---

## 🔒 Seguridad

### Archivos a ignorar en Git

Verifica que `.gitignore` incluya:

```
.env
.env.local
*.json  # Para evitar subir credenciales por error
service-account*.json
```

### Rotación de Credenciales

Recomendamos rotar las credenciales cada 90 días:
1. Crear nueva clave en Google Cloud Console
2. Actualizar variables en Vercel
3. Eliminar clave antigua en Google Cloud

---

## 🆘 Solución de Problemas

### Error: "Missing required fields: model, contents"
- **Causa**: Las variables de entorno no están configuradas correctamente
- **Solución**: Verifica que `VITE_GEMINI_PROJECT_ID` esté configurado

### Error: "Permission denied"
- **Causa**: El Service Account no tiene permisos
- **Solución**: Verifica que tenga el rol "Vertex AI User"

### Error: "Invalid credentials"
- **Causa**: El JSON de credenciales está mal formado
- **Solución**: Copia de nuevo el contenido completo del archivo JSON

### Los datos no se procesan en Europa
- **Causa**: La región no está configurada correctamente
- **Solución**: Verifica `vercel.json` tenga `"regions": ["fra1", "ams1"]`

---

## 📞 Contacto

Si tienes problemas con la configuración, revisa:
- [Documentación de Vertex AI](https://cloud.google.com/vertex-ai/docs)
- [Documentación de Vercel](https://vercel.com/docs)
- [GDPR y Google Cloud](https://cloud.google.com/privacy/gdpr)
