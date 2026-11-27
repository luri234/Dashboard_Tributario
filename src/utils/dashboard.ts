import type {
  BarItem,
  DashboardStats,
  DetailRow,
  FilterOptions,
  Filters,
  MonthlyPoint,
  TaxRecord,
} from '../types/dashboard'

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export const MONTH_SHORT = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

export const EMPTY_FILTERS: Filters = { provincia: null, tipo: null, mes: null }

export function getFilterOptions(records: TaxRecord[]): FilterOptions {
  const provincias = [...new Set(records.map((r) => r.PROVINCIA))].sort((a, b) => a.localeCompare(b, 'es'))
  const tipos = [...new Set(records.map((r) => r.TIPO_CONTRIBUYENTE))].sort((a, b) => a.localeCompare(b, 'es'))
  const meses = [...new Set(records.map((r) => r.MES))].sort((a, b) => a - b)
  return {
    provincias: provincias.map((value) => ({ value, label: value })),
    tipos: tipos.map((value) => ({ value, label: value })),
    meses: meses.map((value) => ({ value, label: MONTHS[value - 1] ?? String(value) })),
  }
}

function matches(record: TaxRecord, filters: Filters, ignore?: keyof Filters): boolean {
  return (ignore === 'provincia' || filters.provincia === null || record.PROVINCIA === filters.provincia)
    && (ignore === 'tipo' || filters.tipo === null || record.TIPO_CONTRIBUYENTE === filters.tipo)
    && (ignore === 'mes' || filters.mes === null || record.MES === filters.mes)
}

function isIva(record: TaxRecord): boolean {
  return record.GRUPO_IMPUESTO.toUpperCase().includes('VALOR AGREGADO')
    || /\bIVA\b/i.test(record.IMPUESTO)
}

function sortedBars(totals: Map<string, number>, selected?: string | null): BarItem[] {
  return [...totals].map(([label, valor]) => ({
    label, valor, selected: selected != null && label === selected,
  })).sort((a, b) => b.valor - a.valor || a.label.localeCompare(b.label, 'es'))
}

function add(map: Map<string, number>, key: string, value: number): void {
  map.set(key, (map.get(key) ?? 0) + value)
}

export function calculateDashboard(records: TaxRecord[], filters: Filters): DashboardStats {
  let total = 0
  let iva = 0
  const byMonth = new Map<number, number>()
  const byTax = new Map<string, number>()
  const byProvince = new Map<string, number>()
  const byType = new Map<string, number>()
  const byDetail = new Map<string, DetailRow>()

  // Una sola pasada; cada vista omite únicamente el filtro de su propia dimensión.
  for (const record of records) {
    if (record.ANIO !== 2024) continue
    const full = matches(record, filters)
    const monthly = matches(record, filters, 'mes')
    const province = matches(record, filters, 'provincia')
    const type = matches(record, filters, 'tipo')
    const value = record.VALOR_RECAUDADO

    if (monthly) byMonth.set(record.MES, (byMonth.get(record.MES) ?? 0) + value)
    if (province) add(byProvince, record.PROVINCIA, value)
    if (type) add(byType, record.TIPO_CONTRIBUYENTE, value)
    if (!full) continue

    total += value
    if (isIva(record)) iva += value
    add(byTax, record.IMPUESTO, value)
    const key = JSON.stringify([record.MES, record.IMPUESTO, record.PROVINCIA, record.TIPO_CONTRIBUYENTE])
    const existing = byDetail.get(key)
    if (existing) {
      existing.valor += value
    } else {
      byDetail.set(key, {
        mes: record.MES,
        mesNombre: record.MES_NOMBRE || MONTHS[record.MES - 1] || String(record.MES),
        impuesto: record.IMPUESTO,
        provincia: record.PROVINCIA,
        tipo: record.TIPO_CONTRIBUYENTE,
        valor: value,
        porcentaje: null,
      })
    }
  }

  // Mostrar los doce meses si hay datos para la serie, incluidos los de importe cero.
  const tendencia: MonthlyPoint[] = byMonth.size === 0 ? [] : MONTH_SHORT.map((label, index) => ({
    mes: index + 1,
    label,
    valor: byMonth.get(index + 1) ?? 0,
  }))
  const observedMonths = tendencia.filter((point) => byMonth.has(point.mes))
  const mesMayor = observedMonths.length
    ? observedMonths.reduce((best, point) => point.valor > best.valor ? point : best)
    : null
  const allDetails = [...byDetail.values()].sort((a, b) => b.valor - a.valor)
  return {
    total,
    iva,
    porcentajeIva: total === 0 ? null : iva / total * 100,
    mesMayor,
    tendencia,
    impuestos: sortedBars(byTax),
    provincias: sortedBars(byProvince, filters.provincia),
    tipos: sortedBars(byType, filters.tipo),
    totalCombinaciones: allDetails.length,
    detalle: allDetails.slice(0, 6).map((row) => ({
      ...row, porcentaje: total === 0 ? null : row.valor / total * 100,
    })),
  }
}
