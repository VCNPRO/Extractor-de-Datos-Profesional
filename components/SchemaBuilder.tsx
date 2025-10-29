
import React from 'react';
// Fix: Use explicit file extension in import.
import type { SchemaField, SchemaFieldType } from '../types.ts';
import { PlusIcon, TrashIcon } from './Icons';

interface SchemaBuilderProps {
  schema: SchemaField[];
  setSchema: React.Dispatch<React.SetStateAction<SchemaField[]>>;
}

const fieldTypes: SchemaFieldType[] = ['STRING', 'NUMBER', 'BOOLEAN', 'ARRAY_OF_STRINGS', 'OBJECT', 'ARRAY_OF_OBJECTS'];

const validateFieldName = (name: string): string | undefined => {
  if (!name.trim()) {
    return 'El nombre del campo no puede estar vacío.';
  }
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    return 'Nombre inválido. Use solo letras, números y guiones bajos, comenzando con una letra o guion bajo.';
  }
  return undefined;
};

// Recursive function to apply updates to the nested schema structure
const updateSchemaByPath = (
    schema: SchemaField[],
    path: string[],
    updateFn: (field: SchemaField) => SchemaField, // For updates on the field itself
    childrenUpdateFn?: (children: SchemaField[]) => SchemaField[] // For add/remove on a children array
): SchemaField[] => {
    const [currentId, ...restPath] = path;

    if (!currentId) {
        return childrenUpdateFn ? childrenUpdateFn(schema) : schema;
    }

    return schema.map(field => {
        if (field.id === currentId) {
            if (restPath.length > 0) {
                const newChildren = updateSchemaByPath(field.children || [], restPath, updateFn, childrenUpdateFn);
                return { ...field, children: newChildren };
            }
            if (childrenUpdateFn && (field.type === 'OBJECT' || field.type === 'ARRAY_OF_OBJECTS')) {
                return { ...field, children: childrenUpdateFn(field.children || []) };
            } else {
                return updateFn(field);
            }
        }
        return field;
    });
};

const SchemaFieldRow: React.FC<{
    field: SchemaField;
    path: string[];
    onUpdate: (path: string[], newField: Partial<SchemaField>) => void;
    onRemove: (path: string[]) => void;
    onAddChild: (path: string[]) => void;
    isRoot: boolean;
    schemaLength: number;
}> = ({ field, path, onUpdate, onRemove, onAddChild, isRoot, schemaLength }) => {
    const isNestedType = field.type === 'OBJECT' || field.type === 'ARRAY_OF_OBJECTS';

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        const validationError = validateFieldName(newName);
        onUpdate(path, { name: newName, error: validationError });
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center bg-slate-700/30 p-3 rounded-md">
                 <input
                    type="text"
                    value={field.name}
                    onChange={handleNameChange}
                    placeholder="Nombre del Campo (ej., nombre_cliente)"
                    className={`w-full bg-slate-800 border rounded-md p-2 focus:outline-none transition-shadow text-sm ${
                        field.error 
                        ? 'border-red-500 ring-2 ring-red-500/50' 
                        : 'border-slate-600 focus:ring-2 focus:ring-cyan-500'
                    }`}
                />
                <div className="flex items-center gap-3">
                    <select
                        value={field.type}
                        onChange={(e) => onUpdate(path, { type: e.target.value as SchemaFieldType })}
                        className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-sm appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem',
                        }}
                    >
                        {fieldTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => onRemove(path)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        disabled={isRoot && schemaLength <= 1}
                        aria-label="Eliminar campo"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {field.error && <p className="text-sm text-red-400 px-1">{field.error}</p>}
            
            {isNestedType && field.children && (
                <div className="ml-6 pl-4 border-l-2 border-slate-600 space-y-4 pt-2">
                    {field.children.map(childField => (
                         <SchemaFieldRow
                            key={childField.id}
                            field={childField}
                            path={[...path, childField.id]}
                            onUpdate={onUpdate}
                            onRemove={onRemove}
                            onAddChild={onAddChild}
                            isRoot={false}
                            schemaLength={field.children?.length ?? 0}
                        />
                    ))}
                     <button
                        onClick={() => onAddChild(path)}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium py-1 px-2 rounded-md transition-colors text-xs bg-slate-700/50 hover:bg-slate-700"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Añadir Sub-Campo
                    </button>
                </div>
            )}
        </div>
    );
};

export const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ schema, setSchema }) => {
  
  const handleUpdate = (path: string[], payload: Partial<SchemaField>) => {
    const updater = (field: SchemaField): SchemaField => {
        const updatedField = { ...field, ...payload };
        if ((updatedField.type === 'OBJECT' || updatedField.type === 'ARRAY_OF_OBJECTS') && !updatedField.children) {
            updatedField.children = [{ id: `field-${Date.now()}`, name: '', type: 'STRING' }];
        }
        if (field.type !== updatedField.type && (field.type === 'OBJECT' || field.type === 'ARRAY_OF_OBJECTS')) {
            delete updatedField.children;
        }
        return updatedField;
    };
    setSchema(currentSchema => updateSchemaByPath(currentSchema, path, updater));
  };

  const handleRemove = (path: string[]) => {
    const parentPath = path.slice(0, -1);
    const childIdToRemove = path[path.length - 1];
    const childrenUpdater = (children: SchemaField[]) => children.filter(f => f.id !== childIdToRemove);
    setSchema(currentSchema => updateSchemaByPath(currentSchema, parentPath, f => f, childrenUpdater));
  };

  const handleAddChild = (path: string[]) => {
    const newField: SchemaField = { id: `field-${Date.now()}`, name: '', type: 'STRING' };
    const childrenUpdater = (children: SchemaField[]) => [...children, newField];
    setSchema(currentSchema => updateSchemaByPath(currentSchema, path, f => f, childrenUpdater));
  };
  
  const addRootField = () => {
    setSchema([...schema, { id: `field-${Date.now()}`, name: '', type: 'STRING' }]);
  };


  return (
    <div className="space-y-4">
      {schema.map(field => (
        <SchemaFieldRow
            key={field.id}
            field={field}
            path={[field.id]}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
            onAddChild={handleAddChild}
            isRoot={true}
            schemaLength={schema.length}
        />
      ))}
      <button
        onClick={addRootField}
        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium py-2 px-3 rounded-md transition-colors text-sm bg-slate-700/50 hover:bg-slate-700"
      >
        <PlusIcon className="w-4 h-4" />
        Añadir Campo
      </button>
    </div>
  );
};
