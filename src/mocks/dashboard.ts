import type { FilterOptions, MockRecord } from '../types/dashboard'

export const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export const filterOptions: FilterOptions = {
  provincias: ['PICHINCHA', 'GUAYAS', 'AZUAY'].map((value) => ({ value, label: value })),
  tipos: ['SOCIEDADES', 'PERSONAS NATURALES', 'NO TIENE'].map((value) => ({ value, label: value })),
  meses: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    .map((label, index) => ({ label, value: index + 1 })),
}

const monthlyScale = [0.84, 0.91, 0.89, 1.12, 0.95, 0.98, 1.07, 1.02, 0.96, 1.14, 1.01, 1.18]
const provinceScale = [1, 0.87, 0.46]
const provinceMonthlyScale: Record<string, number[]> = {
  PICHINCHA: [0.94, 1.04, 0.97, 1.18, 1.02, 0.92, 1.08, 0.96, 1.05, 1.01, 1.09, 1.06],
  GUAYAS: [1.13, 0.89, 1.08, 0.92, 1.01, 1.17, 0.93, 1.11, 0.95, 1.07, 1.19, 0.97],
  AZUAY: [0.90, 1.14, 1.03, 0.96, 1.20, 0.98, 1.16, 0.91, 1.08, 0.94, 1.04, 1.18],
}
const typeScale = [1, 0.62, 0.12]
const taxes = [
  { name: 'IVA MENSUAL', base: 38_000_000 },
  { name: 'IMPUESTO A LA RENTA', base: 26_000_000 },
  { name: 'IMPUESTO A LOS CONSUMOS ESPECIALES', base: 9_000_000 },
]

// Cifras deliberadamente ficticias: sirven para demostrar componentes e interacción.
export const mockRecords: MockRecord[] = monthlyScale.flatMap((month, monthIndex) =>
  filterOptions.provincias.flatMap((province, provinceIndex) =>
    filterOptions.tipos.flatMap((type, typeIndex) =>
      taxes.map((tax) => ({
        mes: monthIndex + 1,
        impuesto: tax.name,
        provincia: province.value,
        tipo: type.value,
        valor: Math.round(tax.base * month * provinceScale[provinceIndex]
          * provinceMonthlyScale[province.value][monthIndex] * typeScale[typeIndex]),
      })),
    ),
  ),
)
