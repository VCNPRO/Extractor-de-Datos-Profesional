// Utilidades para exportar datos a diferentes formatos

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
