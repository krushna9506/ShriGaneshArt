import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports the invoice as a pixel-perfect A4 PDF.
 * The invoice element MUST already be rendered at 210mm × 297mm (794px × 1123px at 96dpi).
 */
const exportInvoicePDF = async (elementId, invoiceNumber) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Invoice element not found');

  // Force the element to A4 dimensions before capturing
  const A4_PX_WIDTH  = 794;   // 210mm at 96dpi
  const A4_PX_HEIGHT = 1123;  // 297mm at 96dpi

  const prevWidth  = element.style.width;
  const prevHeight = element.style.height;
  const prevOverflow = element.style.overflow;

  element.style.width    = `${A4_PX_WIDTH}px`;
  element.style.minHeight = `${A4_PX_HEIGHT}px`;
  element.style.overflow  = 'visible';

  const canvas = await html2canvas(element, {
    scale: 2,                      // 2× = 1588×2246 → crisp on retina
    backgroundColor: '#ffffff',
    useCORS: true,
    allowTaint: true,
    logging: false,
    width:  A4_PX_WIDTH,
    height: A4_PX_HEIGHT,
    windowWidth:  A4_PX_WIDTH,
    windowHeight: A4_PX_HEIGHT,
  });

  // Restore original styles
  element.style.width    = prevWidth;
  element.style.minHeight = '';
  element.style.overflow  = prevOverflow;

  const imgData = canvas.toDataURL('image/png');

  // A4 in jsPDF units (mm)
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PAGE_W = 210;
  const PAGE_H = 297;

  // If invoice spans multiple pages, slice canvas into A4 chunks
  const totalCanvasHeight = canvas.height;
  const a4CanvasHeight = Math.round((PAGE_H / PAGE_W) * canvas.width);

  let yOffset = 0;
  let firstPage = true;

  while (yOffset < totalCanvasHeight) {
    if (!firstPage) pdf.addPage();
    firstPage = false;

    // Slice this page's portion from the canvas
    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width  = canvas.width;
    sliceCanvas.height = Math.min(a4CanvasHeight, totalCanvasHeight - yOffset);
    const ctx = sliceCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, -yOffset);

    const sliceData = sliceCanvas.toDataURL('image/png');
    const sliceHeight = (sliceCanvas.height * PAGE_W) / canvas.width;
    pdf.addImage(sliceData, 'PNG', 0, 0, PAGE_W, sliceHeight);

    yOffset += a4CanvasHeight;
  }

  pdf.save(`GA-Invoice-${invoiceNumber}.pdf`);
};

export { exportInvoicePDF };
