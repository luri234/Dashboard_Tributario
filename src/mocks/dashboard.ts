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
        valor: Math.round(tax.base * month * provinceScale[provinceIndex] * typeScale[typeIndex]),
      })),
    ),
  ),
)
