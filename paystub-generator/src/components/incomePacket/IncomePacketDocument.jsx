import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { OCCUPATIONS, BUSINESS_TYPES, EXPENSE_CATEGORIES } from '../../data/incomePacketPresets'
import { formatDateRange } from '../../utils/incomePacketDates'
import { PDF_FOOTER_NOTICE } from '../../config/incomePacket'

const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const NAVY = '#1e3a5f'
const GRAY = '#64748b'
const LIGHT_BORDER = '#cbd5e1'

const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: NAVY,
  },
  docTitle: { fontSize: 12, color: GRAY, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  name: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  subline: { fontSize: 10, color: GRAY },
  h1: { fontSize: 22, fontWeight: 'bold', color: NAVY, marginBottom: 10 },
  h2: { fontSize: 13, fontWeight: 'bold', color: NAVY, marginTop: 18, marginBottom: 8 },
  p: { fontSize: 10, color: '#334155', lineHeight: 1.5, marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  label: { color: GRAY },
  value: { fontWeight: 'bold', color: '#1e293b' },
  summaryBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  bigNumber: { fontSize: 24, fontWeight: 'bold', color: NAVY },
  bigLabel: { fontSize: 9, color: GRAY, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  table: { marginTop: 4 },
  tHeadRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_BORDER,
    paddingVertical: 6,
  },
  tRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 6,
  },
  tRowTotal: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: NAVY,
    paddingVertical: 8,
    marginTop: 2,
  },
  tHeadCell: { fontSize: 9, fontWeight: 'bold', color: GRAY, textTransform: 'uppercase' },
  tCell: { fontSize: 10, color: '#1e293b' },
  colMonth: { width: '50%' },
  colAmount: { width: '50%', textAlign: 'right' },
  colClient: { width: '45%' },
  colPayType: { width: '25%' },
  colSourceAmount: { width: '30%', textAlign: 'right' },
  bullet: { flexDirection: 'row', marginBottom: 4 },
  bulletDot: { width: 10, fontSize: 10, color: NAVY },
  bulletText: { flex: 1, fontSize: 10, color: '#334155' },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 50,
    right: 50,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: LIGHT_BORDER,
  },
  footerText: { fontSize: 7, color: '#94a3b8', lineHeight: 1.4 },
  pageNum: { position: 'absolute', bottom: 24, right: 50, fontSize: 8, color: GRAY },
})

function PageFooter() {
  return (
    <>
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>{PDF_FOOTER_NOTICE}</Text>
      </View>
      <Text style={styles.pageNum} fixed render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </>
  )
}

function DocHeader({ name, dateRange }) {
  return (
    <View style={styles.header}>
      <Text style={styles.docTitle}>Income Verification Packet</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.subline}>{dateRange}</Text>
    </View>
  )
}

export default function IncomePacketDocument({ data }) {
  const { aboutYou, income, expenses } = data
  const occupationLabel = aboutYou.occupation === 'other'
    ? aboutYou.occupationOther
    : (OCCUPATIONS.find(o => o.value === aboutYou.occupation)?.label || aboutYou.occupation)
  const businessTypeLabel = BUSINESS_TYPES.find(b => b.value === aboutYou.businessType)?.label || aboutYou.businessType
  const dateRange = formatDateRange(income.monthly)

  const monthlyTotal = income.monthly.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0)
  const monthlyAverage = income.monthly.length > 0 ? monthlyTotal / income.monthly.length : 0

  const includeExpenses = !expenses.skipped
  const expenseRows = EXPENSE_CATEGORIES
    .map(c => ({ label: c.label, amount: parseFloat(expenses.categories[c.key]) || 0 }))
    .filter(r => r.amount > 0)
  const expensesTotal = expenseRows.reduce((sum, r) => sum + r.amount, 0)
  const netIncome = monthlyTotal - expensesTotal

  const includedDocs = [
    'Income Summary',
    ...(includeExpenses && expensesTotal > 0 ? ['Profit & Loss Statement'] : []),
    'Income Source List',
  ]

  return (
    <Document title={`Income Verification Packet — ${aboutYou.name}`}>
      {/* Page 1: Cover Summary */}
      <Page size="LETTER" style={styles.page}>
        <DocHeader name={aboutYou.name} dateRange={dateRange} />
        <Text style={styles.h1}>Income Verification Packet</Text>
        <Text style={styles.p}>
          This packet organizes self-reported income information for {aboutYou.name}, prepared for
          general reference and income-verification purposes.
        </Text>

        <View style={styles.summaryBox}>
          <Text style={styles.bigLabel}>Average Monthly Income ({income.monthly.length} months)</Text>
          <Text style={styles.bigNumber}>{fmt(monthlyAverage)}</Text>
        </View>

        <View style={styles.row}><Text style={styles.label}>Occupation</Text><Text style={styles.value}>{occupationLabel}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Business Type</Text><Text style={styles.value}>{businessTypeLabel}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Period Covered</Text><Text style={styles.value}>{dateRange}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Total Income (period)</Text><Text style={styles.value}>{fmt(monthlyTotal)}</Text></View>

        <Text style={styles.h2}>Documents Included</Text>
        {includedDocs.map((d, i) => (
          <View key={i} style={styles.bullet}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{d}</Text>
          </View>
        ))}

        <PageFooter />
      </Page>

      {/* Page 2: Income Summary */}
      <Page size="LETTER" style={styles.page}>
        <DocHeader name={aboutYou.name} dateRange={dateRange} />
        <Text style={styles.h1}>Income Summary</Text>
        <Text style={styles.p}>Monthly self-reported gross income for the selected period.</Text>

        <View style={styles.table}>
          <View style={styles.tHeadRow}>
            <Text style={[styles.tHeadCell, styles.colMonth]}>Month</Text>
            <Text style={[styles.tHeadCell, styles.colAmount]}>Amount</Text>
          </View>
          {income.monthly.map((m) => (
            <View key={m.key} style={styles.tRow}>
              <Text style={[styles.tCell, styles.colMonth]}>{m.label}</Text>
              <Text style={[styles.tCell, styles.colAmount]}>{fmt(m.amount)}</Text>
            </View>
          ))}
          <View style={styles.tRowTotal}>
            <Text style={[styles.tCell, styles.colMonth, { fontWeight: 'bold' }]}>Total</Text>
            <Text style={[styles.tCell, styles.colAmount, { fontWeight: 'bold' }]}>{fmt(monthlyTotal)}</Text>
          </View>
        </View>

        <View style={[styles.row, { marginTop: 12 }]}>
          <Text style={styles.label}>Average Monthly Income</Text>
          <Text style={styles.value}>{fmt(monthlyAverage)}</Text>
        </View>

        <PageFooter />
      </Page>

      {/* Page 3: Profit & Loss Statement — only if expenses were entered */}
      {includeExpenses && expensesTotal > 0 && (
        <Page size="LETTER" style={styles.page}>
          <DocHeader name={aboutYou.name} dateRange={dateRange} />
          <Text style={styles.h1}>Profit & Loss Statement</Text>
          <Text style={styles.p}>Self-reported income and business expenses for the selected period.</Text>

          <View style={styles.row}><Text style={styles.label}>Total Income</Text><Text style={styles.value}>{fmt(monthlyTotal)}</Text></View>

          <Text style={styles.h2}>Expenses by Category</Text>
          <View style={styles.table}>
            <View style={styles.tHeadRow}>
              <Text style={[styles.tHeadCell, styles.colMonth]}>Category</Text>
              <Text style={[styles.tHeadCell, styles.colAmount]}>Amount</Text>
            </View>
            {expenseRows.map((r, i) => (
              <View key={i} style={styles.tRow}>
                <Text style={[styles.tCell, styles.colMonth]}>{r.label}</Text>
                <Text style={[styles.tCell, styles.colAmount]}>{fmt(r.amount)}</Text>
              </View>
            ))}
            <View style={styles.tRowTotal}>
              <Text style={[styles.tCell, styles.colMonth, { fontWeight: 'bold' }]}>Total Expenses</Text>
              <Text style={[styles.tCell, styles.colAmount, { fontWeight: 'bold' }]}>{fmt(expensesTotal)}</Text>
            </View>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.bigLabel}>Net Income</Text>
            <Text style={styles.bigNumber}>{fmt(netIncome)}</Text>
          </View>

          <PageFooter />
        </Page>
      )}

      {/* Last page: Income Source List */}
      <Page size="LETTER" style={styles.page}>
        <DocHeader name={aboutYou.name} dateRange={dateRange} />
        <Text style={styles.h1}>Income Source List</Text>
        <Text style={styles.p}>Clients, platforms, or payers this income was received from.</Text>

        {income.sources.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tHeadRow}>
              <Text style={[styles.tHeadCell, styles.colClient]}>Client / Platform</Text>
              <Text style={[styles.tHeadCell, styles.colPayType]}>Payment Type</Text>
              <Text style={[styles.tHeadCell, styles.colSourceAmount]}>Amount</Text>
            </View>
            {income.sources.map((s) => (
              <View key={s.id} style={styles.tRow}>
                <Text style={[styles.tCell, styles.colClient]}>{s.clientName || '—'}</Text>
                <Text style={[styles.tCell, styles.colPayType]}>{s.paymentType}</Text>
                <Text style={[styles.tCell, styles.colSourceAmount]}>{fmt(s.amount)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.p}>No income sources were listed for this packet.</Text>
        )}

        <PageFooter />
      </Page>
    </Document>
  )
}
