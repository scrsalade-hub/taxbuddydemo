import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// TaxBuddy brand colors
const TB_PRIMARY = [12, 138, 90];      // #0C8A5A - main green
const TB_PRIMARY_DARK = [8, 100, 65];   // darker green
const TB_LIGHT = [232, 245, 240];       // light green bg
const TB_ACCENT = [20, 184, 116];       // bright green accent
const WHITE = [255, 255, 255];
const DARK_TEXT = [30, 41, 59];
const GRAY_TEXT = [100, 116, 139];
const LIGHT_GRAY = [248, 250, 252];
const BORDER_COLOR = [226, 232, 240];

export const generateTaxReceiptPDF = (record, user) => {
  const doc = new jsPDF();
  const pageW = 210;
  const margin = 20;

  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'N/A';
  const userEmail = user?.email || 'N/A';
  const userPhone = user?.phone || 'N/A';
  const userAddress = user?.address || 'N/A';
  const receiptNo = `TB-${record._id?.slice(-8).toUpperCase() || '00000000'}`;
  const status = record.status || 'unpaid';

  // ===== HEADER =====
  doc.setFillColor(...TB_PRIMARY);
  doc.rect(0, 0, pageW, 52, 'F');

  // Logo area (left)
  doc.setTextColor(...WHITE);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('TaxBuddy', margin, 28);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('TAX SIMPLIFIED  |  FEDERAL REPUBLIC OF NIGERIA', margin, 38);

  // RECEIPT title (right)
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT', pageW - margin, 28, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt No: #${receiptNo}`, pageW - margin, 38, { align: 'right' });
  doc.text(`Date Issued: ${new Date().toLocaleDateString('en-NG')}`, pageW - margin, 44, { align: 'right' });

  // ===== BILL TO & AMOUNT SECTION =====
  let y = 68;

  // Left - Bill To
  doc.setTextColor(...GRAY_TEXT);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('BILL TO', margin, y);

  doc.setTextColor(...DARK_TEXT);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(userName, margin, y + 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY_TEXT);
  doc.text(`Phone: ${userPhone}`, margin, y + 18);
  doc.text(`Email: ${userEmail}`, margin, y + 24);
  doc.text(`Address: ${userAddress}`, margin, y + 30);

  // Right - Amount
  doc.setTextColor(...GRAY_TEXT);
  doc.setFontSize(9);
  doc.text('TAX AMOUNT DUE', pageW - margin, y, { align: 'right' });

  doc.setTextColor(...TB_PRIMARY);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(`N${(record.taxAmount || 0).toLocaleString()}`, pageW - margin, y + 14, { align: 'right' });

  doc.setTextColor(...DARK_TEXT);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.month} ${record.year}`, pageW - margin, y + 24, { align: 'right' });

  // Green line separator
  y = 110;
  doc.setDrawColor(...TB_PRIMARY);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageW - margin, y);

  // ===== TABLE =====
  y = 120;

  autoTable(doc, {
    startY: y,
    head: [['Description', 'Details']],
    body: [
      ['Assessment Period', `${record.month} ${record.year}`],
      ['Tax Type', record.taxType === 'CIT' ? 'Company Income Tax (CIT)' : 'Personal Income Tax (PIT)'],
      ['Account Type', user?.accountType === 'business' ? 'Business Account' : 'Individual Account'],
      ['Taxpayer Name', userName],
      ['Gross Income', `N${(record.income || 0).toLocaleString()}`],
      ['Allowable Deductions', `N${(record.expenses || 0).toLocaleString()}`],
      ['Taxable Income', `N${(record.taxableIncome || 0).toLocaleString()}`],
      ['Tax Rate Applied', `${record.taxRate || 0}%`],
      ['Tax Amount Due', `N${(record.taxAmount || 0).toLocaleString()}`],
    ],
    theme: 'plain',
    headStyles: {
      fillColor: TB_PRIMARY,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 11,
    },
    bodyStyles: {
      fontSize: 10,
      textColor: DARK_TEXT,
    },
    alternateRowStyles: {
      fillColor: LIGHT_GRAY,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 90 },
      1: { halign: 'right' },
    },
    styles: {
      cellPadding: 7,
    },
    margin: { left: margin, right: margin },
  });

  // ===== PAYMENT STATUS & SUMMARY =====
  const tableEndY = doc.lastAutoTable.finalY;
  y = tableEndY + 20;

  // Check if enough space, if not add new page
  if (y > 220) {
    doc.addPage();
    y = 30;
  }

  // Left - Payment Status
  doc.setTextColor(...DARK_TEXT);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Status:', margin, y);

  const statusColor = status === 'paid' ? TB_PRIMARY : [239, 68, 68];
  doc.setFillColor(...statusColor);
  doc.roundedRect(margin, y + 5, 40, 16, 3, 3, 'F');
  doc.setTextColor(...WHITE);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(status.toUpperCase(), margin + 20, y + 16, { align: 'center' });

  if (status === 'paid' && record.paymentDate) {
    doc.setTextColor(...GRAY_TEXT);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Paid on: ${new Date(record.paymentDate).toLocaleDateString('en-NG')}`, margin, y + 32);
  }

  // Right - Summary box
  const summaryX = pageW - margin - 85;
  doc.setFillColor(...TB_LIGHT);
  doc.setDrawColor(...TB_PRIMARY);
  doc.setLineWidth(0.5);
  doc.roundedRect(summaryX, y - 5, 85, 65, 4, 4, 'FD');

  doc.setTextColor(...DARK_TEXT);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal (Taxable Income)', summaryX + 8, y + 10);
  doc.text(`N${(record.taxableIncome || 0).toLocaleString()}`, summaryX + 77, y + 10, { align: 'right' });

  doc.text(`Tax Rate (${record.taxRate || 0}%)`, summaryX + 8, y + 24);
  doc.text(`N${(record.taxAmount || 0).toLocaleString()}`, summaryX + 77, y + 24, { align: 'right' });

  // Divider line
  doc.setDrawColor(...TB_PRIMARY);
  doc.setLineWidth(0.5);
  doc.line(summaryX + 8, y + 32, summaryX + 77, y + 32);

  // Total with green highlight
  doc.setFillColor(...TB_PRIMARY);
  doc.roundedRect(summaryX + 5, y + 38, 75, 20, 3, 3, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('GRAND TOTAL', summaryX + 12, y + 51);
  doc.text(`N${(record.taxAmount || 0).toLocaleString()}`, summaryX + 73, y + 51, { align: 'right' });

  // ===== TERMS & SIGNATURE =====
  y = y + 85;

  // Check if enough space
  if (y > 250) {
    doc.addPage();
    y = 30;
  }

  // Terms
  doc.setTextColor(...DARK_TEXT);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Terms & Conditions', margin, y);

  doc.setTextColor(...GRAY_TEXT);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('This is an official tax receipt issued by TaxBuddy Nigeria.', margin, y + 10);
  doc.text('Please retain this receipt for your tax filing records.', margin, y + 16);
  doc.text('For any inquiries, contact: support@taxbuddy.ng', margin, y + 22);

  // Signature
  doc.setDrawColor(...GRAY_TEXT);
  doc.setLineWidth(0.5);
  doc.line(pageW - margin - 55, y + 35, pageW - margin, y + 35);
  doc.setFontSize(9);
  doc.setTextColor(...GRAY_TEXT);
  doc.text('Authorized Signature', pageW - margin - 27, y + 42, { align: 'center' });

  // ===== FOOTER =====
  const footerY = 280;

  doc.setFillColor(...TB_PRIMARY);
  doc.rect(0, footerY, pageW, 17, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('+234 800 123 4567', margin + 5, footerY + 7);
  doc.text('support@taxbuddy.ng', pageW / 2, footerY + 7, { align: 'center' });
  doc.text('www.taxbuddy.ng', pageW - margin - 5, footerY + 7, { align: 'right' });

  doc.setFontSize(7);
  doc.setTextColor(200, 230, 220);
  doc.text(`Receipt #${receiptNo}  |  ${new Date().getFullYear()} TaxBuddy. All rights reserved.`, pageW / 2, footerY + 14, { align: 'center' });

  return doc;
};

export const generateAllRecordsPDF = (records, user) => {
  const doc = new jsPDF();
  const pageW = 210;
  const margin = 20;

  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'N/A';
  const userEmail = user?.email || 'N/A';
  const totalIncome = records.reduce((sum, r) => sum + (r.income || 0), 0);
  const totalTax = records.reduce((sum, r) => sum + (r.taxAmount || 0), 0);
  const paidCount = records.filter(r => r.status === 'paid').length;

  // ===== HEADER =====
  doc.setFillColor(...TB_PRIMARY);
  doc.rect(0, 0, pageW, 50, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('TaxBuddy', margin, 25);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('TAX SIMPLIFIED  |  NIGERIA', margin, 33);

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX RECORDS SUMMARY', pageW - margin, 25, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-NG')}`, pageW - margin, 33, { align: 'right' });
  doc.text(`For: ${userName}`, pageW - margin, 40, { align: 'right' });

  // ===== GREEN LINE =====
  doc.setDrawColor(...TB_PRIMARY);
  doc.setLineWidth(1.5);
  doc.line(margin, 58, pageW - margin, 58);

  // ===== USER INFO =====
  let y = 68;

  doc.setTextColor(...GRAY_TEXT);
  doc.setFontSize(9);
  doc.text('PREPARED FOR', margin, y);

  doc.setTextColor(...DARK_TEXT);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(userName, margin, y + 10);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY_TEXT);
  doc.text(`Email: ${userEmail}`, margin, y + 18);

  // Summary box (right)
  doc.setFillColor(...TB_LIGHT);
  doc.setDrawColor(...TB_PRIMARY);
  doc.roundedRect(pageW - margin - 110, y - 5, 110, 32, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(...GRAY_TEXT);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Records: ${records.length}`, pageW - margin - 105, y + 6);
  doc.text(`Paid: ${paidCount}  |  Unpaid: ${records.length - paidCount}`, pageW - margin - 105, y + 14);

  doc.setFontSize(12);
  doc.setTextColor(...TB_PRIMARY);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Tax: N${totalTax.toLocaleString()}`, pageW - margin - 5, y + 26, { align: 'right' });

  // ===== TABLE =====
  y = 108;

  const tableData = records.map(r => [
    `${r.month} ${r.year}`,
    r.taxType,
    `N${(r.income || 0).toLocaleString()}`,
    `N${(r.taxableIncome || 0).toLocaleString()}`,
    `N${(r.taxAmount || 0).toLocaleString()}`,
    `${r.taxRate.toFixed(2) || 0}%`,
    (r.status || 'unpaid').toUpperCase()
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Period', 'Type', 'Income', 'Taxable', 'Tax Amount', 'Rate', 'Status']],
    body: tableData,
    theme: 'plain',
    headStyles: {
      fillColor: TB_PRIMARY,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: DARK_TEXT,
    },
    alternateRowStyles: {
      fillColor: LIGHT_GRAY,
    },
    styles: {
      cellPadding: 5,
      overflow: 'linebreak',
    },
    margin: { left: margin, right: margin },
  });

  // ===== FOOTER =====
  const footerY = 280;

  doc.setFillColor(...TB_PRIMARY);
  doc.rect(0, footerY, pageW, 17, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('+234 800 123 4567', margin + 5, footerY + 7);
  doc.text('support@taxbuddy.ng', pageW / 2, footerY + 7, { align: 'center' });
  doc.text('www.taxbuddy.ng', pageW - margin - 5, footerY + 7, { align: 'right' });

  doc.setFontSize(7);
  doc.setTextColor(200, 230, 220);
  doc.text(`${new Date().getFullYear()} TaxBuddy. All rights reserved.`, pageW / 2, footerY + 14, { align: 'center' });

  return doc;
};
