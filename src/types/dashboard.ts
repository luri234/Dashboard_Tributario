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
