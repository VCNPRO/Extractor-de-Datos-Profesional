// Utilidades para exportar datos a diferentes formatos
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Convierte un objeto JSON a PDF y retorna el blob
 */
export const jsonToPDF = (data: object | object[], filename: string): Blob => {
    const pdf = new jsPDF();
    const dataArray = Array.isArray(data) ? data : [data];

    if (dataArray.length === 0) {
        pdf.text('No hay datos para mostrar', 10, 10);
        return pdf.output('blob');
    }

    // Título
    pdf.setFontSize(16);
    pdf.setTextColor(0, 102, 204);
    pdf.text('Resultados de Extracción de Datos', 14, 15);

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Fecha: ${new Date().toLocaleString('es-ES')}`, 14, 22);
    pdf.text(`Archivo: ${filename}`, 14, 27);

    // Función para aplanar objetos anidados
    const flattenObject = (obj: any, prefix = ''): any => {
        return Object.keys(obj).reduce((acc: any, key: string) => {
            const prefixedKey = prefix ? `${prefix}.${key}` : key;

            if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                Object.assign(acc, flattenObject(obj[key], prefixedKey));
            } else if (Array.isArray(obj[key])) {
                acc[prefixedKey] = obj[key].join('; ');
            } else {
                acc[prefixedKey] = obj[key];
            }

            return acc;
        }, {});
    };

    const flattenedData = dataArray.map(item => flattenObject(item));
    const allColumns = Array.from(
        new Set(flattenedData.flatMap(item => Object.keys(item)))
    );

    // Preparar datos para la tabla
    const tableData = flattenedData.map(item =>
        allColumns.map(col => String(item[col] ?? ''))
    );

    // Crear tabla con autoTable
    autoTable(pdf, {
        head: [allColumns],
        body: tableData,
        startY: 32,
        theme: 'striped',
        headStyles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'left'
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        },
        margin: { top: 32, left: 14, right: 14 }
    });

    return pdf.output('blob');
};

/**
 * Descarga un archivo PDF
 */
export const downloadPDF = (data: object | object[], filename: string) => {
    const blob = jsonToPDF(data, filename);
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.pdf`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Genera una URL de objeto para mostrar el PDF en un iframe
 */
export const generatePDFPreviewURL = (data: object | object[], filename: string): string => {
    const blob = jsonToPDF(data, filename);
    return URL.createObjectURL(blob);
};

/**
 * Convierte un objeto JSON a CSV
 */
export const jsonToCSV = (data: object | object[]): string => {
    // Si es un solo objeto, convertirlo a array
    const dataArray = Array.isArray(data) ? data : [data];

    if (dataArray.length === 0) {
        return '';
    }

    // Función recursiva para aplanar objetos anidados
    const flattenObject = (obj: any, prefix = ''): any => {
        return Object.keys(obj).reduce((acc: any, key: string) => {
            const prefixedKey = prefix ? `${prefix}.${key}` : key;

            if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                Object.assign(acc, flattenObject(obj[key], prefixedKey));
            } else if (Array.isArray(obj[key])) {
                // Convertir arrays a string separado por punto y coma
                acc[prefixedKey] = obj[key].join('; ');
            } else {
                acc[prefixedKey] = obj[key];
            }

            return acc;
        }, {});
    };

    // Aplanar todos los objetos
    const flattenedData = dataArray.map(item => flattenObject(item));

    // Obtener todas las columnas únicas
    const allColumns = Array.from(
        new Set(flattenedData.flatMap(item => Object.keys(item)))
    );

    // Crear encabezados CSV
    const headers = allColumns.map(col => `"${col}"`).join(',');

    // Crear filas CSV
    const rows = flattenedData.map(item => {
        return allColumns.map(col => {
            const value = item[col] ?? '';
            // Escapar comillas y envolver en comillas si contiene comas o saltos de línea
            const stringValue = String(value).replace(/"/g, '""');
            return `"${stringValue}"`;
        }).join(',');
    });

    return [headers, ...rows].join('\n');
};

/**
 * Descarga un archivo CSV
 */
export const downloadCSV = (data: object | object[], filename: string) => {
    const csv = jsonToCSV(data);
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

/**
 * Convierte un objeto JSON a Excel (formato HTML que Excel puede abrir)
 */
export const jsonToExcel = (data: object | object[]): string => {
    const dataArray = Array.isArray(data) ? data : [data];

    if (dataArray.length === 0) {
        return '';
    }

    // Función para aplanar objetos anidados
    const flattenObject = (obj: any, prefix = ''): any => {
        return Object.keys(obj).reduce((acc: any, key: string) => {
            const prefixedKey = prefix ? `${prefix}.${key}` : key;

            if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                Object.assign(acc, flattenObject(obj[key], prefixedKey));
            } else if (Array.isArray(obj[key])) {
                acc[prefixedKey] = obj[key].join('; ');
            } else {
                acc[prefixedKey] = obj[key];
            }

            return acc;
        }, {});
    };

    const flattenedData = dataArray.map(item => flattenObject(item));
    const allColumns = Array.from(
        new Set(flattenedData.flatMap(item => Object.keys(item)))
    );

    // Crear tabla HTML para Excel
    let html = `
        <html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
            <meta charset="UTF-8">
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Datos Extraídos</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
        </head>
        <body>
            <table border="1">
                <thead>
                    <tr>
                        ${allColumns.map(col => `<th style="background-color: #4472C4; color: white; font-weight: bold; padding: 8px;">${col}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${flattenedData.map(item => `
                        <tr>
                            ${allColumns.map(col => `<td style="padding: 6px;">${item[col] ?? ''}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

    return html;
};

/**
 * Descarga un archivo Excel
 */
export const downloadExcel = (data: object | object[], filename: string) => {
    const html = jsonToExcel(data);
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xls`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Descarga datos en formato JSON
 */
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
