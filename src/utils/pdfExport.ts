import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (
  title: string,
  headers: string[],
  data: (string | number)[][],
  summary?: { label: string; value: string | number }[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add title
  doc.setFontSize(20);
  doc.text('Alvaro Rugama', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Make Up Studio & Beauty Salon', pageWidth / 2, 28, { align: 'center' });
  
  // Add report title
  doc.setFontSize(16);
  doc.text(title, pageWidth / 2, 40, { align: 'center' });

  // Add date
  doc.setFontSize(10);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth - 20, 50, { align: 'right' });

  // Add summary if provided
  let startY = 60;
  if (summary) {
    summary.forEach((item, index) => {
      doc.text(`${item.label}: ${item.value}`, 20, startY + (index * 7));
    });
    startY += (summary.length * 7) + 10;
  }

  // Add table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [233, 30, 99],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
    },
  });

  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
};