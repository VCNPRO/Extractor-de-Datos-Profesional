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
    case 'multiseleccion':
      return (
        <div className="p-3 bg-slate-700/30 rounded-md">
          <p className="font-semibold">{campo.etiqueta}</p>
          <div className="space-y-2 mt-2">
            {campo.opciones?.map(opcion => (
              <div key={opcion.valor} className="flex items-center">
                <input type="checkbox" id={opcion.valor} name={opcion.valor} value={opcion.valor} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                <label htmlFor={opcion.valor} className="ml-3 text-sm text-gray-300">{opcion.etiqueta}</label>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">{campo.tipo_dato}</p>
        </div>
      );
    case 'fecha':
      return (
        <div className="p-3 bg-slate-700/30 rounded-md">
          <p className="font-semibold">{campo.etiqueta}</p>
          <input type="date" className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 mt-1 text-sm" />
          <p className="text-xs text-gray-400 mt-1">{campo.tipo_dato}</p>
        </div>
      );
    case 'espacio_libre':
      return (
        <div className="p-3 bg-slate-700/30 rounded-md">
          <p className="font-semibold">{campo.etiqueta}</p>
          <textarea rows={3} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 mt-1 text-sm" />
          <p className="text-xs text-gray-400 mt-1">{campo.tipo_dato}</p>
        </div>
      );
    case 'tabla':
      return (
        <div className="p-3 bg-slate-700/30 rounded-md">
          <p className="font-semibold">{campo.etiqueta}</p>
          <table className="w-full mt-2 text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-slate-800">
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
