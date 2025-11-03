import { HealthTemplate } from '../types';

export const healthTemplates: HealthTemplate[] = [
  {
    id: 'template_001_hc_completa',
    nombre: 'Historia Clínica Completa',
    descripcion: 'Formato completo de Historia Clínica según normas internacionales HL7',
    categoria: 'historia_clinica_completa',
    tipo: 'predefinida',
    version: '1.0.0',
    estandares_aplicados: ['HL7_v2', 'FHIR_R4'],
    metadatos: {
      departamento: 'Todos',
      nivel_complejidad: 'avanzada',
      requiere_firma_digital: true,
      confidencialidad_nivel: 'altamente_confidencial',
    },
    secciones: [
      {
        id: 'seccion_001',
        nombre: 'Datos de Filiación',
        descripcion: 'Identificación del paciente y datos de contacto',
        orden: 1,
        obligatoria: true,
        campos: [
          {
            nombre_campo: 'nombre_completo',
            etiqueta: 'Nombre Completo',
            tipo_dato: 'texto',
            orden: 1,
            obligatorio: true,
            mapeo_estandares: {
              hl7_field: 'PID-5',
              fhir_path: 'Patient.name.text',
            },
            validaciones: {
              longitud_minima: 5,
              longitud_maxima: 100,
              patron_regex: '^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$',
            },
            configuracion_extraccion: {
              buscar_automaticamente: true,
              metodo_extraccion: ['ocr', 'nlp'],
            },
            security: {
              is_phi: true,
              phi_sensitivity: 'muy_alta',
              hipaa_identifier: true,
            },
          },
        ],
      },
    ],
  },
];
