const amount = new Intl.NumberFormat('es-EC', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export function formatMillions(usd: number): string {
  return `$${amount.format(usd / 1_000_000)} M`
}

export function formatPercent(value: number | null): string {
  return value === null ? '—' : `${amount.format(value)}%`
}
