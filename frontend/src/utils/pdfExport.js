import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports the invoice as a pixel-perfect A4 PDF.
 * The invoice element is the .invoice-scroll-wrapper container, containing multiple pages.
 */
const exportInvoicePDF = async (elementId, invoiceNumber) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Invoice element not found');

  const A4_PX_WIDTH  = 794;   // 210mm at 96dpi
  const A4_PX_HEIGHT = 1123;  // 297mm at 96dpi

  // Find all printable pages inside the wrapper
  const children = element.querySelectorAll('.invoice-printable');
  const totalPages = children.length || 1;

  // Save current styles for restoration
  const prevWidth = element.style.width;
  const prevPadding = element.style.padding;
  const prevBackground = element.style.background;
  const prevOverflow = element.style.overflow;

  // Temporary styles to force a continuous vertical strip with zero padding
  element.style.width = `${A4_PX_WIDTH}px`;
  element.style.padding = '0';
  element.style.background = '#ffffff';
  element.style.overflow = 'visible';

  // Save child styles and zero them out to avoid borders, margins, or rounding in the PDF
  const savedStyles = [];
  children.forEach((child) => {
    savedStyles.push({
      element: child,
      margin: child.style.margin,
      borderRadius: child.style.borderRadius,
      boxShadow: child.style.boxShadow,
      border: child.style.border,
      height: child.style.height
    });
    
    child.style.margin = '0';
    child.style.borderRadius = '0';
    child.style.boxShadow = 'none';
    child.style.border = 'none';
    child.style.height = `${A4_PX_HEIGHT}px`; // Force exact target height per page
  });

  const actualHeight = A4_PX_HEIGHT * totalPages;

  // MANDATORY CRITICAL FIX: Wait for all web fonts (Outfit, Noto Sans Devanagari, etc.)
  // to be completely loaded, and give the browser a small paint timeout to prevent
  // font rendering discrepancies and text misalignments in the html2canvas generation.
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 150));

  const canvas = await html2canvas(element, {
    scale: 2,                      // 2× = 1588×(2246*N) → crisp on high-res
    backgroundColor: '#ffffff',
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: A4_PX_WIDTH,
    height: actualHeight,
    windowWidth: A4_PX_WIDTH,
    windowHeight: actualHeight,
  });

  // Restore original styles
  element.style.width = prevWidth;
  element.style.padding = prevPadding;
  element.style.background = prevBackground;
  element.style.overflow = prevOverflow;

  savedStyles.forEach((s) => {
    s.element.style.margin = s.margin;
    s.element.style.borderRadius = s.borderRadius;
    s.element.style.boxShadow = s.boxShadow;
    s.element.style.border = s.border;
    s.element.style.height = s.height;
  });

  // A4 in jsPDF units (mm)
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PAGE_W = 210;
  const PAGE_H = 297;

  // Slice continuous canvas into single A4 PDF pages
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

/**
 * Exports the dual-column model master catalog list as a pixel-perfect A4 PDF.
 */
const exportCatalogPDF = async (elementId, title) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Catalog element not found');

  const A4_PX_WIDTH  = 794;   // 210mm at 96dpi
  const A4_PX_HEIGHT = 1123;  // 297mm at 96dpi

  // Temporarily reveal the hidden wrapper for capturing
  element.classList.remove('hidden');

  const children = element.querySelectorAll('.catalog-printable');
  const totalPages = children.length || 1;

  const prevWidth = element.style.width;
  const prevPadding = element.style.padding;
  const prevBackground = element.style.background;
  const prevOverflow = element.style.overflow;

  element.style.width = `${A4_PX_WIDTH}px`;
  element.style.padding = '0';
  element.style.background = '#ffffff';
  element.style.overflow = 'visible';

  const savedStyles = [];
  children.forEach((child) => {
    savedStyles.push({
      element: child,
      margin: child.style.margin,
      borderRadius: child.style.borderRadius,
      boxShadow: child.style.boxShadow,
      border: child.style.border,
      height: child.style.height
    });
    
    child.style.margin = '0';
    child.style.borderRadius = '0';
    child.style.boxShadow = 'none';
    child.style.border = 'none';
    child.style.height = `${A4_PX_HEIGHT}px`;
  });

  const actualHeight = A4_PX_HEIGHT * totalPages;

  // Let browser fonts load and paint fully before canvas capture
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 150));

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    allowTaint: true,
    logging: false,
    width: A4_PX_WIDTH,
    height: actualHeight,
    windowWidth: A4_PX_WIDTH,
    windowHeight: actualHeight,
  });

  // Re-hide the element after capturing
  element.classList.add('hidden');

  element.style.width = prevWidth;
  element.style.padding = prevPadding;
  element.style.background = prevBackground;
  element.style.overflow = prevOverflow;

  savedStyles.forEach((s) => {
    s.element.style.margin = s.margin;
    s.element.style.borderRadius = s.borderRadius;
    s.element.style.boxShadow = s.boxShadow;
    s.element.style.border = s.border;
    s.element.style.height = s.height;
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PAGE_W = 210;
  const PAGE_H = 297;

  const totalCanvasHeight = canvas.height;
  const a4CanvasHeight = Math.round((PAGE_H / PAGE_W) * canvas.width);

  let yOffset = 0;
  let firstPage = true;

  while (yOffset < totalCanvasHeight) {
    if (!firstPage) pdf.addPage();
    firstPage = false;

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

  pdf.save(`GA-Catalog-${title}.pdf`);
};

export { exportInvoicePDF, exportCatalogPDF };
