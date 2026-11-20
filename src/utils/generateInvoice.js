import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateInvoicePDF({
  orderId,
  customer,
  items,
  pricing,
  date
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header Banner Background (Crimson Brand Color)
  doc.setFillColor(211, 47, 47); // #d32f2f
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('MADHU SRI CRACKERS', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Sivakasi Direct Crackers & Fireworks Wholesale Counter', 14, 25);
  doc.text('8/389/1, Amman Complex, Chenthamaram Road, Veerasigamani, Tenkasi - 627862', 14, 31);
  doc.text('Phone / WhatsApp: +91 9790623441  |  Email: info@madhusricrackers.com', 14, 36);

  // Right Side: INVOICE / ESTIMATE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('FESTIVAL ESTIMATE', pageWidth - 14, 18, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order ID: ${orderId}`, pageWidth - 14, 25, { align: 'right' });
  doc.text(`Date: ${date || new Date().toLocaleDateString('en-IN')}`, pageWidth - 14, 31, { align: 'right' });

  // 2. Customer & Delivery Info Section
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CUSTOMER & DELIVERY DETAILS', 14, 50);

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 53, pageWidth - 28, 28, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Customer Name:', 18, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(customer.name || 'Valued Customer', 50, 60);

  doc.setFont('helvetica', 'bold');
  doc.text('WhatsApp No:', 18, 67);
  doc.setFont('helvetica', 'normal');
  doc.text(customer.phone || '-', 50, 67);

  doc.setFont('helvetica', 'bold');
  doc.text('Delivery Address:', 18, 74);
  doc.setFont('helvetica', 'normal');
  const splitAddress = doc.splitTextToSize(customer.address || 'Direct Transport Hub', pageWidth - 75);
  doc.text(splitAddress, 50, 74);

  // 3. Products Table
  const tableRows = items.map((item, index) => [
    index + 1,
    item.name,
    item.categoryName || 'Cracker',
    `Rs. ${item.price}`,
    item.quantity,
    `Rs. ${item.price * item.quantity}`
  ]);

  doc.autoTable({
    startY: 86,
    head: [['#', 'Item Description', 'Category', 'Unit Rate', 'Qty', 'Amount']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [211, 47, 47],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 70 },
      2: { cellWidth: 35 },
      3: { halign: 'right', cellWidth: 25 },
      4: { halign: 'center', cellWidth: 15 },
      5: { halign: 'right', cellWidth: 25 }
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  const finalY = doc.lastAutoTable.finalY + 6;

  // 4. Totals & Pricing Breakdown
  const summaryX = pageWidth - 80;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryX - 5, finalY, 71, 35, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  doc.text('Retail Value:', summaryX, finalY + 7);
  doc.text(`Rs. ${pricing.originalTotal || pricing.subtotal}`, pageWidth - 16, finalY + 7, { align: 'right' });

  doc.setTextColor(16, 185, 129); // green
  doc.text('Festival Savings:', summaryX, finalY + 14);
  doc.text(`- Rs. ${pricing.savings || 0}`, pageWidth - 16, finalY + 14, { align: 'right' });

  doc.setTextColor(71, 85, 105);
  doc.text('Safe Transport:', summaryX, finalY + 21);
  doc.text(pricing.deliveryCharge === 0 ? 'FREE' : `Rs. ${pricing.deliveryCharge}`, pageWidth - 16, finalY + 21, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(211, 47, 47);
  doc.text('Total Payable:', summaryX, finalY + 29);
  doc.text(`Rs. ${pricing.totalAmount}`, pageWidth - 16, finalY + 29, { align: 'right' });

  // 5. Payment & Order Note
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('PAYMENT DETAILS (UPI / GPAY / PHONPE):', 14, finalY + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('GPay / PhonePe: +91 9790623441', 14, finalY + 14);
  doc.text('Account Name: Madhu Sri Crackers', 14, finalY + 20);
  doc.text('Notice: Confirm order on WhatsApp for parcel dispatch.', 14, finalY + 26);

  // 6. Footer Terms & Conditions
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('100% Legal Green Fireworks certified by Sivakasi manufacturers. Transport delivery to nearest parcel hub.', 14, pageHeight - 15);
  doc.text('Madhu Sri Crackers - Amman Complex, Chenthamaram Road, Veerasigamani, Tenkasi - 627862  |  Mobile: +91 9790623441', 14, pageHeight - 10);

  // Save the PDF
  const filename = `Madhu_Sri_Crackers_Invoice_${orderId}.pdf`;
  doc.save(filename);

  return filename;
}

