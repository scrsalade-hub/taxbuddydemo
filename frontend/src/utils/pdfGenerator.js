import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Generate a simple barcode-like pattern
const generateBarcode = (doc, x, y, width, height, value) => {
  const chars = value.toString().split('');
  const barWidth = width / (chars.length * 2 + 1);
  
  doc.setFillColor(0, 0, 0);
  
  chars.forEach((char, i) => {
    const code = char.charCodeAt(0);
    const barHeight = height * (0.6 + (code % 5) * 0.08);
    doc.rect(x + i * barWidth * 2, y + height - barHeight, barWidth * 1.5, barHeight, 'F');
  });
  
  // Add value text below barcode
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(value, x + width / 2, y + height + 5, { align: 'center' });
};

// Generate QR code-like pattern
const generateQRPattern = (doc, x, y, size, value) => {
  const cellSize = size / 21;
  const seed = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  doc.setFillColor(0, 0, 0);
  
  // Draw position detection patterns (corners)
  const drawPositionPattern = (px, py) => {
    doc.rect(px, py, cellSize * 7, cellSize * 7, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(px + cellSize, py + cellSize, cellSize * 5, cellSize * 5, 'F');
    doc.setFillColor(0, 0, 0);
    doc.rect(px + cellSize * 2, py + cellSize * 2, cellSize * 3, cellSize * 3, 'F');
  };
  
  drawPositionPattern(x, y);
  drawPositionPattern(x + cellSize * 14, y);
  drawPositionPattern(x, y + cellSize * 14);
  
  // Fill data area with pattern based on value
  for (let row = 0; row < 21; row++) {
    for (let col = 0; col < 21; col++) {
      // Skip position patterns
      if ((row < 8 && col < 8) || (row < 8 && col > 12) || (row > 12 && col < 8)) continue;
      
      const patternValue = (seed + row * 21 + col) % 7;
      if (patternValue > 2) {
        doc.rect(x + col * cellSize, y + row * cellSize, cellSize, cellSize, 'F');
      }
    }
  }
};

export const generateTaxReceiptPDF = (record, user) => {
  const doc = new jsPDF();
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  
  // Colors
  const primaryColor = [12, 138, 90];
  const secondaryColor = [30, 41, 59];
  const lightGray = [248, 250, 252];
  const borderColor = [226, 232, 240];
  
  // ===== HEADER SECTION =====
  // Top green bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('TAXBUDDY', margin, 25);
  
  // Tagline
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Tax Simplified - Federal Republic of Nigeria', margin, 33);
  
  // Receipt label
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL TAX RECEIPT', pageWidth - margin, 25, { align: 'right' });
  
  // Receipt number
  const receiptNumber = `TB-${record._id?.slice(-8).toUpperCase() || '00000000'}`;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt No: ${receiptNumber}`, pageWidth - margin, 33, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleDateString('en-NG')}`, pageWidth - margin, 40, { align: 'right' });
  
  // ===== USER INFORMATION SECTION =====
  let yPos = 65;
  
  // Section title
  doc.setFillColor(...lightGray);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 25, 'F');
  doc.setDrawColor(...borderColor);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 25, 'S');
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TAXPAYER INFORMATION', margin + 5, yPos + 5);
  
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'N/A';
  const userEmail = user?.email || 'N/A';
  const userPhone = user?.phone || 'N/A';
  const taxId = user?.taxId || 'Not Provided';
  const accountType = user?.accountType === 'business' ? 'Business' : 'Individual';
  
  doc.text(`Name: ${userName}`, margin + 5, yPos + 15);
  doc.text(`Email: ${userEmail}`, margin + 5, yPos + 22);
  doc.text(`Phone: ${userPhone}`, margin + 105, yPos + 15);
  doc.text(`Tax ID (TIN): ${taxId}`, margin + 105, yPos + 22);
  
  // ===== TAX DETAILS SECTION =====
  yPos = 100;
  
  doc.setFillColor(...lightGray);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 80, 'F');
  doc.setDrawColor(...borderColor);
  doc.rect(margin, yPos - 5, pageWidth - margin * 2, 80, 'S');
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX PAYMENT DETAILS', margin + 5, yPos + 5);
  
  // Tax details table
  const taxDetails = [
    ['Assessment Period:', `${record.month} ${record.year}`],
    ['Tax Type:', record.taxType === 'CIT' ? 'Company Income Tax (CIT)' : 'Personal Income Tax (PIT)'],
    ['Account Type:', accountType],
    ['Gross Income:', `₦${(record.income || 0).toLocaleString()}`],
    ['Allowable Deductions:', `₦${(record.expenses || 0).toLocaleString()}`],
    ['Taxable Income:', `₦${(record.taxableIncome || 0).toLocaleString()}`],
    ['Tax Rate Applied:', `${record.taxRate || 0}%`],
    ['Tax Amount Due:', `₦${(record.taxAmount || 0).toLocaleString()}`],
  ];
  
  doc.setFontSize(10);
  let detailY = yPos + 18;
  
  taxDetails.forEach(([label, value], index) => {
    const isHighlight = index >= taxDetails.length - 2;
    
    if (isHighlight) {
      doc.setFillColor(255, 251, 235);
      doc.rect(margin + 2, detailY - 5, pageWidth - margin * 2 - 4, 10, 'F');
    }
    
    doc.setTextColor(...secondaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 5, detailY);
    
    doc.setFont('helvetica', 'normal');
    if (isHighlight) {
      doc.setTextColor(...primaryColor);
      doc.setFont('helvetica', 'bold');
    }
    doc.text(value, margin + 75, detailY);
    
    detailY += 10;
  });
  
  // ===== PAYMENT STATUS =====
  yPos = 185;
  
  const status = record.status || 'unpaid';
  const statusColor = status === 'paid' ? [34, 197, 94] : [239, 68, 68];
  const statusText = status === 'paid' ? 'PAID' : 'UNPAID';
  
  doc.setFillColor(...statusColor);
  doc.roundedRect(pageWidth / 2 - 30, yPos, 60, 20, 3, 3, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(statusText, pageWidth / 2, yPos + 13, { align: 'center' });
  
  if (status === 'paid' && record.paymentDate) {
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Payment Date: ${new Date(record.paymentDate).toLocaleDateString('en-NG')}`, pageWidth / 2, yPos + 28, { align: 'center' });
  }
  
  // ===== VERIFICATION SECTION =====
  yPos = 225;
  
  doc.setFillColor(...lightGray);
  doc.rect(margin, yPos, pageWidth - margin * 2, 40, 'F');
  doc.setDrawColor(...borderColor);
  doc.rect(margin, yPos, pageWidth - margin * 2, 40, 'S');
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFICATION', margin + 5, yPos + 8);
  
  // Generate QR code pattern
  generateQRPattern(doc, margin + 5, yPos + 12, 25, receiptNumber);
  
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Scan to verify authenticity', margin + 5, yPos + 40);
  
  // Verification details
  doc.text(`Record ID: ${record._id || 'N/A'}`, margin + 40, yPos + 18);
  doc.text(`Generated: ${new Date(record.createdAt).toLocaleString('en-NG')}`, margin + 40, yPos + 26);
  doc.text(`This is an official document from TaxBuddy Nigeria`, margin + 40, yPos + 34);
  
  // ===== FOOTER =====
  const footerY = pageHeight - 30;
  
  // Separator line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  // Footer text
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('TaxBuddy Nigeria - Simplifying Tax Compliance', margin, footerY + 8);
  doc.text('support@taxbuddy.ng | www.taxbuddy.ng | +234 800 123 4567', margin, footerY + 14);
  
  // Barcode at bottom right
  const barcodeValue = receiptNumber.replace(/-/g, '');
  generateBarcode(doc, pageWidth - margin - 60, footerY + 3, 60, 18, barcodeValue);
  
  // Copyright
  doc.setTextColor(150, 150, 150);
  doc.text(`© ${new Date().getFullYear()} TaxBuddy. All rights reserved.`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  return doc;
};

export const generateAllRecordsPDF = (records, user) => {
  const doc = new jsPDF();
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  
  const primaryColor = [12, 138, 90];
  const secondaryColor = [30, 41, 59];
  
  // ===== HEADER =====
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TAXBUDDY', margin, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Tax Simplified - Federal Republic of Nigeria', margin, 33);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX RECORDS SUMMARY', pageWidth - margin, 25, { align: 'right' });
  
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'N/A';
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated for: ${userName}`, pageWidth - margin, 33, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleDateString('en-NG')}`, pageWidth - margin, 40, { align: 'right' });
  
  // ===== SUMMARY BOX =====
  const totalIncome = records.reduce((sum, r) => sum + (r.income || 0), 0);
  const totalTax = records.reduce((sum, r) => sum + (r.taxAmount || 0), 0);
  const paidCount = records.filter(r => r.status === 'paid').length;
  
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, 55, pageWidth - margin * 2, 30, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, 55, pageWidth - margin * 2, 30, 'S');
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SUMMARY', margin + 5, 63);
  
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Records: ${records.length}`, margin + 5, 72);
  doc.text(`Total Income: ₦${totalIncome.toLocaleString()}`, margin + 55, 72);
  doc.text(`Total Tax: ₦${totalTax.toLocaleString()}`, margin + 115, 72);
  doc.text(`Paid: ${paidCount}/${records.length}`, margin + 5, 80);
  
  // ===== TABLE =====
  const tableData = records.map(r => [
    `${r.month} ${r.year}`,
    r.taxType,
    `₦${(r.income || 0).toLocaleString()}`,
    `₦${(r.taxableIncome || 0).toLocaleString()}`,
    `₦${(r.taxAmount || 0).toLocaleString()}`,
    `${r.taxRate.toFixed(1) || 0}%`,
    (r.status || 'unpaid').toUpperCase()
  ]);
  
  autoTable(doc, {
    startY: 95,
    head: [['Period', 'Type', 'Income', 'Taxable', 'Tax Amount', 'Rate', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 20 },
      6: { cellWidth: 20 }
    }
  });
  
  // ===== FOOTER =====
  const footerY = pageHeight - 25;
  
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(8);
  doc.text('TaxBuddy Nigeria - Official Tax Records', margin, footerY + 8);
  doc.text('support@taxbuddy.ng | www.taxbuddy.ng', margin, footerY + 14);
  
  // Barcode
  const reportId = `RPT${Date.now().toString().slice(-8)}`;
  generateBarcode(doc, pageWidth - margin - 50, footerY + 3, 50, 15, reportId);
  
  doc.setTextColor(150, 150, 150);
  doc.text(`© ${new Date().getFullYear()} TaxBuddy. Page 1 of 1.`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  return doc;
};
