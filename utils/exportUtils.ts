// Utilidades para exportar datos a diferentes formatos
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { SchemaField } from '../types.ts';

const getFieldOrderFromSchema = (schema: SchemaField[], prefix = ''): string[] => {
    const fields: string[] = [];
    for (const field of schema) {
        const fieldName = prefix ? `${prefix}.${field.name}` : field.name;
        if (field.type === 'OBJECT' && field.children) {
            fields.push(...getFieldOrderFromSchema(field.children, fieldName));
        } else if (field.type === 'ARRAY_OF_OBJECTS' && field.children) {
            for (const child of field.children) {
                fields.push(`${fieldName}.${child.name}`);
            }
        } else {
            fields.push(fieldName);
        }
    }
    return fields;
};

export const jsonToPDF = (data: object | object[], filename: string, schema?: SchemaField[]): Blob => {
    const pdf = new jsPDF();
    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0) {
        pdf.text('No hay datos para mostrar', 10, 10);
        return pdf.output('blob');
    }
    pdf.setFontSize(16);
    pdf.setTextColor(0, 102, 204);
    pdf.text('Resultados de Extracción de Datos', 14, 15);
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Fecha: ${new Date().toLocaleString('es-ES')}`, 14, 22);
    pdf.text(`Archivo: ${filename}`, 14, 27);
    const flattenObject = (obj: any, prefix = ''): any => {
        return Object.keys(obj).reduce((acc: any, key: string) => {
            const prefixedKey = prefix ? `${prefix}.${key}` : key;
            if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                Object.assign(acc, flattenObject(obj[key], prefixedKey));
            } else if (Array.isArray(obj[key])) {
                if (obj[key].length > 0 && typeof obj[key][0] === 'object' && obj[key][0] !== null) {
                    const allProps = new Set<string>();
                    obj[key].forEach((item: any) => { Object.keys(item).forEach(prop => allProps.add(prop)); });
                    allProps.forEach(prop => {
                        const values = obj[key].map((item: any, index: number) => {
                            const value = item[prop];
                            return value !== undefined && value !== null ? `[${index + 1}] ${value}` : '';
                        }).filter(v => v !== '');
                        acc[`${prefixedKey}.${prop}`] = values.join('; ');
                    });
                } else {
                    acc[prefixedKey] = obj[key].join('; ');
                }
            } else {
                acc[prefixedKey] = obj[key];
            }
            return acc;
        }, {});
    };
    const flattenedData = dataArray.map(item => flattenObject(item));
    let allColumns: string[];
    if (schema && schema.length > 0) {
        allColumns = getFieldOrderFromSchema(schema);
    } else {
        allColumns = Array.from(new Set(flattenedData.flatMap(item => Object.keys(item))));
    }
    const tableData = flattenedData.map(item => allColumns.map(col => String(item[col] ?? '')));
    autoTable(pdf, {
        head: [allColumns],
        body: tableData,
        startY: 32,
        theme: 'striped',
        headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: 'bold', halign: 'left' },
        styles: { fontSize: 9, cellPadding: 3 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 32, left: 14, right: 14 }
    });
    return pdf.output('blob');
};

export const downloadPDF = (data: object | object[], filename: string, schema?: SchemaField[]) => {
    const blob = jsonToPDF(data, filename, schema);
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.pdf`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const generatePDFPreviewURL = (data: object | object[], filename: string, schema?: SchemaField[]): string => {
    const blob = jsonToPDF(data, filename, schema);
    return URL.createObjectURL(blob);
};

export const jsonToCSV = (data: object | object[], schema?: SchemaField[]): string => {
    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0) return '';
    const flattenObject = (obj: any, prefix = ''): any => {
        return Object.keys(obj).reduce((acc: any, key: string) => {
            const prefixedKey = prefix ? `${prefix}.${key}` : key;
            if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                Object.assign(acc, flattenObject(obj[key], prefixedKey));
            } else if (Array.isArray(obj[key])) {
                if (obj[key].length > 0 && typeof obj[key][0] === 'object' && obj[key][0] !== null) {
                    const allProps = new Set<string>();
                    obj[key].forEach((item: any) => { Object.keys(item).forEach(prop => allProps.add(prop)); });
                    allProps.forEach(prop => {
                        const values = obj[key].map((item: any, index: number) => {
                            const value = item[prop];
                            return value !== undefined && value !== null ? `[${index + 1}] ${value}` : '';
                        }).filter(v => v !== '');
                        acc[`${prefixedKey}.${prop}`] = values.join('; ');
                    });
                } else {
                    acc[prefixedKey] = obj[key].join('; ');
                }
            } else {
                acc[prefixedKey] = obj[key];
            }
            return acc;
        }, {});
    };
    const flattenedData = dataArray.map(item => flattenObject(item));
    let allColumns: string[];
    if (schema && schema.length > 0) {
        allColumns = getFieldOrderFromSchema(schema);
    } else {
        allColumns = Array.from(new Set(flattenedData.flatMap(item => Object.keys(item))));
    }
    const headers = allColumns.map(col => `"${col}"`).join(',');
    const rows = flattenedData.map(item => {
        return allColumns.map(col => {
            const value = item[col] ?? '';
            const stringValue = String(value).replace(/"/g, '""');
            return `"${stringValue}"`;
        }).join(',');
    });
    return [headers, ...rows].join('\n');
};

export const downloadCSV = (data: object | object[], filename: string, schema?: SchemaField[]) => {
    const csv = jsonToCSV(data, schema);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const jsonToExcel = (data: object | object[], schema?: SchemaField[]): Blob => {
    const dataArray = Array.isArray(data) ? data : [data];
    if (dataArray.length === 0) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([['No hay datos']]);
        XLSX.utils.book_append_sheet(wb, ws, 'Datos Extraídos');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
    const expandArrays = (obj: any): any[] => {
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
                } else {
                    if (arrayValue[0]) {
                        Object.keys(arrayValue[0]).forEach(propKey => {
                            row[`${arrayKey}.${propKey}`] = '';
                        });
                    }
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
    const worksheetData = [allColumns, ...allRows.map(row => allColumns.map(col => row[col] ?? ''))];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const colWidths = allColumns.map(col => ({ wch: Math.max(col.length, 15) }));
    ws['!cols'] = colWidths;
    XLSX.utils.book_append_sheet(wb, ws, 'Datos Extraídos');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const downloadExcel = (data: object | object[], filename: string, schema?: SchemaField[]) => {
    const blob = jsonToExcel(data, schema);
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
};

export const downloadJSON = (data: object | object[], filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
