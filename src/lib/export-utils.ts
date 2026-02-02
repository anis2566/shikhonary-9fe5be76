// Data export utilities for CSV and Excel formats

export interface ExportColumn {
  key: string;
  header: string;
  formatter?: (value: any) => string;
}

// Convert array of objects to CSV string
export function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[]
): string {
  if (data.length === 0) return '';

  // Header row
  const headers = columns.map(col => `"${col.header}"`).join(',');

  // Data rows
  const rows = data.map(item =>
    columns
      .map(col => {
        const value = item[col.key];
        const formatted = col.formatter ? col.formatter(value) : String(value ?? '');
        // Escape quotes and wrap in quotes
        return `"${formatted.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  return [headers, ...rows].join('\n');
}

// Download string as file
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export data as CSV
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[],
  filename: string
): void {
  const csv = arrayToCSV(data, columns);
  // Add BOM for Excel compatibility with UTF-8
  const csvWithBOM = '\uFEFF' + csv;
  downloadFile(csvWithBOM, `${filename}.csv`, 'text/csv;charset=utf-8');
}

// Export data as Excel-compatible format (CSV with .xlsx extension hint)
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[],
  filename: string
): void {
  // Create HTML table for better Excel compatibility
  const tableHtml = createHtmlTable(data, columns);
  downloadFile(tableHtml, `${filename}.xls`, 'application/vnd.ms-excel');
}

// Create HTML table for Excel export
function createHtmlTable<T extends Record<string, any>>(
  data: T[],
  columns: ExportColumn[]
): string {
  const headerCells = columns.map(col => `<th>${escapeHtml(col.header)}</th>`).join('');
  
  const rows = data.map(item => {
    const cells = columns.map(col => {
      const value = item[col.key];
      const formatted = col.formatter ? col.formatter(value) : String(value ?? '');
      return `<td>${escapeHtml(formatted)}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <table>
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Predefined column configurations for common exports
export const studentColumns: ExportColumn[] = [
  { key: 'id', header: 'Student ID' },
  { key: 'name', header: 'Full Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'batch', header: 'Batch' },
  { key: 'class', header: 'Class' },
  { key: 'guardianName', header: 'Guardian Name' },
  { key: 'guardianPhone', header: 'Guardian Phone' },
  { key: 'enrollmentDate', header: 'Enrollment Date', formatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
  { key: 'status', header: 'Status' },
];

export const attendanceColumns: ExportColumn[] = [
  { key: 'date', header: 'Date', formatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
  { key: 'studentId', header: 'Student ID' },
  { key: 'studentName', header: 'Student Name' },
  { key: 'batch', header: 'Batch' },
  { key: 'status', header: 'Status' },
  { key: 'checkInTime', header: 'Check-in Time' },
  { key: 'remarks', header: 'Remarks' },
];

export const resultColumns: ExportColumn[] = [
  { key: 'examName', header: 'Exam Name' },
  { key: 'studentId', header: 'Student ID' },
  { key: 'studentName', header: 'Student Name' },
  { key: 'subject', header: 'Subject' },
  { key: 'totalMarks', header: 'Total Marks' },
  { key: 'obtainedMarks', header: 'Obtained Marks' },
  { key: 'percentage', header: 'Percentage (%)', formatter: (v) => v ? `${v.toFixed(1)}%` : '' },
  { key: 'grade', header: 'Grade' },
  { key: 'rank', header: 'Rank' },
];

export const teacherColumns: ExportColumn[] = [
  { key: 'id', header: 'Teacher ID' },
  { key: 'name', header: 'Full Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'subjects', header: 'Subjects', formatter: (v) => Array.isArray(v) ? v.join(', ') : v },
  { key: 'qualification', header: 'Qualification' },
  { key: 'joiningDate', header: 'Joining Date', formatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
  { key: 'status', header: 'Status' },
];

export const batchColumns: ExportColumn[] = [
  { key: 'id', header: 'Batch ID' },
  { key: 'name', header: 'Batch Name' },
  { key: 'class', header: 'Class' },
  { key: 'timing', header: 'Timing' },
  { key: 'teacher', header: 'Teacher' },
  { key: 'studentCount', header: 'Total Students' },
  { key: 'capacity', header: 'Capacity' },
  { key: 'status', header: 'Status' },
];

// Format date for filenames
export function getExportFilename(prefix: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `${prefix}_${date}`;
}
