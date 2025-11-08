# 📊 Costes de Explotación - VerbaDoc Salud

## 💰 Resumen Ejecutivo

VerbaDoc Salud utiliza la API de Google Gemini para la extracción inteligente de datos de documentos médicos. Los costes de operación son extremadamente bajos y escalables.

---

## 🤖 Modelos de IA Disponibles

### 1. **Gemini 2.5 Flash-Lite** ⚡ (ECONÓMICO)
- **Uso recomendado:** Documentos simples, formularios, recetas médicas
- **Coste por documento:** ~$0.0005 USD (~0.05 céntimos)
- **Características:**
  - Procesamiento rápido
  - Alta precisión en documentos estructurados
  - Ideal para formularios médicos estándar

### 2. **Gemini 2.5 Flash** 🚀 (RECOMENDADO)
- **Uso recomendado:** Documentos médicos estándar, informes clínicos
- **Coste por documento:** ~$0.0016 USD (~0.16 céntimos)
- **Características:**
  - Balance óptimo precio/rendimiento
  - Excelente para historiales clínicos
  - Reconocimiento avanzado de datos médicos

### 3. **Gemini 2.5 Pro** 🎯 (AVANZADO)
- **Uso recomendado:** Documentos complejos, múltiples tablas, análisis profundo
- **Coste por documento:** ~$0.008 USD (~0.8 céntimos)
- **Características:**
  - Máxima precisión
  - Análisis de documentos complejos
  - Múltiples tablas y formatos

---

## 📈 Tabla de Costes por Volumen

| Volumen | Flash-Lite | Flash (Recom.) | Pro |
|---------|------------|----------------|-----|
| **100 documentos** | $0.05 | $0.16 | $0.80 |
| **1,000 documentos** | $0.50 | $1.60 | $8.00 |
| **10,000 documentos** | $5.00 | $16.00 | $80.00 |
| **100,000 documentos** | $50.00 | $160.00 | $800.00 |
| **1,000,000 documentos** | $500.00 | $1,600.00 | $8,000.00 |

---

## 💡 Estimación de Costes Mensual

### Clínica Pequeña (200 documentos/mes)
- **Flash-Lite:** ~$0.10/mes
- **Flash:** ~$0.32/mes
- **Pro:** ~$1.60/mes

### Clínica Mediana (2,000 documentos/mes)
- **Flash-Lite:** ~$1.00/mes
- **Flash:** ~$3.20/mes
- **Pro:** ~$16.00/mes

### Hospital Grande (20,000 documentos/mes)
- **Flash-Lite:** ~$10.00/mes
- **Flash:** ~$32.00/mes
- **Pro:** ~$160.00/mes

### Hospital Universitario (100,000 documentos/mes)
- **Flash-Lite:** ~$50.00/mes
- **Flash:** ~$160.00/mes
- **Pro:** ~$800.00/mes

---

## 🔍 Desglose Técnico de Costes

### Precio por Token (Gemini API)

| Modelo | Input (por 1M tokens) | Output (por 1M tokens) |
|--------|----------------------|------------------------|
| Flash-Lite | $0.10 | $0.40 |
| Flash | $0.30 | $2.50 |
| Pro | $1.25 | $10.00 |

### Tokens Estimados por Documento Médico

**INPUT (enviado a API):**
- Documento escaneado A4 (1200×1600px): ~1,500 tokens
- Prompt de instrucciones: ~300 tokens
- Schema JSON: ~200 tokens
- **TOTAL INPUT:** ~2,000 tokens

**OUTPUT (recibido de API):**
- Datos extraídos en JSON: ~300-500 tokens

### Cálculo por Documento (Flash - Recomendado)
```
Input:  2,000 tokens × $0.30 / 1,000,000 = $0.0006
Output:   400 tokens × $2.50 / 1,000,000 = $0.0010
─────────────────────────────────────────────────
TOTAL:                                   $0.0016
```

---

## 💸 Comparativa de Ahorro

### Flash-Lite vs Flash
- **Ahorro:** 3× más barato
- **Diferencia por 1,000 docs:** $1.10 USD de ahorro
- **Diferencia por 100,000 docs:** $110 USD de ahorro

### Flash vs Pro
- **Ahorro:** 5× más barato
- **Diferencia por 1,000 docs:** $6.40 USD de ahorro
- **Diferencia por 100,000 docs:** $640 USD de ahorro

---

## 🎯 Recomendaciones de Uso

### Usar Flash-Lite cuando:
- ✅ Procesas formularios médicos estándar
- ✅ Documentos con estructura clara y predefinida
- ✅ Recetas médicas
- ✅ Solicitudes de citas
- ✅ Volumen muy alto de documentos simples

### Usar Flash cuando:
- ✅ Historiales clínicos completos
- ✅ Informes de laboratorio
- ✅ Documentos con formato variable
- ✅ Balance entre coste y precisión
- ✅ **Uso general recomendado**

### Usar Pro cuando:
- ✅ Documentos de investigación médica
- ✅ Historiales con múltiples tablas complejas
- ✅ Análisis críticos que requieren máxima precisión
- ✅ Documentos con handwriting (escritura a mano)
- ✅ Informes quirúrgicos detallados

---

## 📊 ROI (Retorno de Inversión)

### Comparativa con Entrada Manual

**Coste de entrada manual de datos:**
- Tiempo promedio: 5-10 minutos por documento
- Salario promedio administrativo: $15/hora
- **Coste por documento:** $1.25 - $2.50

**Coste con VerbaDoc (Flash):**
- Tiempo: < 10 segundos
- **Coste por documento:** $0.0016

**AHORRO POR DOCUMENTO:** $1.25 - $2.50 (99.9% de ahorro)

### Ejemplo Real: Hospital con 10,000 docs/mes
- **Coste manual:** $12,500 - $25,000/mes
- **Coste VerbaDoc (Flash):** $16/mes
- **AHORRO MENSUAL:** $12,484 - $24,984
- **AHORRO ANUAL:** $149,808 - $299,808

---

## ⚠️ Factores que Afectan el Coste

1. **Calidad de imagen:** Imágenes más grandes = más tokens
2. **Complejidad del schema:** Más campos = más procesamiento
3. **Longitud del prompt:** Prompts detallados = más tokens de input
4. **Errores y reintentos:** Documentos que fallan requieren reprocesar

---

## 🛡️ Costes Adicionales a Considerar

### Infraestructura
- **Hosting (Vercel):** FREE para proyectos pequeños-medianos
- **Dominio:** ~$10-15/año
- **SSL:** Incluido gratis con Vercel

### API Gemini
- **Límites gratuitos:** Disponibles para testing
- **Rate limits:** Configurables según necesidad
- **Sin costes ocultos:** Pay-per-use transparente

---

## 📞 Contacto y Soporte

Para optimización de costes o consultas técnicas:
- Revisar logs de uso en Google AI Studio
- Monitorear consumo de tokens por documento
- Ajustar modelos según tipo de documento

---

**Última actualización:** Febrero 2025
**Versión:** 1.0
**Precios basados en:** Google Gemini API Pricing (2025)
