# 🏥 Política de Privacidad y Protección de Datos - VerbaDoc Salud

## Aplicación de Extracción de Datos Clínicos con IA

**Versión:** 2.0
**Fecha de entrada en vigor:** 7 de noviembre de 2025
**Última actualización:** 7 de noviembre de 2025

---

## 1. INFORMACIÓN GENERAL

### 1.1. Responsable del tratamiento

**[NOMBRE DE TU ORGANIZACIÓN/CLÍNICA/HOSPITAL]**
- **CIF/NIF:** [Tu NIF]
- **Dirección:** [Tu dirección completa]
- **Email de contacto:** [Tu email]
- **Teléfono:** [Tu teléfono]
- **Sitio web:** https://verbadoc-salud.vercel.app

### 1.2. Delegado de Protección de Datos (DPO)

**Nombre:** [Nombre del DPO o "No designado" si no aplica]
**Email:** [Email del DPO]
**Teléfono:** [Teléfono del DPO]

> **Nota:** La designación de un DPO es obligatoria para autoridades públicas y para responsables/encargados cuyas actividades principales consistan en tratamientos que requieran observación regular y sistemática de interesados a gran escala, o tratamiento a gran escala de datos sensibles (Art. 37 GDPR).

---

## 2. ¿QUÉ ES VERBADOC SALUD?

VerbaDoc Salud es una aplicación web que utiliza Inteligencia Artificial para **extraer y estructurar información** de documentos clínicos (historias clínicas, informes médicos, recetas, análisis, etc.).

### 2.1. Finalidad principal

Facilitar la digitalización y estructuración de documentación sanitaria para mejorar la eficiencia en la gestión clínica y administrativa.

### 2.2. Usuarios destinatarios

- Hospitales y clínicas
- Profesionales sanitarios (médicos, enfermeros, administrativos sanitarios)
- Centros de salud
- Laboratorios clínicos
- Centros de atención primaria

---

## 3. DATOS PERSONALES QUE TRATAMOS

### 3.1. Categorías de datos

**A. Datos de identificación del paciente:**
- Nombre completo
- DNI/NIE/Pasaporte
- Fecha de nacimiento
- Edad
- Género
- Dirección postal
- Teléfono
- Email

**B. Datos de salud (categoría especial según Art. 9 GDPR):**
- Diagnósticos médicos
- Tratamientos y prescripciones
- Resultados de análisis clínicos
- Antecedentes médicos
- Alergias e intolerancias
- Historial de vacunación
- Cirugías y procedimientos médicos
- Datos genéticos (si aplica)
- Datos biométricos (si aplica)
- Información sobre enfermedades crónicas
- Información psicológica o psiquiátrica (si aplica)

**C. Datos del profesional sanitario:**
- Nombre del médico o profesional
- Número de colegiado
- Especialidad médica
- Firma digital (si aplica)

### 3.2. Origen de los datos

**Directamente proporcionados por el usuario:**
- Documentos subidos manualmente por el usuario (profesional sanitario o personal autorizado)

**NO recopilamos datos de:**
- Cookies de seguimiento
- Redes sociales
- Terceros no autorizados

---

## 4. BASE JURÍDICA DEL TRATAMIENTO

### 4.1. Para datos comunes (Art. 6 GDPR)

**a) Consentimiento del interesado (Art. 6.1.a)**
- El usuario (profesional sanitario o institución) proporciona consentimiento explícito al subir documentos a la aplicación.

**b) Interés legítimo (Art. 6.1.f)**
- Mejora de la eficiencia en la gestión sanitaria
- Reducción de errores de transcripción manual
- Facilitación del acceso a información clínica estructurada

### 4.2. Para datos de salud (Art. 9.2 GDPR)

**Base jurídica específica: Art. 9.2.h GDPR**

> "El tratamiento es necesario para fines de medicina preventiva o laboral, evaluación de la capacidad laboral del trabajador, diagnóstico médico, prestación de asistencia o tratamiento de tipo sanitario o social, o gestión de los sistemas y servicios de asistencia sanitaria o social."

**Garantías adicionales:**
- El tratamiento es realizado por o bajo la responsabilidad de un profesional sujeto al secreto profesional
- Se implementan medidas técnicas y organizativas apropiadas (ver Sección 7)

---

## 5. ¿CÓMO TRATAMOS TUS DATOS?

### 5.1. Proceso de extracción

**Paso 1: Carga del documento**
- El usuario sube un documento (PDF, imagen, etc.) desde su dispositivo
- El archivo se carga temporalmente en la memoria del navegador
- **NO se almacena en servidores en este punto**

**Paso 2: Envío a Vertex AI (Google Cloud)**
- El documento se envía de forma cifrada (HTTPS/TLS 1.3) a Vertex AI en **europe-west1 (Bélgica)**
- El modelo de IA Gemini 2.5 analiza el documento
- Se extraen solo los campos solicitados por el usuario

**Paso 3: Recepción de resultados**
- Los datos extraídos se reciben en el navegador del usuario
- El usuario puede revisar, editar y exportar los datos

**Paso 4: Limpieza**
- El documento original **NO se almacena** en los servidores de Google Cloud
- El procesamiento es **efímero** (temporal)
- Google Cloud puede mantener logs técnicos por motivos de seguridad (sin contenido del documento)

### 5.2. Almacenamiento local

**En el navegador del usuario (localStorage):**
- Se guarda un historial de extracciones realizadas
- Este historial es **local**, solo accesible desde el mismo navegador
- El usuario puede **eliminar el historial** en cualquier momento

**NO se almacena en servidores remotos:**
- Los datos extraídos NO se guardan en bases de datos de VerbaDoc Salud
- Los datos extraídos NO se guardan permanentemente en Google Cloud

---

## 6. DESTINATARIOS DE LOS DATOS

### 6.1. Encargados del tratamiento

| Entidad | Rol | Ubicación | Datos compartidos | Base legal |
|---------|-----|-----------|-------------------|----------|
| **Google Cloud Platform (Vertex AI)** | Procesamiento de IA | 🇪🇺 Bélgica (europe-west1) | Documento completo + esquema de extracción | Art. 28 GDPR (DPA firmado) |
| **Vercel Inc.** | Hosting de aplicación web | 🇪🇺 Alemania (fra1) / Francia (cdg1) | Ninguno (solo código de aplicación) | Art. 28 GDPR |

### 6.2. Garantías de los encargados

**Google Cloud Platform:**
- ✅ DPA (Data Processing Agreement) firmado conforme a GDPR
- ✅ Cláusulas Contractuales Tipo (CCT) de la Comisión Europea
- ✅ Certificaciones: ISO 27001, ISO 27017, ISO 27018, SOC 2/3
- ✅ Disponible en: https://cloud.google.com/terms/data-processing-addendum

**Vercel:**
- ✅ Términos de servicio conformes a GDPR
- ✅ Procesamiento exclusivo en regiones europeas configuradas
- ✅ Certificado SSL/TLS válido

### 6.3. NO se transfiere a terceros

- ❌ NO se venden datos a terceros
- ❌ NO se comparten datos con anunciantes
- ❌ NO se utilizan datos para marketing
- ❌ NO se transfieren datos fuera de la UE/EEE

---

## 7. MEDIDAS DE SEGURIDAD

### 7.1. Medidas técnicas

**Cifrado:**
- ✅ TLS 1.3 en todas las comunicaciones
- ✅ Certificados SSL válidos y actualizados
- ✅ HTTPS obligatorio

**Autenticación:**
- ✅ Google Cloud IAM (Identity and Access Management)
- ✅ Service Accounts con permisos mínimos necesarios
- ✅ Rotación de credenciales cada 90 días

**Infraestructura:**
- ✅ Servidores exclusivamente en la Unión Europea
- ✅ Multi-región para alta disponibilidad (Frankfurt, París)
- ✅ Sin almacenamiento persistente de datos sensibles

**Auditoría:**
- ✅ Logs de actividad en Google Cloud Logging
- ✅ Monitoreo de accesos
- ✅ Alertas de seguridad configuradas

### 7.2. Medidas organizativas

**Acceso restringido:**
- Solo personal autorizado puede acceder a credenciales de sistema
- Formación obligatoria en protección de datos para el personal

**Política de contraseñas:**
- Contraseñas robustas obligatorias
- Autenticación de dos factores (2FA) recomendada

**Gestión de incidentes:**
- Protocolo de respuesta ante brechas de seguridad
- Notificación a AEPD en < 72 horas si procede
- Notificación a afectados si existe alto riesgo

---

## 8. CONSERVACIÓN DE DATOS

### 8.1. Plazo de conservación

| Ubicación | Datos | Plazo de conservación |
|-----------|-------|----------------------|
| **Servidores Vertex AI** | Documento original + datos extraídos | **0 días** (procesamiento efímero, sin almacenamiento) |
| **Logs técnicos de Google Cloud** | Metadatos de petición (sin contenido) | 30 días (política de Google Cloud) |
| **Navegador del usuario (localStorage)** | Historial de extracciones | **Indefinido hasta que el usuario lo elimine** |
| **Dispositivo del usuario (exportaciones)** | Archivos Excel/CSV/PDF exportados | **Indefinido hasta que el usuario lo elimine** |

### 8.2. Criterios de conservación

**Los datos deben conservarse solo durante el tiempo necesario para:**
- Cumplir con la finalidad de la extracción
- Cumplir con obligaciones legales del responsable del tratamiento

**Eliminación:**
- El usuario puede eliminar el historial local en cualquier momento desde la interfaz de VerbaDoc Salud
- No es necesario solicitar eliminación de datos del servidor (no se almacenan)

---

## 9. DERECHOS DE LOS INTERESADOS

Según los artículos 15 a 22 del GDPR, los interesados (pacientes) tienen los siguientes derechos:

### 9.1. Derecho de acceso (Art. 15)

**¿Qué es?** Derecho a obtener confirmación de si se están tratando datos personales y acceder a ellos.

**¿Cómo ejercerlo?**
- Contactar con [email de contacto]
- Respuesta en máximo 1 mes

### 9.2. Derecho de rectificación (Art. 16)

**¿Qué es?** Derecho a corregir datos inexactos.

**¿Cómo ejercerlo?**
- El usuario puede corregir datos extraídos antes de exportarlos
- Para datos ya exportados, responsabilidad del usuario (hospital/clínica)

### 9.3. Derecho de supresión "derecho al olvido" (Art. 17)

**¿Qué es?** Derecho a solicitar la eliminación de datos.

**¿Cómo ejercerlo?**
- Eliminar historial desde la interfaz de VerbaDoc Salud
- Para datos exportados, responsabilidad del usuario (hospital/clínica)

### 9.4. Derecho a la limitación del tratamiento (Art. 18)

**¿Qué es?** Derecho a solicitar que se suspendan tratamientos.

**¿Cómo ejercerlo?**
- Contactar con [email de contacto]

### 9.5. Derecho a la portabilidad (Art. 20)

**¿Qué es?** Derecho a recibir datos en formato estructurado y transmitirlos a otro responsable.

**¿Cómo ejercerlo?**
- Exportar datos a Excel, CSV o PDF desde VerbaDoc Salud

### 9.6. Derecho de oposición (Art. 21)

**¿Qué es?** Derecho a oponerse al tratamiento de datos.

**¿Cómo ejercerlo?**
- Dejar de usar VerbaDoc Salud
- Contactar con [email de contacto]

### 9.7. Derecho a no ser objeto de decisiones individuales automatizadas (Art. 22)

**¿Aplica?** NO, porque:
- VerbaDoc Salud es una herramienta de asistencia
- El profesional sanitario siempre revisa y valida los resultados
- No se toman decisiones automatizadas sin intervención humana

---

## 10. TRANSFERENCIAS INTERNACIONALES

### 10.1. ¿Se transfieren datos fuera de la UE/EEE?

**NO.**

- ✅ Todos los datos se procesan en **europe-west1 (Bélgica)**
- ✅ Servidores de aplicación en **fra1 (Alemania)** y **cdg1 (Francia)**
- ✅ **0% de datos procesados en EE.UU. u otros terceros países**

### 10.2. Garantías adicionales

En caso de que en el futuro se requiera transferencia internacional:
- Se utilizarán Cláusulas Contractuales Tipo de la Comisión Europea
- Se notificará en esta política de privacidad
- Se solicitará consentimiento si es necesario

---

## 11. RECLAMACIONES

### 11.1. Autoridad de control

Si consideras que el tratamiento de tus datos no es conforme a la normativa, tienes derecho a presentar una reclamación ante:

**Agencia Española de Protección de Datos (AEPD)**
- **Dirección:** C/ Jorge Juan, 6, 28001 Madrid
- **Teléfono:** 901 100 099 / 912 663 517
- **Sede electrónica:** https://sedeagpd.gob.es
- **Web:** https://www.aepd.es

### 11.2. Contacto previo

Antes de presentar una reclamación, te recomendamos contactar con nosotros:
- **Email:** [Tu email de contacto]
- Responderemos en máximo 1 mes

---

## 12. USO DE COOKIES

### 12.1. ¿Utiliza VerbaDoc Salud cookies?

**SÍ, pero de forma muy limitada:**

| Cookie | Tipo | Finalidad | Duración | Base legal |
|--------|------|-----------|----------|-----------|
| localStorage | Estrictamente necesaria | Guardar historial de extracciones localmente | Indefinida (hasta borrado manual) | Interés legítimo (Art. 6.1.f) |

### 12.2. Cookies de terceros

- ❌ NO se utilizan cookies de Google Analytics
- ❌ NO se utilizan cookies de publicidad
- ❌ NO se utilizan cookies de redes sociales

### 12.3. ¿Cómo eliminar localStorage?

**Opción 1 - Desde VerbaDoc Salud:**
- Ve a la sección "Historial"
- Haz clic en "Limpiar historial"

**Opción 2 - Desde el navegador:**
- Chrome: Configuración → Privacidad y seguridad → Borrar datos de navegación
- Firefox: Opciones → Privacidad y seguridad → Borrar datos
- Safari: Preferencias → Privacidad → Gestionar datos de sitios web

---

## 13. CAMBIOS EN ESTA POLÍTICA

### 13.1. Notificación de cambios

Nos reservamos el derecho a modificar esta política de privacidad para adaptarla a cambios normativos o en nuestros servicios.

**Te notificaremos:**
- Mediante aviso destacado en la aplicación
- Por email si disponemos de tu dirección de correo

### 13.2. Historial de versiones

| Versión | Fecha | Cambios principales |
|---------|-------|---------------------|
| 1.0 | [Fecha anterior] | Versión inicial con Google Gemini API (EE.UU.) |
| 2.0 | 07/11/2025 | Migración a Vertex AI Europa - Cumplimiento GDPR total |

---

## 14. ACEPTACIÓN DE ESTA POLÍTICA

**Al utilizar VerbaDoc Salud, el usuario (profesional sanitario o institución) declara:**

- ✅ Haber leído y comprendido esta Política de Privacidad
- ✅ Aceptar los términos aquí descritos
- ✅ Ser responsable del tratamiento de los datos de pacientes que procesa
- ✅ Contar con el consentimiento o base legal adecuada para tratar los datos de salud
- ✅ Informar a los pacientes sobre el uso de herramientas de IA en el tratamiento de sus datos

---

## 15. PREGUNTAS FRECUENTES (FAQ)

**P: ¿VerbaDoc Salud guarda mis documentos?**
R: NO. Los documentos se procesan de forma efímera y no se almacenan en servidores.

**P: ¿Puedo usar VerbaDoc Salud con datos de pacientes reales?**
R: SÍ, siempre que cumplas con tu responsabilidad como responsable del tratamiento (hospital/clínica) y dispongas de la base legal adecuada (Art. 9.2.h GDPR).

**P: ¿Los datos se envían a Estados Unidos?**
R: NO. Todos los datos se procesan exclusivamente en Europa (Bélgica, Alemania, Francia).

**P: ¿Es seguro usar VerbaDoc Salud desde mi hospital?**
R: SÍ, siempre que tu hospital tenga políticas de seguridad adecuadas y formes a tu personal en protección de datos.

**P: ¿Necesito firmar un contrato con Google Cloud?**
R: Recomendado si usas VerbaDoc Salud a gran escala. Google Cloud proporciona un DPA estándar conforme a GDPR.

---

## 16. CONTACTO

**Para cualquier consulta sobre esta Política de Privacidad:**

- **Email:** [Tu email]
- **Teléfono:** [Tu teléfono]
- **Dirección postal:** [Tu dirección]
- **Horario de atención:** [Tu horario]

---

**Última actualización:** 7 de noviembre de 2025

🇪🇺 **VerbaDoc Salud - 100% Datos en Europa**

---

*Este documento ha sido elaborado conforme al GDPR (Reglamento UE 2016/679) y la LOPDGDD (Ley Orgánica 3/2018).*
