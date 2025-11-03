import React from 'react';
import type { HealthTemplate } from '../types';

interface HealthSchemaViewerProps {
  template: HealthTemplate;
  onUpdate: (sectionId: string, fieldName: string, newLabel: string) => void;
}

export const HealthSchemaViewer: React.FC<HealthSchemaViewerProps> = ({ template, onUpdate }) => {
  return (
    <div className="space-y-6">
      {template.secciones.map(seccion => (
        <div key={seccion.id} className="p-4 border rounded-lg">
          <h4 className="text-lg font-semibold mb-2">{seccion.nombre}</h4>
          <p className="text-sm text-gray-400 mb-4">{seccion.descripcion}</p>
          <div className="space-y-4">
            {seccion.campos.map(campo => (
              <div key={campo.nombre_campo} className="p-3 bg-slate-700/30 rounded-md">
                                <input type="text" value={campo.etiqueta} onChange={(e) => onUpdate(seccion.id, campo.nombre_campo, e.target.value)} className="font-semibold bg-transparent w-full" />
                <p className="text-xs text-gray-400">{campo.tipo_dato}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
