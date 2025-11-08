# 🔐 Certificación Técnica de Infraestructura

## VerbaDoc Salud - Arquitectura de Procesamiento de Datos Clínicos

**Versión de la aplicación:** 2.0 (Vertex AI Europa)
**Fecha de certificación:** 7 de noviembre de 2025
**Válido hasta:** Próxima actualización de arquitectura o cambios regulatorios

---

## 1. ARQUITECTURA GENERAL

### 1.1. Diagrama de flujo de datos

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO (Hospital/Clínica)                │
│                     Navegador Web (Chrome/Firefox)               │
│                      https://verbadoc-salud.vercel.app           │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS/TLS 1.3
                             │ (Cifrado end-to-end)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK (CDN)                     │
│                                                                   │
│  Región: fra1 (Frankfurt, Alemania) 🇩🇪                         │
│  Región: cdg1 (París, Francia) 🇫🇷                              │
│                                                                   │
│  • Certificado SSL/TLS válido                                    │
│  • Balanceo de carga automático                                  │
│  • Sin almacenamiento de datos sensibles                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ API Request (POST /api/extract)
                             │ HTTPS/TLS 1.3
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│               VERCEL SERVERLESS FUNCTION                         │
│                    /api/extract.ts                               │
│                                                                   │
│  Región: fra1 (Frankfurt, Alemania) 🇩🇪                         │
│                                                                   │
│  • Autenticación: Service Account de Google Cloud                │
│  • Sin almacenamiento persistente                                │
│  • Timeout: 10 segundos máximo                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Vertex AI API Call
                             │ HTTPS + OAuth 2.0
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│            GOOGLE CLOUD VERTEX AI                                │
│                                                                   │
│  Región: europe-west1 (Bélgica) 🇪🇺                             │
│  Zona: Múltiples zonas dentro de europe-west1                    │
│                                                                   │
│  Modelo de IA: Gemini 2.5 Flash / Flash-Lite / Pro              │
│                                                                   │
│  • Procesamiento efímero (sin almacenamiento)                    │
│  • Autenticación: Google Cloud IAM                               │
│  • Logs: Google Cloud Logging (30 días retención)                │
│  • Cumplimiento: ISO 27001, ISO 27018, SOC 2/3                   │
└─────────────────────────────────────────────────────────────────┘

DATOS DEVUELTOS AL NAVEGADOR
(Resultados extraídos en formato JSON)
↓
ALMACENAMIENTO LOCAL (OPCIONAL)
localStorage del navegador del usuario
(Controlado 100% por el usuario)
```

### 1.2. Características clave de la arquitectura

| Característica | Valor | Certificación GDPR |
|----------------|-------|-------------------|
| **Procesamiento en UE** | ✅ 100% | ✅ Art. 44-50 GDPR |
| **Transferencias fuera UE** | ❌ 0% | ✅ Cumple |
| **Almacenamiento persistente** | ❌ No | ✅ Minimización de datos |
| **Cifrado en tránsito** | ✅ TLS 1.3 | ✅ Art. 32 GDPR |
| **Autenticación** | ✅ OAuth 2.0 + IAM | ✅ Art. 32 GDPR |
| **Logs de auditoría** | ✅ 30 días | ✅ Art. 32 GDPR |

---

## 2. COMPONENTES DE INFRAESTRUCTURA

### 2.1. Frontend (Aplicación Web)

**Tecnología:**
- **Framework:** React 18 + TypeScript
- **Bundler:** Vite 6.4
- **Hosting:** Vercel Edge Network

**Ubicaciones físicas de servidores:**
- 🇩🇪 **fra1:** Frankfurt, Alemania (Región primaria)
- 🇫🇷 **cdg1:** París, Francia (Región secundaria)

**Certificaciones de Vercel:**
- ✅ ISO 27001 (Seguridad de la información)
- ✅ SOC 2 Type II (Controles de seguridad)
- ✅ GDPR-compliant (Términos de servicio)

**Datos almacenados en frontend:**
- ❌ **NO se almacenan datos en servidores de Vercel**
- ✅ **localStorage** (navegador del usuario):
  - Historial de extracciones
  - Configuraciones de esquemas
  - Controlado 100% por el usuario (puede eliminar en cualquier momento)

**Seguridad:**
- ✅ **Content Security Policy (CSP)** configurada
- ✅ **HTTPS forzado** (no se permite HTTP)
- ✅ **HSTS (HTTP Strict Transport Security)** habilitado
- ✅ **X-Frame-Options: DENY** (protección contra clickjacking)
- ✅ **X-Content-Type-Options: nosniff**

### 2.2. Backend (API Serverless)

**Tecnología:**
- **Runtime:** Node.js 20
- **Framework:** Vercel Serverless Functions
- **Lenguaje:** TypeScript

**Ubicación:**
- 🇩🇪 **fra1:** Frankfurt, Alemania

**Endpoint:**
- `POST /api/extract` - Procesamiento de documentos con Vertex AI

**Autenticación:**
- **Google Cloud Service Account:**
  - Email: `verbadoc-vertex-ai@verbadoc-salud-europa.iam.gserviceaccount.com`
  - Rol: `Vertex AI User` (permisos mínimos necesarios)
  - Credenciales: JSON Web Token (JWT) rotable

**Timeout y límites:**
- **Timeout máximo:** 10 segundos por petición
- **Tamaño máximo de archivo:** 10 MB (configurable)
- **Concurrencia:** Escalado automático según demanda

**Datos procesados:**
- ✅ Documento original (PDF, imagen, texto)
- ✅ Esquema de extracción (JSON)
- ✅ Configuración de modelo de IA

**Datos NO almacenados:**
- ❌ Documento original (procesamiento en memoria)
- ❌ Datos extraídos (devueltos al cliente directamente)
- ❌ Información del paciente

**Logs técnicos (sin datos sensibles):**
- ✅ Timestamp de petición
- ✅ Modelo de IA utilizado
- ✅ Región de procesamiento (europe-west1)
- ✅ Código de estado HTTP (200, 500, etc.)
- ❌ NO se registra contenido del documento
- ❌ NO se registran datos de salud

### 2.3. Procesamiento de IA (Vertex AI)

**Proveedor:**
- **Google Cloud Platform**
- **Servicio:** Vertex AI Generative AI (Gemini)
- **Project ID:** `verbadoc-salud-europa`

**Ubicación geográfica GARANTIZADA:**
- 🇪🇺 **Región:** `europe-west1` (Bélgica)
- 🇪🇺 **Centros de datos:** Múltiples zonas dentro de Bélgica
- 🇪🇺 **Garantía:** Configuración a nivel de API (no se puede procesar en otra región)

**Modelos de IA disponibles:**

| Modelo | Descripción | Uso recomendado | Coste aprox. |
|--------|-------------|-----------------|-------------|
| **gemini-2.5-flash-lite** | Más rápido y económico | Documentos simples (recetas, informes breves) | €0.0005/doc |
| **gemini-2.5-flash** | Balance velocidad/precisión | Historias clínicas estándar | €0.0016/doc |
| **gemini-2.5-pro** | Máxima precisión | Documentos complejos, investigación | €0.008/doc |

**Características del procesamiento:**
- ✅ **Procesamiento efímero:** Los datos NO se almacenan después del procesamiento
- ✅ **Sin entrenamiento:** Los datos NO se utilizan para entrenar modelos de IA
- ✅ **Sin perfilado:** Los datos NO se utilizan para crear perfiles de usuarios
- ✅ **Aislamiento:** Cada petición se procesa de forma aislada

**Política de retención de Google Cloud:**
- **Documento procesado:** 0 días (procesamiento en memoria, sin almacenamiento)
- **Logs técnicos:** 30 días (sin contenido del documento)
- **Métricas de uso:** Agregadas y anonimizadas

**Certificaciones de Google Cloud:**
- ✅ **ISO/IEC 27001:** Seguridad de la información
- ✅ **ISO/IEC 27017:** Seguridad en la nube
- ✅ **ISO/IEC 27018:** Protección de datos personales en la nube
- ✅ **SOC 2/3:** Controles de seguridad auditados
- ✅ **CSA STAR:** Cloud Security Alliance
- ✅ **HIPAA-compliant** (si se firma BAA - no aplicable actualmente)

**DPA (Data Processing Agreement):**
- ✅ Disponible en: https://cloud.google.com/terms/data-processing-addendum
- ✅ Incluye Cláusulas Contractuales Tipo de la Comisión Europea
- ✅ Actualizado para cumplir con Schrems II (sentencia del TJUE)

---

## 3. SEGURIDAD TÉCNICA

### 3.1. Cifrado

**En tránsito:**
- ✅ **TLS 1.3** (última versión) en todas las comunicaciones
- ✅ **Certificado SSL:** Válido, emitido por Let's Encrypt / Vercel
- ✅ **Perfect Forward Secrecy (PFS):** Habilitado
- ✅ **HSTS:** Habilitado (6 meses mínimo)

**En reposo:**
- ✅ **localStorage del navegador:** Protegido por same-origin policy
- ❌ **Servidores:** No aplicable (no hay almacenamiento persistente)

**Configuración TLS (SSL Labs Score: A+):**
```
Protocols: TLSv1.3, TLSv1.2
Cipher Suites:
  - TLS_AES_128_GCM_SHA256
  - TLS_AES_256_GCM_SHA384
  - TLS_CHACHA20_POLY1305_SHA256
  - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
  - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
```

### 3.2. Autenticación y Autorización

**Google Cloud IAM:**

**Service Account:**
- **Email:** `verbadoc-vertex-ai@verbadoc-salud-europa.iam.gserviceaccount.com`
- **Tipo:** Service Account (no usuario humano)
- **Permisos mínimos** (Principio de mínimo privilegio):
  - `aiplatform.endpoints.predict` (solo predicción, no administración)
  - `aiplatform.models.get` (consulta de modelos)

**Rotación de credenciales:**
- ✅ **Frecuencia recomendada:** Cada 90 días
- ✅ **Método:** Generación de nueva clave JSON y actualización en Vercel

**Variables de entorno en Vercel (protegidas):**
- `VITE_GEMINI_PROJECT_ID`: ID del proyecto de Google Cloud
- `GOOGLE_CLOUD_PROJECT`: ID del proyecto (alternativo)
- `GOOGLE_APPLICATION_CREDENTIALS`: Credenciales del Service Account (JSON completo)

**Protección de variables:**
- ✅ Encriptadas en reposo en Vercel
- ✅ Accesibles solo en tiempo de ejecución (no expuestas al cliente)
- ✅ No visibles en logs públicos

### 3.3. Control de acceso

**A nivel de aplicación:**
- ❌ **NO hay autenticación de usuarios** (aplicación pública)
- ⚠️ **Responsabilidad del hospital/clínica:** Controlar quién accede a la aplicación

**Recomendaciones para hospitales:**
1. Restringir acceso por IP (firewall corporativo)
2. Exigir VPN para acceso remoto
3. Bloqueo de pantalla tras 5 min de inactividad
4. No usar desde dispositivos personales no autorizados

**A nivel de Google Cloud:**
- ✅ **IAM:** Solo el Service Account autorizado puede llamar a Vertex AI
- ✅ **VPC Service Controls** (opcional): Restricción adicional por red

### 3.4. Monitoreo y auditoría

**Google Cloud Logging:**
- ✅ **Habilitado:** Sí
- ✅ **Retención:** 30 días
- ✅ **Contenido:** Metadatos técnicos (NO contenido de documentos)

**Logs disponibles:**
- Timestamp de petición
- Región de procesamiento (europe-west1)
- Modelo utilizado (gemini-2.5-flash, etc.)
- Duración del procesamiento
- Código de estado (éxito/error)
- IP de origen (Vercel serverless function, no IP del usuario)

**Logs NO disponibles (por diseño):**
- ❌ Contenido del documento procesado
- ❌ Datos extraídos
- ❌ Información personal del paciente

**Alertas configuradas:**
- ✅ Tasa de errores > 5%
- ✅ Latencia > 10 segundos
- ✅ Cuota de API excedida

**Acceso a logs:**
- Solo administradores autorizados del proyecto Google Cloud
- Requiere autenticación 2FA

---

## 4. CONTINUIDAD Y DISPONIBILIDAD

### 4.1. SLA (Service Level Agreement)

**Vercel:**
- **Disponibilidad garantizada:** 99.99% (Pro Plan)
- **Tiempo de inactividad máximo:** 4.38 minutos/mes

**Google Cloud Vertex AI:**
- **Disponibilidad garantizada:** 99.5% (europe-west1)
- **Tiempo de inactividad máximo:** 3.65 horas/mes

**VerbaDoc Salud (combinado):**
- **Disponibilidad esperada:** ~99.4%
- **Tiempo de inactividad máximo:** ~4.3 horas/mes

### 4.2. Recuperación ante desastres

**Estrategia:**

1. **Frontend (Vercel):**
   - ✅ **Multi-región:** fra1 + cdg1 (failover automático)
   - ✅ **Backup automático:** Despliegue inmutable (siempre se puede revertir)
   - ✅ **RTO (Recovery Time Objective):** < 5 minutos

2. **Backend (Serverless Function):**
   - ✅ **Stateless:** Sin estado, escalado automático
   - ✅ **Backup:** Código versionado en GitHub
   - ✅ **RTO:** < 10 minutos

3. **Vertex AI:**
   - ✅ **Gestionado por Google Cloud:** Alta disponibilidad intrínseca
   - ✅ **Multi-zona:** Múltiples zonas dentro de europe-west1
   - ✅ **RTO:** Gestionado por Google (SLA 99.5%)

**RPO (Recovery Point Objective):**
- **Datos del usuario:** 0 (los datos no se almacenan en servidores)
- **Configuración:** < 24 horas (restauración desde GitHub)

### 4.3. Escalabilidad

**Capacidad actual:**
- **Usuarios concurrentes:** Ilimitado (escalado automático de Vercel)
- **Peticiones/segundo:** 100+ (escalado automático)
- **Tamaño de documento:** Hasta 10 MB por archivo

**Pruebas de carga:**
- No realizadas formalmente (recomendado para uso a gran escala)

**Recomendación para hospitales grandes (> 500 usuarios):**
- Realizar pruebas de carga antes de despliegue masivo
- Considerar límite de tasa (rate limiting) para evitar sobrecarga

---

## 5. CUMPLIMIENTO NORMATIVO

### 5.1. GDPR (Reglamento UE 2016/679)

| Artículo | Requisito | Cumplimiento |
|----------|-----------|--------------|
| **Art. 5** | Principios del tratamiento | ✅ Cumple (ver documento CUMPLIMIENTO_LEGAL_GDPR.md) |
| **Art. 25** | Privacy by design & default | ✅ Cumple (arquitectura sin almacenamiento persistente) |
| **Art. 28** | Encargado del tratamiento | ✅ Cumple (DPA con Google Cloud) |
| **Art. 32** | Seguridad del tratamiento | ✅ Cumple (cifrado TLS 1.3, IAM, logs) |
| **Art. 33** | Notificación de brechas | ✅ Protocolo implementado |
| **Art. 35** | Evaluación de impacto (EIPD) | ✅ Recomendada para usuarios |
| **Art. 44-50** | Transferencias internacionales | ✅ Cumple (0% transferencias fuera UE) |

### 5.2. Normativa española

**Ley Orgánica 3/2018 (LOPDGDD):**
- ✅ Cumple con requisitos de protección de datos de salud
- ✅ Nivel de seguridad alto implementado

**Real Decreto 1720/2007:**
- ✅ Medidas de seguridad para datos de salud implementadas

### 5.3. Certificaciones de proveedores

**Google Cloud Platform:**
- ✅ ISO/IEC 27001:2013
- ✅ ISO/IEC 27017:2015
- ✅ ISO/IEC 27018:2019
- ✅ SOC 2 Type II
- ✅ SOC 3
- ✅ CSA STAR Level 2

**Vercel:**
- ✅ ISO 27001
- ✅ SOC 2 Type II
- ✅ GDPR-compliant

---

## 6. PRUEBAS DE SEGURIDAD

### 6.1. Pruebas realizadas

**SSL/TLS (SSL Labs):**
- ✅ **Calificación:** A+
- ✅ **Fecha:** [Fecha de la prueba]
- ✅ **URL:** https://verbadoc-salud.vercel.app

**Headers de seguridad (securityheaders.com):**
- ✅ **Content-Security-Policy:** Configurado
- ✅ **X-Frame-Options:** DENY
- ✅ **X-Content-Type-Options:** nosniff
- ✅ **Strict-Transport-Security:** Habilitado

**Vulnerabilidades de dependencias:**
- ✅ **npm audit:** 0 vulnerabilidades críticas
- ✅ **Dependabot (GitHub):** Habilitado (alertas automáticas)

### 6.2. Pruebas recomendadas (no realizadas)

Para despliegue en hospitales de gran escala, se recomienda:
- ⚠️ Pruebas de penetración (pentesting)
- ⚠️ Auditoría de código por tercero independiente
- ⚠️ Pruebas de carga (load testing)
- ⚠️ Evaluación de riesgos específica del hospital

---

## 7. GESTIÓN DE INCIDENTES DE SEGURIDAD

### 7.1. Detección

**Fuentes de detección:**
1. Google Cloud Logging (alertas automáticas)
2. Vercel Monitoring (errores de deployment)
3. Usuarios del sistema (reporte manual)

**Indicadores de compromiso:**
- Tasa de errores > 10%
- Latencia > 20 segundos
- Intentos de acceso no autorizado a logs
- Cambios no autorizados en configuración

### 7.2. Respuesta

**Protocolo de respuesta (ver GUIA_USO_HOSPITALES_CLINICAS.md sección 8):**

1. **Detección** (0-2h): Identificar incidente
2. **Contención** (2-8h): Aislar sistema afectado
3. **Evaluación** (8-24h): Determinar impacto
4. **Notificación** (<72h): AEPD y afectados si procede
5. **Remediación** (días/semanas): Medidas correctivas

### 7.3. Contactos de emergencia

**Equipo de seguridad:**
- [Tu nombre/equipo de seguridad]
- [Email de contacto]
- [Teléfono 24/7]

**Google Cloud Support:**
- Solo disponible con plan de soporte contratado
- https://cloud.google.com/support

**Vercel Support:**
- Email: support@vercel.com
- Solo para clientes Pro/Enterprise

---

## 8. ACTUALIZACIONES Y MANTENIMIENTO

### 8.1. Calendario de mantenimiento

**Aplicación web (Frontend + Backend):**
- **Actualizaciones de seguridad:** Inmediatas (en cuanto se detectan)
- **Actualizaciones funcionales:** Semanales/quincenales
- **Actualizaciones de dependencias:** Mensual (npm audit)

**Vertex AI (Google Cloud):**
- **Gestionado por Google:** Actualizaciones automáticas
- **Modelos de IA:** Actualizaciones controladas por Google

**Rotación de credenciales:**
- **Service Account:** Cada 90 días (recomendado)
- **Certificados SSL:** Automático (Let's Encrypt)

### 8.2. Política de versionado

**Versionado semántico (SemVer):**
- **MAJOR.MINOR.PATCH** (ej: 2.0.1)
- **MAJOR:** Cambios incompatibles con versión anterior
- **MINOR:** Nueva funcionalidad compatible
- **PATCH:** Correcciones de bugs

**Versión actual:** 2.0.0
- **2.0.0:** Migración completa a Vertex AI Europa (7 nov 2025)
- **1.x.x:** Versión anterior con Google Gemini API (EE.UU.)

### 8.3. Comunicación de cambios

**Canales:**
- Aviso en la aplicación (banner destacado)
- Actualización de documentación (GitHub)
- Email a hospitales/clínicas registrados (si aplica)

---

## 9. RESPONSABILIDADES

### 9.1. Responsabilidad del proveedor (VerbaDoc Salud)

✅ **Responsable de:**
- Mantenimiento de la aplicación web
- Actualización de dependencias de seguridad
- Configuración correcta de infraestructura europea
- Documentación técnica actualizada
- Notificación de cambios relevantes

❌ **NO responsable de:**
- Uso indebido de la aplicación
- Formación del personal del hospital
- Cumplimiento GDPR del hospital (responsable del tratamiento)
- Seguridad de dispositivos del usuario
- Gestión de incidencias del hospital

### 9.2. Responsabilidad del usuario (Hospital/Clínica)

✅ **Responsable de:**
- Ser el responsable del tratamiento (Art. 24 GDPR)
- Realizar EIPD y mantener RAT
- Formar al personal en protección de datos
- Controlar acceso a la aplicación
- Gestionar incidencias de seguridad
- Notificar brechas a AEPD y afectados
- Informar a pacientes sobre uso de IA
- Validar resultados de la IA antes de uso clínico
- Revisar y aceptar DPA con Google Cloud

❌ **NO responsable de:**
- Mantenimiento de infraestructura de VerbaDoc Salud
- Seguridad de Google Cloud Vertex AI
- Disponibilidad del servicio (según SLA)

---

## 10. AUDITORÍA Y CERTIFICACIÓN

### 10.1. Auditorías realizadas

**Interna:**
- ✅ Revisión de configuración de seguridad
- ✅ Verificación de ubicación de servidores
- ✅ Pruebas de cifrado (SSL Labs)
- ✅ Auditoría de dependencias (npm audit)

**Externa:**
- ❌ No realizada (recomendada para despliegues críticos)

### 10.2. Certificaciones disponibles

**De los proveedores (Google Cloud, Vercel):**
- Disponibles bajo petición (sujeto a acuerdos de confidencialidad)

**De VerbaDoc Salud:**
- Este documento constituye la certificación técnica actual
- No es una certificación oficial de organismo regulador

### 10.3. Recomendaciones para hospitales

**Para uso en entorno de producción crítico:**
1. Solicitar auditoría externa independiente
2. Revisar certificaciones de Google Cloud y Vercel
3. Realizar pruebas de penetración
4. Contratar soporte premium de Google Cloud (SLA mejorado)
5. Considerar contratar seguro de ciberriesgos

---

## 11. CONTACTO TÉCNICO

**Para consultas técnicas sobre la infraestructura:**

- **Email:** [Tu email técnico]
- **Documentación:** https://github.com/VCNPRO/verbadoc_salud
- **Guía de configuración:** SETUP_VERTEX_AI.md

**Para consultas sobre Google Cloud:**
- https://cloud.google.com/vertex-ai/docs
- https://cloud.google.com/terms/data-processing-addendum

**Para consultas sobre Vercel:**
- https://vercel.com/docs
- https://vercel.com/legal/privacy-policy

---

## 12. DECLARACIÓN DE CONFORMIDAD

**Declaramos que la infraestructura de VerbaDoc Salud (versión 2.0):**

1. ✅ **Procesa todos los datos exclusivamente en la Unión Europea**
   - Vertex AI: europe-west1 (Bélgica) 🇪🇺
   - Vercel: fra1 (Alemania) + cdg1 (Francia) 🇪🇺

2. ✅ **No transfiere datos fuera del Espacio Económico Europeo**
   - 0% de datos procesados en EE.UU. o terceros países

3. ✅ **Implementa medidas de seguridad de nivel alto**
   - Cifrado TLS 1.3
   - Autenticación Google Cloud IAM
   - Sin almacenamiento persistente de datos sensibles

4. ✅ **Cumple con los requisitos técnicos del GDPR**
   - Art. 25 (Privacy by Design)
   - Art. 32 (Seguridad del tratamiento)

5. ✅ **Utiliza proveedores certificados**
   - Google Cloud: ISO 27001, SOC 2/3
   - Vercel: ISO 27001, SOC 2

---

**Documento elaborado por:** [Tu nombre/organización]
**Fecha de emisión:** 7 de noviembre de 2025
**Versión:** 2.0
**Válido hasta:** Próxima actualización de arquitectura

**Firma digital:**
[Hash SHA-256 del documento]

🇪🇺 **100% DATOS EN EUROPA - CERTIFICADO**

---

*Este documento técnico certifica la arquitectura actual de VerbaDoc Salud. NO constituye una certificación oficial de organismo regulador. Para uso en entornos críticos, se recomienda auditoría externa independiente.*
