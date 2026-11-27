import assert from 'node:assert/strict'
import { test } from 'node:test'
import { calculateDashboard } from '../src/utils/dashboard.ts'

const rows = [
  {
    ANIO: 2024, MES: 1, MES_NOMBRE: 'Enero', GRUPO_IMPUESTO: 'IMPUESTO AL VALOR AGREGADO',
    IMPUESTO: 'IVA MENSUAL', PROVINCIA: 'PICHINCHA', TIPO_CONTRIBUYENTE: 'SOCIEDADES',
    VALOR_RECAUDADO: 1_000_000,
  },
  {
    ANIO: 2024, MES: 2, MES_NOMBRE: 'Febrero', GRUPO_IMPUESTO: 'IMPUESTO AL VALOR AGREGADO',
    IMPUESTO: 'IVA MENSUAL', PROVINCIA: 'PICHINCHA', TIPO_CONTRIBUYENTE: 'SOCIEDADES',
    VALOR_RECAUDADO: 2_000_000,
  },
  {
    ANIO: 2024, MES: 1, MES_NOMBRE: 'Enero', GRUPO_IMPUESTO: 'IMPUESTO A LA RENTA',
    IMPUESTO: 'RENTA', PROVINCIA: 'GUAYAS', TIPO_CONTRIBUYENTE: 'NO TIENE',
    VALOR_RECAUDADO: 500_000,
  },
  {
    ANIO: 2024, MES: 2, MES_NOMBRE: 'Febrero', GRUPO_IMPUESTO: 'IMPUESTO A LA RENTA',
    IMPUESTO: 'RENTA', PROVINCIA: 'GUAYAS', TIPO_CONTRIBUYENTE: 'PERSONAS NATURALES',
    VALOR_RECAUDADO: 0,
  },
]

test('la tendencia compara todos los meses y la barra provincial ignora el filtro de provincia', () => {
  const stats = calculateDashboard(rows, { provincia: 'PICHINCHA', tipo: null, mes: 1 })
  assert.equal(stats.total, 1_000_000)
  assert.equal(stats.porcentajeIva, 100)
  assert.equal(stats.mesMayor?.mes, 2)
  assert.equal(stats.tendencia.length, 12)
  assert.equal(stats.tendencia[1].valor, 2_000_000)
  assert.deepEqual(stats.provincias.map(({ label, valor }) => [label, valor]), [
    ['PICHINCHA', 1_000_000], ['GUAYAS', 500_000],
  ])
  assert.equal(stats.totalCombinaciones, 1)
  assert.equal(stats.detalle[0].porcentaje, 100)
})

test('conserva NO TIENE como tipo y los ceros sin dividir entre cero', () => {
  const tipos = calculateDashboard(rows, { provincia: null, tipo: null, mes: 1 }).tipos
  assert.ok(tipos.some(({ label, valor }) => label === 'NO TIENE' && valor === 500_000))

  const stats = calculateDashboard(rows, {
    provincia: 'GUAYAS', tipo: 'PERSONAS NATURALES', mes: 2,
  })
  assert.equal(stats.total, 0)
  assert.equal(stats.porcentajeIva, null)
  assert.equal(stats.totalCombinaciones, 1)
  assert.equal(stats.detalle[0].porcentaje, null)
})

test('una selección sin coincidencias produce vistas vacías', () => {
  const stats = calculateDashboard(rows, { provincia: 'AZUAY', tipo: null, mes: null })
  assert.equal(stats.totalCombinaciones, 0)
  assert.deepEqual(stats.tendencia, [])
  assert.deepEqual(stats.detalle, [])
})
