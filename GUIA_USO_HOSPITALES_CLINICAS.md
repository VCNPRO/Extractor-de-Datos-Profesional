# 🏥 Guía de Uso para Hospitales y Clínicas

## VerbaDoc Salud - Sistema de Extracción de Datos Clínicos con IA

**Versión:** 2.0 (Vertex AI Europa)
**Fecha:** 7 de noviembre de 2025

---

## 📋 ÍNDICE

1. [Introducción](#1-introducción)
2. [Requisitos previos legales](#2-requisitos-previos-legales)
3. [Casos de uso recomendados](#3-casos-de-uso-recomendados)
4. [Procedimientos operativos](#4-procedimientos-operativos)
5. [Formación del personal](#5-formación-del-personal)
6. [Registro de actividades de tratamiento](#6-registro-de-actividades-de-tratamiento)
7. [Medidas de seguridad obligatorias](#7-medidas-de-seguridad-obligatorias)
8. [Gestión de incidencias](#8-gestión-de-incidencias)
9. [Auditorías y controles](#9-auditorías-y-controles)
10. [Check-list de cumplimiento](#10-check-list-de-cumplimiento)

---

## 1. INTRODUCCIÓN

### 1.1. ¿Qué es VerbaDoc Salud?

VerbaDoc Salud es una herramienta de **asistencia** basada en Inteligencia Artificial que permite extraer y estructurar información de documentos clínicos de forma automática.

### 1.2. ¿Para qué NO debe usarse?

❌ **NO debe utilizarse como sustituto del criterio médico profesional**
❌ **NO debe utilizarse para diagnósticos automáticos sin supervisión**
❌ **NO debe utilizarse para decisiones clínicas críticas sin validación humana**
❌ **NO debe utilizarse sin formación previa del personal**

### 1.3. ¿Para qué SÍ puede usarse?

✅ **Digitalización de historias clínicas en papel**
✅ **Extracción de datos para sistemas de gestión hospitalaria**
✅ **Facilitación de migración entre sistemas informáticos**
✅ **Reducción de errores de transcripción manual**
✅ **Mejora de eficiencia administrativa**
✅ **Análisis retrospectivo de datos clínicos (investigación)**

---

## 2. REQUISITOS PREVIOS LEGALES

### 2.1. Evaluación de Impacto (EIPD)

**¿Es obligatoria una EIPD?**

**SÍ**, si tu hospital/clínica:
- Trata datos de salud a gran escala (> 100 pacientes/día)
- Utiliza nuevas tecnologías (IA) para tratamiento de datos personales
- Realiza perfiles o decisiones automatizadas

**¿Cómo realizar la EIPD?**

1. **Identificar riesgos:**
   - Acceso no autorizado
   - Pérdida o fuga de datos
   - Uso indebido de la IA

2. **Evaluar probabilidad e impacto:**
   - Bajo, Medio, Alto, Muy Alto

3. **Implementar medidas de mitigación:**
   - Formación del personal
   - Control de accesos
   - Auditorías periódicas

4. **Documentar:**
   - Plantilla disponible en AEPD: https://www.aepd.es/guias/guia-evaluaciones-impacto-rgpd.pdf

### 2.2. Registro de Actividades de Tratamiento (RAT)

**Obligatorio para:**
- Hospitales y clínicas con más de 250 empleados
- Centros que tratan datos de salud de forma habitual

**Información a incluir en el RAT:**

| Campo | Descripción |
|-------|-------------|
| **Nombre del tratamiento** | "Extracción automática de datos clínicos con IA" |
| **Finalidad** | Digitalización y estructuración de documentación sanitaria |
| **Categorías de interesados** | Pacientes del centro sanitario |
| **Categorías de datos** | Datos de salud (Art. 9 GDPR) |
| **Destinatarios** | Google Cloud Platform (Vertex AI) - Encargado del tratamiento |
| **Transferencias internacionales** | NO (procesamiento exclusivo en UE) |
| **Plazos de supresión** | Según normativa de historia clínica (mínimo 5 años) |
| **Medidas de seguridad** | Cifrado TLS 1.3, autenticación IAM, sin almacenamiento persistente |

**Plantilla descargable:** https://www.aepd.es/documento/registro-actividades-tratamiento.xlsx

### 2.3. Contrato con Encargado del Tratamiento (DPA)

**¿Con quién hay que firmar un DPA?**

**Con Google Cloud Platform** (proveedor de Vertex AI)

**¿Cómo obtenerlo?**
- DPA estándar disponible en: https://cloud.google.com/terms/data-processing-addendum
- No requiere negociación individual (adhesión)
- Incluye Cláusulas Contractuales Tipo de la Comisión Europea

**Contenido mínimo del DPA (Art. 28 GDPR):**
- ✅ Objeto, duración, naturaleza y finalidad del tratamiento
- ✅ Categorías de datos y tipo de interesados
- ✅ Obligaciones y derechos del responsable
- ✅ Medidas de seguridad del encargado
- ✅ Subencargados (si aplica)
- ✅ Asistencia al responsable en el ejercicio de derechos
- ✅ Notificación de brechas de seguridad

### 2.4. Información a pacientes

**Obligación de informar (Art. 13-14 GDPR):**

Los pacientes deben ser informados de que sus datos de salud pueden ser tratados mediante herramientas de IA.

**¿Cómo informar?**

**Opción A - Cartel informativo:**
```
"Este centro utiliza herramientas de Inteligencia Artificial para mejorar
la gestión de su documentación clínica. Sus datos se procesan exclusivamente
en servidores de la Unión Europea y son revisados por profesionales
sanitarios. Para más información, consulte nuestra Política de Privacidad
o contacte con nuestro Delegado de Protección de Datos."
```

**Opción B - Cláusula en consentimiento informado:**
```
"Autorizo el tratamiento de mis datos de salud mediante herramientas de
Inteligencia Artificial para la gestión de mi historia clínica, siempre
bajo supervisión de profesionales sanitarios."

□ Acepto    Firma: __________________
```

---

## 3. CASOS DE USO RECOMENDADOS

### 3.1. Digitalización de historias clínicas en papel

**Escenario:**
Hospital con archivo histórico en papel que desea digitalizarlo para migrar a sistema informático.

**Proceso:**
1. Escanear historia clínica en papel → PDF
2. Subir PDF a VerbaDoc Salud
3. Definir esquema de extracción (campos del nuevo sistema)
4. Revisar datos extraídos manualmente
5. Exportar a Excel
6. Importar a sistema de gestión hospitalaria

**Personal requerido:**
- Administrativo sanitario (carga de documentos)
- Profesional sanitario (validación de datos clínicos)

**Tiempo estimado:**
- 5-10 minutos por historia clínica compleja
- 2-3 minutos por informe simple

### 3.2. Procesamiento de informes médicos externos

**Escenario:**
Paciente llega con informes de otro centro (análisis, radiología, especialistas).

**Proceso:**
1. Paciente entrega informes en papel/PDF
2. Administrativo sube a VerbaDoc Salud
3. Extracción automática de datos clave (diagnóstico, medicación, fechas)
4. Médico revisa y valida la información
5. Datos se integran en historia clínica del paciente

**Ventajas:**
- Reducción de tiempo de consulta
- Menor riesgo de errores de transcripción
- Información estructurada y buscable

### 3.3. Análisis retrospectivo para investigación

**Escenario:**
Investigación clínica que requiere extraer datos de historias clínicas antiguas.

**Proceso:**
1. Seleccionar muestra de historias clínicas
2. Anonimizar documentos (eliminar datos identificativos)
3. Subir a VerbaDoc Salud
4. Definir variables de estudio
5. Exportar resultados a Excel para análisis estadístico

**Consideraciones legales:**
- Requiere aprobación de Comité Ético de Investigación
- Anonimización obligatoria si no hay consentimiento específico
- Base legal: Art. 9.2.j GDPR (investigación científica)

### 3.4. Migración entre sistemas de información

**Escenario:**
Hospital cambia de sistema de gestión hospitalaria y necesita migrar datos.

**Proceso:**
1. Exportar historias clínicas desde sistema antiguo (PDF o similar)
2. VerbaDoc Salud extrae datos según esquema del nuevo sistema
3. Validación masiva por profesionales
4. Importación al nuevo sistema

**Ventajas:**
- Aceleración del proceso de migración
- Reducción de costes de consultoría
- Mayor control interno

---

## 4. PROCEDIMIENTOS OPERATIVOS

### 4.1. Protocolo de uso diario

**PASO 1: Verificación de acceso**
- Solo personal autorizado puede usar VerbaDoc Salud
- Usuario debe identificarse en registro de uso (opcional pero recomendado)

**PASO 2: Carga de documento**
- Verificar que el documento no contiene datos de terceros no autorizados
- Subir documento a https://verbadoc-salud.vercel.app

**PASO 3: Configuración de extracción**
- Seleccionar modelo de IA (recomendado: gemini-2.5-flash)
- Definir campos a extraer según necesidades
- O usar plantilla predefinida

**PASO 4: Revisión de resultados**
- **CRÍTICO:** El profesional sanitario DEBE revisar todos los datos extraídos
- Corregir errores manualmente
- Verificar coherencia clínica

**PASO 5: Exportación**
- Exportar datos a formato deseado (Excel, CSV, PDF)
- Guardar en sistema de gestión hospitalaria

**PASO 6: Limpieza**
- Eliminar historial local si no es necesario conservarlo
- Borrar archivos temporales del dispositivo

### 4.2. Control de calidad

**Auditoría aleatoria mensual:**
- Seleccionar 10-20 extracciones al azar
- Comparar datos extraídos con documento original
- Calcular tasa de error
- Objetivo: < 2% de errores críticos

**Errores críticos vs. no críticos:**

| Tipo de error | Ejemplo | Gravedad |
|---------------|---------|----------|
| **Crítico** | Dosis de medicación incorrecta | 🔴 Alta |
| **Crítico** | Diagnóstico erróneo | 🔴 Alta |
| **Crítico** | Alergia no detectada | 🔴 Alta |
| **No crítico** | Fecha con formato diferente | 🟡 Baja |
| **No crítico** | Nombre con mayúscula incorrecta | 🟡 Baja |

**Acción si tasa de error > 2%:**
- Revisar configuración de esquema de extracción
- Mejorar calidad de documentos de entrada (escaneos más legibles)
- Considerar cambio de modelo de IA
- Reforzar formación del personal

---

## 5. FORMACIÓN DEL PERSONAL

### 5.1. Programa de formación obligatoria

**Duración:** 2-3 horas

**Contenido:**

**Módulo 1: Protección de datos (45 min)**
- Qué es el GDPR y por qué es importante
- Datos de salud como categoría especial
- Derechos de los pacientes
- Qué hacer en caso de brecha de seguridad

**Módulo 2: Uso de VerbaDoc Salud (45 min)**
- Demostración práctica de la herramienta
- Cómo configurar extracciones
- Revisión y validación de resultados
- Exportación de datos

**Módulo 3: Buenas prácticas (30 min)**
- Casos de uso recomendados y prohibidos
- Control de calidad
- Gestión de incidencias
- Preguntas frecuentes

**Módulo 4: Evaluación (15 min)**
- Cuestionario de 10 preguntas
- Puntuación mínima aprobatoria: 8/10

### 5.2. Certificado de formación

**Modelo de certificado:**

```
CERTIFICADO DE FORMACIÓN

Se certifica que [Nombre del empleado] ha completado satisfactoriamente
la formación "Uso de VerbaDoc Salud y Protección de Datos en Salud"
impartida por [Nombre del hospital/clínica].

Fecha: _______________
Duración: 3 horas
Calificación: ____ / 10

Firma del formador: _______________
Firma del empleado: _______________
```

### 5.3. Formación de reciclaje

**Frecuencia:** Anual

**Duración:** 1 hora

**Contenido:**
- Novedades normativas
- Nuevas funcionalidades de VerbaDoc Salud
- Repaso de incidencias del año anterior
- Mejores prácticas identificadas

---

## 6. REGISTRO DE ACTIVIDADES DE TRATAMIENTO

### 6.1. Información a documentar

**Plantilla de RAT para VerbaDoc Salud:**

```
═══════════════════════════════════════════════════════════
REGISTRO DE ACTIVIDADES DE TRATAMIENTO
═══════════════════════════════════════════════════════════

1. RESPONSABLE DEL TRATAMIENTO
   Nombre: [Hospital/Clínica]
   CIF: [CIF]
   Dirección: [Dirección]
   DPO: [Nombre del DPO]

2. ACTIVIDAD DE TRATAMIENTO
   Nombre: Extracción automática de datos clínicos con IA (VerbaDoc Salud)

3. FINALIDAD
   - Digitalización de documentación sanitaria
   - Extracción estructurada de datos clínicos
   - Mejora de eficiencia administrativa
   - Facilitación de migración entre sistemas

4. BASE JURÍDICA
   - Art. 9.2.h GDPR (fines de medicina preventiva, diagnóstico médico,
     prestación de asistencia sanitaria, gestión de sistemas de salud)

5. CATEGORÍAS DE INTERESADOS
   - Pacientes del centro sanitario

6. CATEGORÍAS DE DATOS TRATADOS
   - Datos identificativos (nombre, DNI, fecha nacimiento, dirección)
   - Datos de salud (diagnósticos, tratamientos, análisis, antecedentes)
   - Datos del profesional sanitario (nombre, nº colegiado)

7. CATEGORÍAS DE DESTINATARIOS
   - Google Cloud Platform (Vertex AI) - Encargado del tratamiento
     Ubicación: UE (Bélgica - europe-west1)
     DPA: https://cloud.google.com/terms/data-processing-addendum

8. TRANSFERENCIAS INTERNACIONALES
   NO (procesamiento exclusivo en UE)

9. PLAZOS DE SUPRESIÓN
   - Documento original: No se almacena (procesamiento efímero)
   - Datos extraídos: Según normativa de historia clínica aplicable
     (Ley 41/2002: mínimo 5 años desde alta médica, 15 años en caso de fallecimiento)

10. MEDIDAS DE SEGURIDAD TÉCNICAS
    - Cifrado TLS 1.3 en comunicaciones
    - Autenticación Google Cloud IAM
    - Sin almacenamiento persistente de datos en servidores de procesamiento
    - Procesamiento en región europea certificada
    - Control de acceso basado en roles

11. MEDIDAS DE SEGURIDAD ORGANIZATIVAS
    - Formación obligatoria del personal en protección de datos
    - Control de acceso restringido a personal autorizado
    - Auditorías de calidad mensuales
    - Protocolo de gestión de incidencias
    - Revisión anual de medidas de seguridad

12. EVALUACIÓN DE IMPACTO (EIPD)
    ☐ Realizada    Fecha: _______________
    ☐ No aplicable (justificar): _______________

13. FECHA DE CREACIÓN DEL REGISTRO
    _______________

14. FIRMA DEL RESPONSABLE / DPO
    _______________
═══════════════════════════════════════════════════════════
```

---

## 7. MEDIDAS DE SEGURIDAD OBLIGATORIAS

### 7.1. A nivel de centro sanitario

**Control de acceso físico:**
- ✅ Acceso restringido a estaciones de trabajo con VerbaDoc Salud
- ✅ Pantallas con filtros de privacidad en zonas públicas
- ✅ Bloqueo automático de sesión tras 5 min de inactividad

**Control de acceso lógico:**
- ✅ Usuario y contraseña individual (no compartida)
- ✅ Contraseñas robustas (mínimo 12 caracteres, alfanumérico)
- ✅ Autenticación de dos factores (2FA) recomendada

**Gestión de dispositivos:**
- ✅ Antivirus actualizado
- ✅ Firewall activado
- ✅ Sistema operativo con últimas actualizaciones de seguridad
- ✅ Cifrado de disco duro (BitLocker, FileVault, etc.)

**Red:**
- ✅ Conexión a través de red segura del hospital (no Wi-Fi pública)
- ✅ VPN si se accede desde fuera del centro

### 7.2. A nivel de usuario

**Buenas prácticas:**
- ❌ NO compartir credenciales
- ❌ NO dejar sesión abierta sin supervisión
- ❌ NO usar VerbaDoc Salud desde dispositivos personales no autorizados
- ❌ NO enviar documentos con datos de salud por email no cifrado
- ✅ Cerrar sesión al terminar
- ✅ Eliminar historial local periódicamente
- ✅ Borrar archivos exportados tras uso
- ✅ Reportar inmediatamente cualquier incidencia de seguridad

---

## 8. GESTIÓN DE INCIDENCIAS

### 8.1. Tipos de incidencias

**Nivel 1 - CRÍTICO (brecha de seguridad):**
- Acceso no autorizado a datos de pacientes
- Fuga o pérdida de datos
- Ataque de malware/ransomware

**Nivel 2 - ALTO (error funcional):**
- Extracción incorrecta de datos críticos (dosis, diagnóstico)
- Fallo del sistema que impide validación humana

**Nivel 3 - MEDIO (error operativo):**
- Extracción incorrecta de datos no críticos
- Problemas de rendimiento

**Nivel 4 - BAJO (consulta):**
- Dudas de uso
- Solicitud de mejoras

### 8.2. Protocolo de actuación ante brecha de seguridad

**Fase 1: Detección (0-2 horas)**
1. Empleado detecta o sospecha brecha
2. Notificación inmediata al responsable de seguridad / DPO
3. NO tomar acciones que puedan destruir evidencias

**Fase 2: Contención (2-8 horas)**
1. Aislar sistema afectado
2. Cambiar credenciales comprometidas
3. Documentar incidente (qué, cuándo, quién, cómo)

**Fase 3: Evaluación (8-24 horas)**
1. Determinar:
   - ¿Qué datos se han visto afectados?
   - ¿Cuántos pacientes afectados?
   - ¿Existe riesgo para derechos y libertades?

**Fase 4: Notificación (< 72 horas desde detección)**
1. **A la AEPD** (obligatorio si riesgo para derechos):
   - Formulario en: https://sedeagpd.gob.es
   - Plazo: Máximo 72 horas

2. **A los afectados** (obligatorio si alto riesgo):
   - Comunicación clara y concisa
   - Medidas adoptadas
   - Recomendaciones

**Fase 5: Remediación (semanas siguientes)**
1. Implementar medidas correctivas
2. Auditoría post-incidente
3. Actualización de procedimientos

### 8.3. Registro de incidencias

**Obligatorio mantener un registro de:**
- Fecha y hora de detección
- Descripción de la incidencia
- Datos afectados
- Número de interesados afectados
- Medidas adoptadas
- Notificaciones realizadas (AEPD, afectados)
- Resolución

**Plantilla:**
```
REGISTRO DE INCIDENCIAS - VERBADOC SALUD

ID Incidencia: _____
Fecha: _____
Hora: _____
Reportado por: _____

Descripción:
_____________________________________________________

Datos afectados: ☐ Sí  ☐ No
Nº pacientes afectados: _____
Nivel de gravedad: ☐ Crítico  ☐ Alto  ☐ Medio  ☐ Bajo

Medidas inmediatas adoptadas:
_____________________________________________________

Notificación a AEPD: ☐ Sí (Fecha: _______)  ☐ No (Justificar: ______)
Notificación a afectados: ☐ Sí (Fecha: _______)  ☐ No (Justificar: ______)

Resolución:
_____________________________________________________

Fecha de cierre: _____
Firma del responsable: _____
```

---

## 9. AUDITORÍAS Y CONTROLES

### 9.1. Auditoría anual

**Alcance:**
- Revisión de cumplimiento GDPR
- Verificación de medidas de seguridad
- Análisis de incidencias del año
- Evaluación de formación del personal

**Responsable:**
- DPO o auditor externo

**Entregables:**
- Informe de auditoría
- Plan de mejora
- Calendario de implementación

### 9.2. Control de calidad mensual

**Objetivo:**
Verificar que la IA extrae datos correctamente

**Metodología:**
1. Seleccionar muestra aleatoria de 20 extracciones
2. Comparar con documento original
3. Calcular tasa de error
4. Documentar hallazgos

**Indicadores:**
- Tasa de error global: < 2%
- Tasa de errores críticos: < 0.5%
- Tiempo promedio de revisión: < 3 min/documento

**Acciones correctivas si NO se cumplen indicadores:**
- Reforzar formación
- Ajustar configuración de esquemas
- Mejorar calidad de documentos de entrada

---

## 10. CHECK-LIST DE CUMPLIMIENTO

### 10.1. Antes de empezar a usar VerbaDoc Salud

```
☐ Evaluación de Impacto (EIPD) realizada y documentada
☐ Registro de Actividades de Tratamiento (RAT) actualizado
☐ DPA con Google Cloud Platform revisado y aceptado
☐ Política de Privacidad actualizada (mencionar uso de IA)
☐ Información a pacientes implementada (carteles/consentimientos)
☐ Formación del personal completada (100% usuarios)
☐ Medidas de seguridad implementadas (firewall, antivirus, etc.)
☐ Protocolo de gestión de incidencias aprobado
☐ Designación de responsable de seguridad / DPO (si aplica)
☐ Aprobación de Dirección / Comité de Ética
```

### 10.2. Durante el uso (controles periódicos)

```
☐ Auditoría de calidad mensual
☐ Revisión trimestral de accesos y usuarios
☐ Formación de reciclaje anual
☐ Revisión anual de medidas de seguridad
☐ Auditoría GDPR anual
☐ Actualización de RAT cuando cambien tratamientos
☐ Reporte de incidencias a DPO/Responsable de Seguridad
```

---

## 11. CONTACTO Y SOPORTE

### 11.1. Soporte técnico VerbaDoc Salud

**Email:** [Tu email de soporte]
**Documentación:** https://github.com/VCNPRO/verbadoc_salud

### 11.2. Consultas GDPR

**Agencia Española de Protección de Datos (AEPD)**
- Web: https://www.aepd.es
- Teléfono: 901 100 099
- Formulario consultas: https://sedeagpd.gob.es

---

**Documento elaborado por:** [Tu nombre/organización]
**Fecha:** 7 de noviembre de 2025
**Versión:** 2.0

🇪🇺 **VerbaDoc Salud - 100% Datos en Europa**
