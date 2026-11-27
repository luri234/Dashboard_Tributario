import type { TaxRecord } from '../types/dashboard'

function isTaxRecord(value: unknown): value is TaxRecord {
  if (typeof value !== 'object' || value === null) return false
  const row = value as Record<string, unknown>
  return row.ANIO === 2024
    && typeof row.MES === 'number' && row.MES >= 1 && row.MES <= 12
    && typeof row.MES_NOMBRE === 'string'
    && typeof row.GRUPO_IMPUESTO === 'string'
    && typeof row.IMPUESTO === 'string'
    && typeof row.PROVINCIA === 'string'
    && typeof row.TIPO_CONTRIBUYENTE === 'string'
    && typeof row.VALOR_RECAUDADO === 'number'
    && Number.isFinite(row.VALOR_RECAUDADO)
}

export function parseRecords(value: unknown): TaxRecord[] {
  const values = Array.isArray(value)
    ? value
    : typeof value === 'object' && value !== null
      ? Object.values(value)
      : null
  if (!values || values.length === 0 || !values.every(isTaxRecord)) {
    throw new Error('Los datos no tienen el formato preagregado esperado.')
  }
  return values
}
