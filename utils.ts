import { DataColumn } from './types';

export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        const val = values[index];
        // simple type inference
        if (!isNaN(Number(val)) && val !== '') {
          row[header] = Number(val);
        } else if (val.toLowerCase() === 'true' || val.toLowerCase() === 'false') {
          row[header] = val.toLowerCase() === 'true';
        } else {
          row[header] = val;
        }
      });
      data.push(row);
    }
  }
  return data;
};

export const analyzeColumns = (data: any[]): DataColumn[] => {
  if (data.length === 0) return [];
  const headers = Object.keys(data[0]);

  return headers.map(header => {
    const values = data.map(row => row[header]);
    const unique = new Set(values).size;
    const missing = values.filter(v => v === null || v === undefined || v === '').length;
    
    // Determine type based on first non-null
    const firstValid = values.find(v => v !== null && v !== undefined && v !== '');
    let type: 'string' | 'number' | 'boolean' | 'date' = 'string';
    if (typeof firstValid === 'number') type = 'number';
    else if (typeof firstValid === 'boolean') type = 'boolean';
    
    return {
      name: header,
      type,
      unique,
      missing,
      sample: values.slice(0, 5)
    };
  });
};