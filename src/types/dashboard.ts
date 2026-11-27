export interface Option<T> {
  value: T
  label: string
}

export interface Filters {
  provincia: string | null
  tipo: string | null
  mes: number | null
}

export interface FilterOptions {
  provincias: Option<string>[]
  tipos: Option<string>[]
  meses: Option<number>[]
}

export type KpiFormat = 'usdMillions' | 'percent' | 'text'

export interface MonthlyPoint {
  mes: number
  label: string
  valor: number
}

export interface BarItem {
  label: string
  valor: number
  selected?: boolean
}

export interface DetailRow {
  mes: number
  mesNombre?: string
  impuesto: string
  provincia: string
  tipo: string
  valor: number
  porcentaje: number | null
}

export interface MockRecord {
  mes: number
  impuesto: string
  provincia: string
  tipo: string
  valor: number
}

// Filas preagregadas importadas desde Firebase Realtime Database.
export interface TaxRecord {
  ANIO: number
  MES: number
  MES_NOMBRE: string
  GRUPO_IMPUESTO: string
  IMPUESTO: string
  PROVINCIA: string
  TIPO_CONTRIBUYENTE: string
  VALOR_RECAUDADO: number
}

export interface DashboardStats {
  total: number
  iva: number
  porcentajeIva: number | null
  mesMayor: MonthlyPoint | null
  tendencia: MonthlyPoint[]
  impuestos: BarItem[]
  provincias: BarItem[]
  tipos: BarItem[]
  detalle: DetailRow[]
  totalCombinaciones: number
}
