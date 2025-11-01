# Configuración de Vercel para Extractor de Datos Profesional

## Variables de Entorno Requeridas

Para que la aplicación funcione correctamente en Vercel, asegúrate de tener configurada la siguiente variable de entorno:

### En Vercel Dashboard:

1. Ve a tu proyecto: https://vercel.com/solammedia-9886s-projects/extractor-de-datos-profesional
2. Click en **Settings** (Configuración)
3. Click en **Environment Variables** (Variables de Entorno)
4. Agrega la siguiente variable:

```
Nombre: GEMINI_API_KEY
Valor: [Tu API Key de Google AI Studio]
Environments: Production, Preview, Development
```

## ¿Cómo obtener tu API Key de Gemini?

1. Visita: https://aistudio.google.com/apikey
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API Key
4. Copia la clave y pégala en Vercel

## Comportamiento de la App

### En Producción (Vercel):
- ✅ Si `GEMINI_API_KEY` está configurada en Vercel → Se usa automáticamente
- 🟢 El botón mostrará "API Key (ENV)" en verde
- 🔒 No se pedirá al usuario que ingrese la clave

### En Desarrollo Local:
- 📝 Si existe `.env.local` con `GEMINI_API_KEY` → Se usa automáticamente
- 💾 Si no hay `.env.local` → Busca en localStorage del navegador
- ⚠️ Si no hay clave guardada → Muestra modal para ingresar

## Archivos Modificados

- `App.tsx` - Ahora lee primero de `process.env.GEMINI_API_KEY`
- `vite.config.ts` - Ya estaba configurado correctamente para inyectar variables de entorno

## Deploy a Vercel

```bash
# Opción 1: Desde GitHub (recomendado)
git add .
git commit -m "Fix: Use environment variables for API key"
git push origin main
# Vercel detectará el push y hará deploy automáticamente

# Opción 2: Deploy manual
npm run build
vercel --prod
```

## Verificación

Después del deploy, verifica que:
1. El botón "API Key" en la esquina superior derecha muestre "API Key (ENV)" en verde
2. La aplicación NO solicite ingresar la API key al cargar
3. Puedes procesar documentos sin errores de autenticación

---

**Nota de Seguridad:**
La API key configurada en Vercel solo está disponible en tiempo de build. Aunque esto es más seguro que localStorage, para máxima seguridad considera crear API routes serverless en el futuro.
