// PDF generation utilities using jsPDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface StudentReportData {
  studentName: string;
  studentId: string;
  class: string;
  batch: string;
  rollNumber: string;
  guardianName: string;
  reportPeriod: string;
  subjects: SubjectResult[];
  attendance: AttendanceData;
  teacherRemarks: string;
  principalRemarks?: string;
}

export interface SubjectResult {
  name: string;
  fullMarks: number;
  obtainedMarks: number;
  grade: string;
  teacherName: string;
}

export interface AttendanceData {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  percentage: number;
}

export interface ExamMarksheet {
  examName: string;
  examDate: string;
  class: string;
  subject: string;
  totalMarks: number;
  students: MarksheetStudent[];
}

export interface MarksheetStudent {
  rank: number;
  rollNumber: string;
  name: string;
  obtainedMarks: number;
  percentage: number;
  grade: string;
}

// Institution details (would come from tenant settings in real app)
const institutionDetails = {
  name: 'Shikhonary Education Center',
  address: 'House 123, Road 5, Dhanmondi, Dhaka-1205',
  phone: '+880 1712-345678',
  email: 'info@shikhonary.com',
};

// Grade calculation helper
export function calculateGrade(percentage: number): string {
  if (percentage >= 80) return 'A+';
  if (percentage >= 70) return 'A';
  if (percentage >= 60) return 'A-';
  if (percentage >= 50) return 'B';
  if (percentage >= 40) return 'C';
  if (percentage >= 33) return 'D';
  return 'F';
}

// Generate Student Report Card PDF
export function generateReportCardPDF(data: StudentReportData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header - Institution Name
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(institutionDetails.name, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(institutionDetails.address, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 5;
  doc.text(`Phone: ${institutionDetails.phone} | Email: ${institutionDetails.email}`, pageWidth / 2, yPos, { align: 'center' });

  // Title
  yPos += 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PROGRESS REPORT CARD', pageWidth / 2, yPos, { align: 'center' });

  yPos += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Period: ${data.reportPeriod}`, pageWidth / 2, yPos, { align: 'center' });

  // Horizontal line
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.line(15, yPos, pageWidth - 15, yPos);

  // Student Information
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 15, yPos);

  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const infoCol1X = 15;
  const infoCol2X = pageWidth / 2 + 10;
  
  doc.text(`Name: ${data.studentName}`, infoCol1X, yPos);
  doc.text(`Student ID: ${data.studentId}`, infoCol2X, yPos);
  
  yPos += 6;
  doc.text(`Class: ${data.class}`, infoCol1X, yPos);
  doc.text(`Batch: ${data.batch}`, infoCol2X, yPos);
  
  yPos += 6;
  doc.text(`Roll Number: ${data.rollNumber}`, infoCol1X, yPos);
  doc.text(`Guardian: ${data.guardianName}`, infoCol2X, yPos);

  // Subject Results Table
  yPos += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Academic Performance', 15, yPos);

  yPos += 5;
  const subjectTableData = data.subjects.map(sub => [
    sub.name,
    sub.fullMarks.toString(),
    sub.obtainedMarks.toString(),
    ((sub.obtainedMarks / sub.fullMarks) * 100).toFixed(1) + '%',
    sub.grade,
  ]);

  // Calculate totals
  const totalFull = data.subjects.reduce((sum, s) => sum + s.fullMarks, 0);
  const totalObtained = data.subjects.reduce((sum, s) => sum + s.obtainedMarks, 0);
  const overallPercentage = (totalObtained / totalFull) * 100;
  const overallGrade = calculateGrade(overallPercentage);

  subjectTableData.push([
    'TOTAL',
    totalFull.toString(),
    totalObtained.toString(),
    overallPercentage.toFixed(1) + '%',
    overallGrade,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Subject', 'Full Marks', 'Obtained', 'Percentage', 'Grade']],
    body: subjectTableData,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [0, 128, 128], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 20, halign: 'center' },
    },
  });

  // @ts-ignore - autoTable adds this property
  yPos = doc.lastAutoTable.finalY + 10;

  // Attendance Summary
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Attendance Summary', 15, yPos);

  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const attCol1 = 15;
  const attCol2 = 60;
  const attCol3 = 105;
  const attCol4 = 150;
  
  doc.text(`Total Days: ${data.attendance.totalDays}`, attCol1, yPos);
  doc.text(`Present: ${data.attendance.presentDays}`, attCol2, yPos);
  doc.text(`Absent: ${data.attendance.absentDays}`, attCol3, yPos);
  doc.text(`Attendance: ${data.attendance.percentage}%`, attCol4, yPos);

  // Progress bar for attendance
  yPos += 8;
  const barWidth = 100;
  const barHeight = 6;
  const barX = 15;
  
  // Background
  doc.setFillColor(230, 230, 230);
  doc.rect(barX, yPos, barWidth, barHeight, 'F');
  
  // Fill based on percentage
  const fillWidth = (data.attendance.percentage / 100) * barWidth;
  const attendanceColor = data.attendance.percentage >= 75 ? [34, 197, 94] : [239, 68, 68];
  doc.setFillColor(attendanceColor[0], attendanceColor[1], attendanceColor[2]);
  doc.rect(barX, yPos, fillWidth, barHeight, 'F');

  // Teacher Remarks
  yPos += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Teacher\'s Remarks', 15, yPos);
  
  yPos += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const splitRemarks = doc.splitTextToSize(data.teacherRemarks, pageWidth - 30);
  doc.text(splitRemarks, 15, yPos);
  yPos += splitRemarks.length * 5;

  // Principal Remarks (if provided)
  if (data.principalRemarks) {
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Principal\'s Remarks', 15, yPos);
    
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const splitPrincipalRemarks = doc.splitTextToSize(data.principalRemarks, pageWidth - 30);
    doc.text(splitPrincipalRemarks, 15, yPos);
  }

  // Signature section
  yPos = doc.internal.pageSize.getHeight() - 40;
  doc.setLineWidth(0.3);
  
  // Class Teacher signature
  doc.line(15, yPos, 70, yPos);
  doc.text('Class Teacher', 30, yPos + 5);
  
  // Parent signature
  doc.line(85, yPos, 140, yPos);
  doc.text('Parent/Guardian', 98, yPos + 5);
  
  // Principal signature
  doc.line(155, yPos, pageWidth - 15, yPos);
  doc.text('Principal', 170, yPos + 5);

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, yPos);
  doc.text('This is a computer-generated document', pageWidth - 15, yPos, { align: 'right' });

  return doc;
}

// Generate Exam Marksheet PDF
export function generateMarksheetPDF(data: ExamMarksheet): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(institutionDetails.name, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(institutionDetails.address, pageWidth / 2, yPos, { align: 'center' });

  // Title
  yPos += 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('EXAMINATION MARKSHEET', pageWidth / 2, yPos, { align: 'center' });

  // Exam Details
  yPos += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Exam: ${data.examName}`, 15, yPos);
  doc.text(`Date: ${data.examDate}`, pageWidth - 60, yPos);
  
  yPos += 6;
  doc.text(`Class: ${data.class}`, 15, yPos);
  doc.text(`Subject: ${data.subject}`, pageWidth / 2, yPos);
  doc.text(`Total Marks: ${data.totalMarks}`, pageWidth - 60, yPos);

  // Horizontal line
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.line(15, yPos, pageWidth - 15, yPos);

  // Results Table
  yPos += 8;
  const tableData = data.students.map(student => [
    student.rank.toString(),
    student.rollNumber,
    student.name,
    student.obtainedMarks.toString(),
    student.percentage.toFixed(1) + '%',
    student.grade,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Rank', 'Roll No.', 'Student Name', 'Marks', 'Percentage', 'Grade']],
    body: tableData,
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [0, 128, 128], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 60 },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 20, halign: 'center' },
    },
  });

  // Statistics
  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 15;
  
  const passCount = data.students.filter(s => s.percentage >= 33).length;
  const avgMarks = data.students.reduce((sum, s) => sum + s.obtainedMarks, 0) / data.students.length;
  const highestMarks = Math.max(...data.students.map(s => s.obtainedMarks));
  const lowestMarks = Math.min(...data.students.map(s => s.obtainedMarks));

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Statistics', 15, yPos);

  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Students: ${data.students.length}`, 15, yPos);
  doc.text(`Pass: ${passCount} | Fail: ${data.students.length - passCount}`, 70, yPos);
  
  yPos += 6;
  doc.text(`Highest: ${highestMarks} | Lowest: ${lowestMarks} | Average: ${avgMarks.toFixed(1)}`, 15, yPos);
  doc.text(`Pass Rate: ${((passCount / data.students.length) * 100).toFixed(1)}%`, 130, yPos);

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 30;
  doc.setLineWidth(0.3);
  doc.line(15, yPos, 70, yPos);
  doc.text('Examiner', 35, yPos + 5);
  
  doc.line(pageWidth - 70, yPos, pageWidth - 15, yPos);
  doc.text('Principal', pageWidth - 50, yPos + 5);

  yPos = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, yPos);

  return doc;
}

// Invoice data interface
export interface InvoiceData {
  studentName: string;
  studentClass: string;
  studentRoll: string;
  month: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  receiptNo: string;
  date: string;
  method: string;
  transactions: { amount: number; method: string; date: string; receiptNo: string; note?: string }[];
}

// Generate Fee Invoice PDF
export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(institutionDetails.name, pageWidth / 2, yPos, { align: 'center' });

  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(institutionDetails.address, pageWidth / 2, yPos, { align: 'center' });

  yPos += 5;
  doc.text(`Phone: ${institutionDetails.phone} | Email: ${institutionDetails.email}`, pageWidth / 2, yPos, { align: 'center' });

  // Title
  yPos += 12;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FEE INVOICE / RECEIPT', pageWidth / 2, yPos, { align: 'center' });

  // Divider
  yPos += 5;
  doc.setLineWidth(0.5);
  doc.line(15, yPos, pageWidth - 15, yPos);

  // Invoice meta
  yPos += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt No: ${data.receiptNo}`, 15, yPos);
  doc.text(`Date: ${data.date === '-' ? 'N/A' : data.date}`, pageWidth - 60, yPos);

  yPos += 6;
  doc.text(`Month: ${data.month}`, 15, yPos);

  const statusLabel = data.status.charAt(0).toUpperCase() + data.status.slice(1);
  doc.text(`Status: ${statusLabel}`, pageWidth - 60, yPos);

  // Student info section
  yPos += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 15, yPos);

  yPos += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${data.studentName}`, 15, yPos);
  doc.text(`Class: ${data.studentClass}`, pageWidth / 2, yPos);

  yPos += 6;
  doc.text(`Roll: ${data.studentRoll}`, 15, yPos);

  // Fee breakdown table
  yPos += 12;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Fee Breakdown', 15, yPos);

  yPos += 5;
  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'Amount (৳)']],
    body: [
      ['Monthly Tuition Fee', data.totalAmount.toLocaleString()],
      ['Amount Paid', data.paidAmount.toLocaleString()],
      ['Balance Due', data.dueAmount.toLocaleString()],
    ],
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [0, 128, 128], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 50, halign: 'right' },
    },
  });

  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 10;

  // Transaction history
  if (data.transactions.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment History', 15, yPos);

    yPos += 5;
    const txRows = data.transactions.map((tx) => [
      tx.date,
      tx.method.charAt(0).toUpperCase() + tx.method.slice(1),
      tx.receiptNo,
      `৳${tx.amount.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Date', 'Method', 'Receipt', 'Amount']],
      body: txRows,
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [0, 128, 128], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35, halign: 'right' },
      },
    });

    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 10;
  }

  // Signature section
  yPos = Math.max(yPos + 20, doc.internal.pageSize.getHeight() - 45);
  doc.setLineWidth(0.3);

  doc.line(15, yPos, 70, yPos);
  doc.setFontSize(9);
  doc.text('Accountant', 32, yPos + 5);

  doc.line(pageWidth - 70, yPos, pageWidth - 15, yPos);
  doc.text('Principal', pageWidth - 50, yPos + 5);

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 15;
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, yPos);
  doc.text('This is a computer-generated document', pageWidth - 15, yPos, { align: 'right' });

  return doc;
}

// Helper to download PDF
export function downloadPDF(doc: jsPDF, filename: string): void {
  doc.save(`${filename}.pdf`);
}

// Helper to open PDF in new tab for print
export function printPDF(doc: jsPDF): void {
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(pdfUrl, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
