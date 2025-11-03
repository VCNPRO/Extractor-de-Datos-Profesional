import React from 'react';
import type { HealthTemplate, Field, Section } from '../types';

interface HealthSchemaViewerProps {
  template: HealthTemplate;
  onUpdate: (sectionId: string, fieldName: string, newLabel: string) => void;
}

const FieldRenderer: React.FC<{ seccion: Section, campo: Field, onUpdate: (sectionId: string, fieldName: string, newLabel: string) => void }> = ({ seccion, campo, onUpdate }) => {
  switch (campo.tipo_dato) {
    case 'seleccion':
      return (
        <div className="p-3 bg-slate-700/30 rounded-md">
          <p className="font-semibold">{campo.etiqueta}</p>
          <select className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 mt-1 text-sm">
            {campo.opciones?.map(opcion => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">{campo.tipo_dato}</p>
        </div>
      );
    default:
      return (
        <div className="p-3 bg-slate-700/30 rounded-md">
          <input
            type="text"
            value={campo.etiqueta}
            onChange={e => onUpdate(seccion.id, campo.nombre_campo, e.target.value)}
            className="font-semibold bg-transparent w-full"
          />
          <p className="text-xs text-gray-400">{campo.tipo_dato}</p>
        </div>
      );
  }
};

export const HealthSchemaViewer: React.FC<HealthSchemaViewerProps> = ({ template, onUpdate }) => {
  return (
    <div className="space-y-6">
      {template.secciones.map(seccion => (
        <div key={seccion.id} className="p-4 border rounded-lg">
          <h4 className="text-lg font-semibold mb-2">{seccion.nombre}</h4>
          <p className="text-sm text-gray-400 mb-4">{seccion.descripcion}</p>
          <div className="space-y-4">
            {seccion.campos.map(campo => (
              <FieldRenderer key={campo.nombre_campo} seccion={seccion} campo={campo} onUpdate={onUpdate} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
