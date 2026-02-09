import { jsPDF } from 'jspdf'
import { toWords } from 'number-to-words'
import type { TravelTrip } from '../data/travel'


export function downloadTripReceiptPdf(trip: TravelTrip) {
  const doc = new jsPDF('p', 'mm', 'a4')

  const invoiceNo = trip.tripCode.replace(/[^\w-]/g, '_')
  const totalFare = trip.distanceKm * trip.ratePerKm
  const advance = trip.advancePayment || 0
  const balance = totalFare - advance

  /* ================= COMPANY HEADER ================= */
  doc.setTextColor(0, 70, 140) // Blue
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('SHREE TOUR & TRAVELS', 14, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('A/C & Non A/C Luxury Cars Available All Over India', 14, 26)
  doc.text('Sukhliya, Indore (M.P.)', 14, 31)
  doc.text('Mobile: 8319272123', 14, 36)

  doc.setTextColor(0, 0, 0) // Reset to black

  /* ================= INVOICE META ================= */
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('INVOICE', 160, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Invoice No: ${invoiceNo}`, 140, 28)
  doc.text(`Date: ${formatDate(new Date())}`, 140, 34)

  doc.line(14, 40, 196, 40)

  /* ================= CUSTOMER DETAILS ================= */
  doc.setFont('helvetica', 'bold')
  doc.text('Bill To:', 14, 48)

  doc.setFont('helvetica', 'normal')
  doc.text(trip.customerName, 14, 54)
  doc.text(`Car Type: ${trip.carType}`, 14, 60)
  doc.text(`Driver Name: ${trip.driverName}`, 14, 66)

  /* ================= TABLE ================= */
  const tableTop = 76
  const tableLeft = 14
  const tableWidth = 182
  const headerHeight = 10
  const rowHeight = 25

  const colDesc = tableLeft
  const colKm = 110
  const colRate = 130
  const colAmount = 165

  // Header box
  doc.setFont('helvetica', 'bold')
  doc.rect(tableLeft, tableTop, tableWidth, headerHeight)

  doc.text('Description', colDesc + 2, tableTop + 7)
  doc.text('KM', colKm + 2, tableTop + 7)
  doc.text('Rate/KM', colRate + 2, tableTop + 7)
  doc.text('Amount', colAmount + 2, tableTop + 7)

  // Header vertical lines
  doc.line(colKm, tableTop, colKm, tableTop + headerHeight)
  doc.line(colRate, tableTop, colRate, tableTop + headerHeight)
  doc.line(colAmount, tableTop, colAmount, tableTop + headerHeight)

  // Data row
  doc.setFont('helvetica', 'normal')
  doc.rect(tableLeft, tableTop + headerHeight, tableWidth, rowHeight)

  doc.line(colKm, tableTop + headerHeight, colKm, tableTop + headerHeight + rowHeight)
  doc.line(colRate, tableTop + headerHeight, colRate, tableTop + headerHeight + rowHeight)
  doc.line(colAmount, tableTop + headerHeight, colAmount, tableTop + headerHeight + rowHeight)

  doc.text(
    `Car Rental - ${trip.carType}\n${formatDate(trip.startedAt)} to ${formatDate(trip.endedAt)}`,
    colDesc + 2,
    tableTop + headerHeight + 8
  )

  doc.text(trip.distanceKm.toFixed(1), colKm + 4, tableTop + headerHeight + 8)
  doc.text(formatAmount(trip.ratePerKm), colRate + 4, tableTop + headerHeight + 8)
  doc.text(formatAmount(totalFare), colAmount + 4, tableTop + headerHeight + 8)

  /* ================= SUMMARY ================= */
 /* ================= SUMMARY ================= */
const summaryTop = tableTop + 45
const summaryLeft = 120
const summaryWidth = 76
const summaryHeight = 30
const summaryMid = summaryLeft + 45
const summaryRight = summaryLeft + summaryWidth - 4

doc.setFont('helvetica', 'bold')
doc.text('Summary', summaryLeft, summaryTop)

// Outer box
doc.rect(summaryLeft, summaryTop + 4, summaryWidth, summaryHeight)

// Vertical divider
doc.line(
  summaryMid,
  summaryTop + 4,
  summaryMid,
  summaryTop + 4 + summaryHeight
)

doc.setFont('helvetica', 'normal')

// Labels (left column)
doc.text('Total Amount:', summaryLeft + 4, summaryTop + 12)
doc.text('Advance Paid:', summaryLeft + 4, summaryTop + 20)
doc.text('Balance Due:', summaryLeft + 4, summaryTop + 28)

// Values (RIGHT-ALIGNED)
doc.text(formatAmount(totalFare), summaryRight, summaryTop + 12, { align: 'right' })
doc.text(formatAmount(advance), summaryRight, summaryTop + 20, { align: 'right' })
doc.text(formatAmount(balance), summaryRight, summaryTop + 28, { align: 'right' })


  /* ================= AMOUNT IN WORDS ================= */
  doc.setFont('helvetica', 'bold')
  doc.text('Amount in Words:', 14, summaryTop + 18)

  doc.setFont('helvetica', 'normal')
  doc.text(`${amountInWords(balance)}`, 14, summaryTop + 24)

  /* ================= SIGNATURE ================= */
  doc.line(14, 260, 70, 260)
  doc.text('Customer Signature', 14, 266)

  doc.line(140, 260, 196, 260)
  doc.text('Authorized Signatory', 140, 266)

  doc.save(`invoice-${invoiceNo}.pdf`)
}

/* ================= HELPERS ================= */

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-GB')
}

function formatAmount(amount: number) {
  return `${amount.toFixed(2)} /-`
}


function amountInWords(amount: number) {
  return `${toWords(amount).toUpperCase()} ONLY`
}
