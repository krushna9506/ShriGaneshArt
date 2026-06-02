import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports the invoice as a pixel-perfect A4 PDF.
 * The invoice element is the .invoice-scroll-wrapper container, containing multiple pages.
 */
const exportInvoicePDF = async (elementId, invoiceNumber) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Invoice element not found');

  const A4_PX_WIDTH = 794; // 210mm at 96dpi
  const A4_PX_HEIGHT = 1123; // 297mm at 96dpi

  const children = Array.from(element.querySelectorAll('.invoice-printable'));
  if (children.length === 0) children.push(element);

  // Save wrapper styles
  const prevWidth = element.style.width;
  const prevPadding = element.style.padding;
  const prevBackground = element.style.background;
  const prevOverflow = element.style.overflow;
  const hadPrintingClass = document.body.classList.contains('printing-invoice');

  // Force consistent capture environment
  document.body.classList.add('printing-invoice');
  element.style.width = `${A4_PX_WIDTH}px`;
  element.style.padding = '0';
  element.style.background = '#ffffff';
  element.style.overflow = 'visible';

  // Ensure each printable child is sized to A4 pixels to avoid cropping / margin issues
  const savedChildStyles = children.map((child) => ({
    el: child,
    margin: child.style.margin,
    borderRadius: child.style.borderRadius,
    boxShadow: child.style.boxShadow,
    border: child.style.border,
    height: child.style.height,
    width: child.style.width,
    overflow: child.style.overflow,
    boxSizing: child.style.boxSizing,
  }));

  children.forEach((child) => {
    child.style.margin = '0';
    child.style.borderRadius = '0';
    child.style.boxShadow = 'none';
    child.style.border = 'none';
    child.style.overflow = 'visible';
    child.style.boxSizing = 'border-box';
    child.style.width = `${A4_PX_WIDTH}px`;
    child.style.minHeight = `${A4_PX_HEIGHT}px`;
    child.style.height = 'auto';
  });

  // Wait for fonts and a short paint time to stabilise layout
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 200));

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PAGE_W = 210;
  const PAGE_H = 297;

  // Use a conservative scale to avoid OOM / mobile capture issues while keeping good readability
  const scale = Math.min(2, window.devicePixelRatio || 1);

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];

    const canvas = await html2canvas(child, {
      scale,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 0,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      windowWidth: child.offsetWidth || A4_PX_WIDTH,
      windowHeight: child.offsetHeight || A4_PX_HEIGHT,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = PAGE_W;
    const imgHeight = (canvas.height * PAGE_W) / canvas.width;

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
  }

  // Restore wrapper and child styles
  element.style.width = prevWidth;
  element.style.padding = prevPadding;
  element.style.background = prevBackground;
  element.style.overflow = prevOverflow;
  if (!hadPrintingClass) {
    document.body.classList.remove('printing-invoice');
  }

  savedChildStyles.forEach((s) => {
    s.el.style.margin = s.margin;
    s.el.style.borderRadius = s.borderRadius;
    s.el.style.boxShadow = s.boxShadow;
    s.el.style.border = s.border;
    s.el.style.height = s.height;
    s.el.style.width = s.width;
    s.el.style.overflow = s.overflow;
    s.el.style.boxSizing = s.boxSizing;
  });

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
  await new Promise((resolve) => setTimeout(resolve, 200));

  const canvas = await html2canvas(element, {
    scale: 4,                      // 4× scaling for crisp 384 DPI high-density text and graphics zoomability
    backgroundColor: '#ffffff',
    useCORS: true,
    allowTaint: true,
    logging: false,
    imageTimeout: 0,
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
    pdf.addImage(sliceData, 'PNG', 0, 0, PAGE_W, sliceHeight, undefined, 'FAST');

    yOffset += a4CanvasHeight;
  }

  pdf.save(`GA-Catalog-${title}.pdf`);
};

export { exportInvoicePDF, exportCatalogPDF };
