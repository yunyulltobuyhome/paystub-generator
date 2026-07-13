const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Returns the most recent `count` months (oldest first), ending with the current month.
export function getRecentMonths(count) {
  const now = new Date()
  const months = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push({ key, label: `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}` })
  }
  return months
}

export function formatDateRange(months) {
  if (months.length === 0) return ''
  if (months.length === 1) return months[0].label
  return `${months[0].label} – ${months[months.length - 1].label}`
}
