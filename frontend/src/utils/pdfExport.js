import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const exportInvoicePDF = async (elementId, invoiceNumber) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Invoice element not found');

  const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 16;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 8, 8, imgWidth, imgHeight);
  pdf.save(`GA-invoice-${invoiceNumber}.pdf`);
};

export { exportInvoicePDF };
