import React from 'react';
import type { HealthTemplate, Field, Section } from '../types';

interface HealthSchemaViewerProps {
  template: HealthTemplate;
  onUpdate: (sectionId: string, fieldName: string, newLabel: string) => void;
  theme?: any;
  isHealthMode?: boolean;
}

const FieldRenderer: React.FC<{
  seccion: Section,
  campo: Field,
  onUpdate: (sectionId: string, fieldName: string, newLabel: string) => void,
  theme?: any,
  isHealthMode?: boolean
}> = ({ seccion, campo, onUpdate, theme, isHealthMode }) => {
  const textColor = isHealthMode ? (theme?.text || '#064e3b') : '#f1f5f9';
  const bgColor = isHealthMode ? '#f9fafb' : '#1e293b';
  const borderColor = isHealthMode ? '#d1d5db' : '#475569';
  const rowBg = isHealthMode ? '#f0fdf4' : 'rgba(51, 65, 85, 0.3)';
  const textSecondary = isHealthMode ? (theme?.textSecondary || '#065f46') : '#94a3b8';
  switch (campo.tipo_dato) {
    case 'seleccion':
      return (
        <div className="p-3 rounded-md" style={{ backgroundColor: rowBg }}>
          <p className="font-semibold" style={{ color: textColor }}>{campo.etiqueta}</p>
          <select className="w-full rounded-md p-2 mt-1 text-sm" style={{ backgroundColor: bgColor, borderWidth: '1px', borderStyle: 'solid', borderColor: borderColor, color: textColor }}>
            {campo.opciones?.map(opcion => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
          <p className="text-xs mt-1" style={{ color: textSecondary }}>{campo.tipo_dato}</p>
        </div>
      );
    case 'multiseleccion':
      return (
        <div className="p-3 rounded-md" style={{ backgroundColor: rowBg }}>
          <p className="font-semibold" style={{ color: textColor }}>{campo.etiqueta}</p>
          <div className="space-y-2 mt-2">
            {campo.opciones?.map(opcion => (
              <div key={opcion.valor} className="flex items-center">
                <input type="checkbox" id={opcion.valor} name={opcion.valor} value={opcion.valor} className="h-4 w-4 rounded" />
                <label htmlFor={opcion.valor} className="ml-3 text-sm" style={{ color: textColor }}>{opcion.etiqueta}</label>
              </div>
            ))}
          </div>
          <p className="text-xs mt-1" style={{ color: textSecondary }}>{campo.tipo_dato}</p>
        </div>
      );
    case 'fecha':
      return (
        <div className="p-3 rounded-md" style={{ backgroundColor: rowBg }}>
          <p className="font-semibold" style={{ color: textColor }}>{campo.etiqueta}</p>
          <input type="date" className="w-full rounded-md p-2 mt-1 text-sm" style={{ backgroundColor: bgColor, borderWidth: '1px', borderStyle: 'solid', borderColor: borderColor, color: textColor }} />
          <p className="text-xs mt-1" style={{ color: textSecondary }}>{campo.tipo_dato}</p>
        </div>
      );
    case 'espacio_libre':
      return (
        <div className="p-3 rounded-md" style={{ backgroundColor: rowBg }}>
          <p className="font-semibold" style={{ color: textColor }}>{campo.etiqueta}</p>
          <textarea rows={3} className="w-full rounded-md p-2 mt-1 text-sm" style={{ backgroundColor: bgColor, borderWidth: '1px', borderStyle: 'solid', borderColor: borderColor, color: textColor }} />
          <p className="text-xs mt-1" style={{ color: textSecondary }}>{campo.tipo_dato}</p>
        </div>
      );
    case 'tabla':
      return (
        <div className="p-3 rounded-md" style={{ backgroundColor: rowBg }}>
          <p className="font-semibold" style={{ color: textColor }}>{campo.etiqueta}</p>
          <table className="w-full mt-2 text-sm text-left" style={{ color: textSecondary }}>
            <thead className="text-xs uppercase" style={{ backgroundColor: bgColor, color: textColor }}>
              <tr>
                {campo.estructura_filas && Object.values(campo.estructura_filas)[0].columnas.map(columna => (
                  <th key={columna.nombre} scope="col" className="px-4 py-2">
                    {columna.etiqueta}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Table body will be rendered here when we have data */}
            </tbody>
          </table>
          <p className="text-xs mt-1" style={{ color: textSecondary }}>{campo.tipo_dato}</p>
        </div>
      );
    default:
      return (
        <div className="p-3 rounded-md" style={{ backgroundColor: rowBg }}>
          <input
            type="text"
            value={campo.etiqueta}
            onChange={e => onUpdate(seccion.id, campo.nombre_campo, e.target.value)}
            className="font-semibold bg-transparent w-full"
            style={{ color: textColor }}
          />
          <p className="text-xs" style={{ color: textSecondary }}>{campo.tipo_dato}</p>
        </div>
      );
  }
};

export const HealthSchemaViewer: React.FC<HealthSchemaViewerProps> = ({ template, onUpdate, theme, isHealthMode }) => {
  const textColor = isHealthMode ? (theme?.text || '#064e3b') : '#f1f5f9';
  const borderColor = isHealthMode ? (theme?.border || '#6ee7b7') : '#475569';
  const textSecondary = isHealthMode ? (theme?.textSecondary || '#065f46') : '#94a3b8';
  const sectionBg = isHealthMode ? '#ffffff' : 'rgba(30, 41, 59, 0.3)';

  return (
    <div className="space-y-6">
      {template.secciones.map(seccion => (
        <div key={seccion.id} className="p-4 rounded-lg" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: borderColor, backgroundColor: sectionBg }}>
          <h4 className="text-lg font-semibold mb-2" style={{ color: textColor }}>{seccion.nombre}</h4>
          <p className="text-sm mb-4" style={{ color: textSecondary }}>{seccion.descripcion}</p>
          <div className="space-y-4">
            {seccion.campos.map(campo => (
              <FieldRenderer key={campo.nombre_campo} seccion={seccion} campo={campo} onUpdate={onUpdate} theme={theme} isHealthMode={isHealthMode} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
