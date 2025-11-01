# 📘 Guía de Usuario - Extractor de Datos Profesional

## 🎯 ¿Qué es esta herramienta?

**Extractor de Datos Profesional** es una aplicación web que te ayuda a extraer información de documentos (PDFs, imágenes, textos) de forma automática usando Inteligencia Artificial.

**En palabras simples:** Subes un documento (como una factura, contrato o formulario), le dices qué información quieres sacar, y la herramienta te devuelve esa información organizada en formato de tabla que puedes descargar en Excel o CSV.

---

## 📚 Conceptos Básicos (para principiantes)

Antes de empezar, es importante entender algunos términos:

### ¿Qué es un "Esquema"?
Un **esquema** es como una plantilla que define qué datos quieres extraer. Por ejemplo:
- Nombre del cliente
- Fecha de factura
- Total a pagar

### ¿Qué es un "Prompt"?
Un **prompt** es la instrucción que le das a la IA. Es como pedirle a alguien que haga algo. Por ejemplo:
> "Extrae el nombre del cliente, la fecha y el total de esta factura"

### ¿Qué es JSON, CSV y Excel?
- **JSON**: Formato de datos que usa la computadora (lo verás en pantalla)
- **CSV**: Archivo de texto que puedes abrir en Excel como tabla
- **Excel**: Archivo .xls que se abre directamente en Microsoft Excel

---

## 🚀 Guía Paso a Paso - Tu Primera Extracción

### Paso 1: Abrir la Aplicación

1. Abre tu navegador web (Chrome, Firefox, Edge)
2. Ve a: `https://extractor-de-datos-profesional.vercel.app`
3. Verás una pantalla con 4 secciones:
   - **Izquierda (Plantillas)**: Plantillas predefinidas
   - **Centro-Izquierda (Lote de Documentos)**: Tus archivos subidos
   - **Centro (Editor)**: Donde configuras la extracción
   - **Derecha (Historial)**: Extracciones anteriores

---

### Paso 2: Subir tus Documentos

#### Opción A: Arrastra y Suelta
1. Encuentra tu archivo en tu computadora (PDF, imagen, etc.)
2. **Arrastra** el archivo hasta el cuadro que dice "Haga clic para subir o arrastre y suelte"
3. Suelta el archivo

#### Opción B: Hacer Clic y Seleccionar
1. Haz clic en el cuadro "Haga clic para subir"
2. Se abrirá una ventana de tu computadora
3. Busca y selecciona tu archivo
4. Haz clic en "Abrir"

**💡 Tip:** Puedes subir varios archivos a la vez si son similares (por ejemplo, 10 facturas del mismo formato)

---

### Paso 3: Ver tu Documento (Opcional)

Si quieres revisar el contenido del documento antes de extraer:

1. En la lista de archivos, busca el icono del **ojo** 👁️ al lado de tu archivo
2. Haz clic en el icono
3. Se abrirá una ventana grande mostrando el documento
4. Revisa el contenido
5. Haz clic en la **X** para cerrar

---

### Paso 4: Usar un Ejemplo (Recomendado para principiantes)

Si es tu primera vez, usa el ejemplo incluido:

1. Haz clic en **"Usar Ejemplo"** (botón con estrella ✨) en la parte superior del editor
2. Haz clic en **"Usar Ejemplo"** en el archivo de ejemplo
3. Verás que se llenan automáticamente:
   - El **Prompt** (instrucción)
   - El **Esquema** (estructura de datos)

**¡Ahora puedes practicar con datos de ejemplo!**

---

### Paso 5: Definir el Prompt (Instrucción)

El **prompt** es lo que le pides a la IA. Debe ser claro y específico.

#### Ejemplo de Buenos Prompts:

```
✅ BUENO: "Extrae el nombre completo del cliente, fecha de la factura, lista de productos comprados y el total a pagar"

❌ MALO: "Dame todo"
❌ MALO: "Info de la factura"
```

#### Consejos para escribir un buen prompt:
- Sé específico sobre QUÉ quieres extraer
- Menciona los nombres exactos de los campos
- Si hay listas (como productos), menciona "lista de..."
- Usa lenguaje natural, como si hablaras con alguien

---

### Paso 6: Definir el Esquema (Estructura de Datos)

El **esquema** es la estructura que tendrán tus datos extraídos.

#### Tipos de Campos Disponibles:

| Tipo | ¿Cuándo usarlo? | Ejemplo |
|------|-----------------|---------|
| **STRING** | Texto normal | Nombre, Dirección, Email |
| **NUMBER** | Números | Precio, Cantidad, Total |
| **BOOLEAN** | Sí/No, Verdadero/Falso | ¿Pagado?, ¿Activo? |
| **ARRAY_OF_STRINGS** | Lista de textos | Lista de categorías |
| **OBJECT** | Grupo de campos | Dirección completa (calle, ciudad, CP) |
| **ARRAY_OF_OBJECTS** | Lista de grupos | Lista de productos (cada uno con nombre y precio) |

#### Ejemplo Práctico - Factura:

```
Campo 1:
- Nombre: nombre_cliente
- Tipo: STRING

Campo 2:
- Nombre: fecha_factura
- Tipo: STRING

Campo 3:
- Nombre: productos
- Tipo: ARRAY_OF_OBJECTS
  Sub-campo 1:
  - Nombre: descripcion
  - Tipo: STRING

  Sub-campo 2:
  - Nombre: precio
  - Tipo: NUMBER

Campo 4:
- Nombre: total
- Tipo: NUMBER
```

#### Cómo Agregar Campos:

1. Escribe el **nombre del campo** (sin espacios, usa guión bajo `_`)
   - ✅ Correcto: `nombre_cliente`, `fecha_factura`, `total_pagar`
   - ❌ Incorrecto: `Nombre del Cliente`, `fecha factura`

2. Selecciona el **tipo** del desplegable

3. Si necesitas más campos, haz clic en el botón **"+"** verde

4. Si te equivocaste, haz clic en el botón **"🗑️"** rojo para eliminar

---

### Paso 7: Ejecutar la Extracción

1. Revisa que:
   - ✅ Tu archivo esté seleccionado (borde azul)
   - ✅ El prompt esté escrito
   - ✅ El esquema tenga al menos un campo
   - ✅ No haya errores en rojo

2. Haz clic en el botón azul grande: **"Ejecutar Extracción"**

3. Espera mientras dice "Extrayendo Datos..." (puede tardar 5-30 segundos)

4. Cuando termine, verás los resultados abajo en formato JSON

---

### Paso 8: Exportar los Datos

Una vez que veas los resultados, puedes descargarlos:

1. Busca los botones de exportación arriba de los resultados:
   - **JSON** (azul) - Para programadores o sistemas
   - **CSV** (verde) - Para Excel, Google Sheets
   - **Excel** (verde esmeralda) - Para Microsoft Excel

2. Haz clic en el formato que prefieras

3. El archivo se descargará automáticamente

4. Abre el archivo:
   - **CSV**: Abre con Excel o Google Sheets
   - **Excel**: Abre con Microsoft Excel
   - **JSON**: Abre con un editor de texto

---

## 🔄 Procesamiento en Lote (Múltiples Documentos)

Si tienes muchos documentos del mismo tipo:

### Paso a Paso:

1. **Sube todos los archivos** (arrastra los 10, 20, 50 archivos a la vez)

2. **Selecciona el primer archivo** y configura:
   - El prompt
   - El esquema

3. **Procesa el primero** para verificar que funciona

4. Si está correcto, haz clic en **"Procesar Todos"**

5. La aplicación procesará todos los archivos automáticamente

6. Cada archivo tendrá su propio resultado

7. Descarga los resultados uno por uno

**💡 Tip:** Todos los archivos deben tener el mismo formato para que funcione bien el procesamiento en lote

---

## 💾 Usar Plantillas

Las plantillas son configuraciones guardadas para tipos comunes de documentos.

### Plantillas Disponibles:

1. **📄 Factura Comercial**
   - Extrae: Cliente, Fecha, Productos, Total
   - Ideal para: Facturas, recibos

2. **📋 Formulario de Contacto**
   - Extrae: Nombre, Email, Teléfono, Mensaje
   - Ideal para: Formularios, solicitudes

3. **📊 Documento Corporativo**
   - Extrae: Título, Fecha, Categoría, Resumen
   - Ideal para: Reportes, documentos oficiales

### Cómo Usar una Plantilla:

1. Haz clic en la plantilla del panel izquierdo

2. El prompt y esquema se cargarán automáticamente

3. Modifica si es necesario

4. Ejecuta la extracción

---

## 🔍 Historial de Extracciones

El historial guarda tus últimas extracciones.

### Para Ver una Extracción Anterior:

1. Ve al panel derecho **"Historial"**

2. Busca la extracción por:
   - Nombre del archivo
   - Fecha y hora

3. Haz clic en el icono de **"↻ Replay"**

4. Se cargará el esquema que usaste

---

## ❓ Solución de Problemas Comunes

### Problema 1: "El esquema está vacío"

**Causa:** No agregaste campos al esquema

**Solución:**
1. Agrega al menos un campo
2. Escribe un nombre para el campo
3. Selecciona un tipo

---

### Problema 2: "Error de la API de Gemini"

**Causa:** Problema con la conexión o configuración

**Solución:**
1. Recarga la página (F5)
2. Intenta de nuevo
3. Si persiste, contacta al administrador

---

### Problema 3: "Los datos extraídos están incorrectos"

**Causa:** El prompt o esquema no son claros

**Solución:**
1. **Revisa tu prompt:** ¿Es específico?
2. **Revisa tu esquema:** ¿Los tipos de datos son correctos?
3. **Mejora el prompt:** Agrega más detalles
4. Ejemplo:
   ```
   Antes: "Extrae datos"
   Después: "Extrae el nombre completo del cliente (primera línea del documento), la fecha en formato DD/MM/YYYY, y todos los productos listados con sus precios"
   ```

---

### Problema 4: "No puedo abrir el archivo CSV en Excel"

**Solución:**
1. Abre Excel primero
2. Ve a **Archivo > Abrir**
3. Cambia el filtro a **"Todos los archivos"**
4. Selecciona tu archivo CSV
5. Excel te preguntará cómo importarlo
6. Selecciona:
   - Delimitador: Coma
   - Codificación: UTF-8

**Alternativa:** Usa el botón **"Excel"** en lugar de "CSV"

---

### Problema 5: "El documento no se ve en el visor"

**Causa:** El formato del archivo no es compatible

**Solución:**
- ✅ Formatos soportados: PDF, JPG, PNG, TIFF
- ❌ Formatos no soportados: DOCX, DOC, XLS, etc.
- Convierte tu documento a PDF primero

---

## 📊 Ejemplo Completo: Extraer Datos de una Factura

### Escenario:
Tienes 20 facturas en PDF y necesitas extraer la información a Excel.

### Paso a Paso:

1. **Abrir la aplicación**

2. **Subir las 20 facturas**
   - Arrastra los 20 PDFs a la zona de carga

3. **Seleccionar la primera factura**
   - Haz clic en la primera de la lista

4. **Escribir el prompt:**
   ```
   Extrae la siguiente información de la factura:
   - Nombre completo del cliente
   - Número de factura
   - Fecha de emisión
   - Lista de todos los productos o servicios facturados, incluyendo descripción y monto
   - Subtotal
   - IVA
   - Total a pagar
   ```

5. **Definir el esquema:**
   ```
   Campo 1: nombre_cliente (STRING)
   Campo 2: numero_factura (STRING)
   Campo 3: fecha_emision (STRING)
   Campo 4: productos (ARRAY_OF_OBJECTS)
     - descripcion (STRING)
     - monto (NUMBER)
   Campo 5: subtotal (NUMBER)
   Campo 6: iva (NUMBER)
   Campo 7: total (NUMBER)
   ```

6. **Ejecutar** en la primera factura para probar

7. **Revisar resultados** - ¿Están correctos?
   - ✅ Sí → Continúa al paso 8
   - ❌ No → Ajusta el prompt/esquema y prueba de nuevo

8. **Hacer clic en "Procesar Todos"**

9. **Esperar** a que termine (puede tardar varios minutos)

10. **Exportar cada resultado:**
    - Haz clic en cada archivo procesado
    - Click en "Excel"
    - Se descarga el archivo

11. **Abrir en Excel** y revisar

---

## 🎓 Consejos de Expertos

### 1. Nomenclatura de Campos

**Usa nombres descriptivos y sin espacios:**
```
✅ Bueno: fecha_emision, nombre_cliente, total_iva
❌ Malo: f, cliente, total
```

### 2. Tipos de Datos Correctos

**Usa el tipo adecuado para cada campo:**
```
Fechas → STRING (la IA entiende formatos de fecha)
Dinero → NUMBER
Listas → ARRAY_OF_STRINGS o ARRAY_OF_OBJECTS
Sí/No → BOOLEAN
```

### 3. Prompts Detallados

**Mientras más específico, mejor:**
```
❌ "Extrae la fecha"
✅ "Extrae la fecha de emisión que aparece en la esquina superior derecha, en formato DD/MM/YYYY"
```

### 4. Verificar Siempre el Primer Resultado

**Antes de procesar 100 documentos:**
- Procesa 1
- Verifica que sea correcto
- Ajusta si es necesario
- Luego procesa todos

### 5. Guardar Plantillas Mentalmente

**Para documentos que procesas frecuentemente:**
- Toma captura de pantalla de tu configuración
- O anota el prompt y esquema
- Reutiliza en el futuro

---

## 📞 Soporte y Ayuda

### ¿Necesitas más ayuda?

- **Documentación técnica:** Ver archivo `VERCEL_CONFIG.md`
- **Reporte de errores:** https://github.com/VCNPRO/Extractor-de-Datos-Profesional/issues
- **Contacto:** Consulta con el administrador del sistema

---

## 📌 Resumen Rápido (Cheat Sheet)

| Acción | Cómo hacerlo |
|--------|--------------|
| Subir archivo | Arrastra o haz clic en zona de carga |
| Ver documento | Click en icono de ojo 👁️ |
| Usar ejemplo | Click en "Usar Ejemplo" ✨ |
| Agregar campo | Click en botón "+" verde |
| Eliminar campo | Click en icono de basura 🗑️ |
| Extraer | Click en "Ejecutar Extracción" |
| Exportar Excel | Click en botón "Excel" verde |
| Exportar CSV | Click en botón "CSV" verde |
| Procesar lote | Click en "Procesar Todos" |

---

## 🎯 Próximos Pasos

Ahora que sabes cómo usar la herramienta:

1. ✅ Practica con el archivo de ejemplo
2. ✅ Prueba con tus propios documentos
3. ✅ Experimenta con diferentes esquemas
4. ✅ Comparte tus resultados con tu equipo

**¡Feliz extracción de datos! 🚀**
