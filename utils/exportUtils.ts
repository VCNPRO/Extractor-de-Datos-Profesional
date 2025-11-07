import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { SchemaField } from '../types.ts';

const getFieldOrderFromSchema = (schema: SchemaField[]): string[] => {
    const result: string[] = [];
    
    const processField = (field: SchemaField, prefix: string = '') => {
        const fieldName = prefix ? `${prefix}.${field.name}` : field.name;
        
        if (field.type === 'OBJECT' && field.properties && field.properties.length > 0) {
            field.properties.forEach(subField => processField(subField, fieldName));
        } else if (field.type === 'ARRAY' && field.arrayItemType === 'OBJECT' && field.properties && field.properties.length > 0) {
            field.properties.forEach(subField => processField(subField, fieldName));
        } else {
            result.push(fieldName);
        }
    };
    
    schema.forEach(field => processField(field));
    return result;
};

export const jsonToExcel = (data: object | object[], schema?: SchemaField[]): Blob => {
    const dataArray = Array.isArray(data) ? data : [data];
    
    const expandArrays = (obj: any, prefix = ''): any[] => {
        let maxArrayLength = 1;
        const arrayFields: { [key: string]: any[] } = {};
        const scalarFields: { [key: string]: any } = {};

        const processObject = (o: any, p = '') => {
            Object.keys(o).forEach(key => {
                const prefixedKey = p ? `${p}.${key}` : key;
                const value = o[key];

                if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                    processObject(value, prefixedKey);
                } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
                    arrayFields[prefixedKey] = value;
                    maxArrayLength = Math.max(maxArrayLength, value.length);
                } else if (Array.isArray(value)) {
                    scalarFields[prefixedKey] = value.join('\n');
                } else {
                    scalarFields[prefixedKey] = value;
                }
            });
        };

        processObject(obj);

        const rows: any[] = [];
        for (let i = 0; i < maxArrayLength; i++) {
            const row: any = { ...scalarFields };

            Object.entries(arrayFields).forEach(([arrayKey, arrayValue]) => {
                const item = arrayValue[i];
                if (item) {
                    Object.entries(item).forEach(([propKey, propValue]) => {
                        row[`${arrayKey}.${propKey}`] = propValue;
                    });
                }
            });

            rows.push(row);
        }

        return rows;
    };

    const allRows = dataArray.flatMap(item => expandArrays(item));
    
    let allColumns: string[];
    if (schema && schema.length > 0) {
        allColumns = getFieldOrderFromSchema(schema);
    } else {
        allColumns = Array.from(new Set(allRows.flatMap(row => Object.keys(row))));
    }

    const worksheetData = [
        allColumns,
        ...allRows.map(row => allColumns.map(col => row[col] ?? ''))
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    ws['!cols'] = allColumns.map(col => ({ wch: Math.max(col.length, 15) }));
    XLSX.utils.book_append_sheet(wb, ws, 'Datos Extraídos');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    return new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
};

export const jsonToCsv = (data: object | object[], schema?: SchemaField[]): Blob => {
    const dataArray = Array.isArray(data) ? data : [data];
    
    const flattenObject = (obj: any, prefix = ''): any => {
        let result: any = {};
        
        for (const key in obj) {
            const value = obj[key];
            const prefixedKey = prefix ? `${prefix}.${key}` : key;
            
            if (value === null || value === undefined) {
                result[prefixedKey] = '';
            } else if (Array.isArray(value)) {
                if (value.length === 0) {
                    result[prefixedKey] = '';
                } else if (typeof value[0] === 'object' && value[0] !== null) {
                    const allProps = Array.from(new Set(value.flatMap(item => Object.keys(item))));
                    allProps.forEach(prop => {
                        const values = value.map((item: any, index: number) => {
                            const val = item[prop];
                            return val !== undefined && val !== null ? `[${index + 1}] ${val}` : '';
                        }).filter(v => v !== '');
                        result[`${prefixedKey}.${prop}`] = values.join('; ');
                    });
                } else {
                    result[prefixedKey] = value.join('; ');
                }
            } else if (typeof value === 'object') {
                const nested = flattenObject(value, prefixedKey);
                result = { ...result, ...nested };
            } else {
                result[prefixedKey] = value;
            }
        }
        
        return result;
    };

    const flatData = dataArray.map(item => flattenObject(item));
    
    let allColumns: string[];
    if (schema && schema.length > 0) {
        allColumns = getFieldOrderFromSchema(schema);
    } else {
        allColumns = Array.from(new Set(flatData.flatMap(row => Object.keys(row))));
    }
    
    const escapeCsvValue = (value: any): string => {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    };
    
    const header = allColumns.map(escapeCsvValue).join(',');
    const rows = flatData.map(row => 
        allColumns.map(col => escapeCsvValue(row[col] ?? '')).join(',')
    );
    
    const csv = [header, ...rows].join('\n');
    return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
};

export const jsonToPdf = (data: object | object[], schema?: SchemaField[]): Blob => {
    const doc = new jsPDF();
    const dataArray = Array.isArray(data) ? data : [data];
    
    const flattenObject = (obj: any, prefix = ''): any => {
        let result: any = {};
        
        for (const key in obj) {
            const value = obj[key];
            const prefixedKey = prefix ? `${prefix}.${key}` : key;
            
            if (value === null || value === undefined) {
                result[prefixedKey] = '';
            } else if (Array.isArray(value)) {
                if (value.length === 0) {
                    result[prefixedKey] = '';
                } else if (typeof value[0] === 'object' && value[0] !== null) {
                    result[prefixedKey] = value.map((item, index) => 
                        `[${index + 1}] ${JSON.stringify(item)}`
                    ).join('\n');
                } else {
                    result[prefixedKey] = value.join(', ');
                }
            } else if (typeof value === 'object') {
                const nested = flattenObject(value, prefixedKey);
                result = { ...result, ...nested };
            } else {
                result[prefixedKey] = value;
            }
        }
        
        return result;
    };

    const flatData = dataArray.map(item => flattenObject(item));
    
    let allColumns: string[];
    if (schema && schema.length > 0) {
        allColumns = getFieldOrderFromSchema(schema);
    } else {
        allColumns = Array.from(new Set(flatData.flatMap(row => Object.keys(row))));
    }
    
    const tableData = flatData.map(row => 
        allColumns.map(col => String(row[col] ?? ''))
    );
    
    doc.text('Datos Extraídos', 14, 15);
    
    autoTable(doc, {
        head: [allColumns],
        body: tableData,
        startY: 25,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
    });
    
    return doc.output('blob');
};
