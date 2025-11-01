# Configuración de Vercel para Extractor de Datos Profesional

## ⚠️ Variables de Entorno REQUERIDAS

**IMPORTANTE:** Esta aplicación **NO tiene interfaz para ingresar API keys**. La variable de entorno `GEMINI_API_KEY` es **obligatoria** y debe configurarse en Vercel antes del deploy.

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
- ✅ Si `GEMINI_API_KEY` está configurada → La app funciona normalmente
- ❌ Si NO está configurada → Muestra banner de error en rojo con instrucciones
- 🔒 **No hay botón de API Key** - Solo usa variables de entorno

### En Desarrollo Local:
- 📝 Crea un archivo `.env.local` con `GEMINI_API_KEY=tu_clave_aqui`
- ✅ La app usará la clave del archivo `.env.local`
- ❌ Si no existe el archivo → Muestra banner de error

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
1. **NO aparezca el banner de error rojo** en la parte superior
2. La aplicación cargue normalmente sin errores
3. Puedes procesar documentos sin errores de autenticación

## ❌ Si ves el banner de error

Si ves un banner rojo que dice **"Error de Configuración: API Key no encontrada"**:

1. Verifica que agregaste `GEMINI_API_KEY` en las variables de entorno de Vercel
2. Asegúrate de seleccionar **Production, Preview, y Development**
3. Haz un **Redeploy** desde el dashboard de Vercel
4. Espera 1-2 minutos a que termine el build

---

**Nota de Seguridad:**
✅ Sin botón de API Key en el navegador - Más seguro
✅ Solo administradores con acceso a Vercel pueden cambiar la clave
✅ Los usuarios no pueden ver ni modificar la API key
