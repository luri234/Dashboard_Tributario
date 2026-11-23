import { useMemo, useState } from 'react'
import { Alert, Grid } from '@mui/material'
import { MonthlyLineChart } from '../components/charts/MonthlyLineChart'
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart'
import { RecordsDetail } from '../components/detail/RecordsDetail'
import { FilterBar } from '../components/filters/FilterBar'
import { KpiCard } from '../components/kpis/KpiCard'
import { DashboardHeader } from '../components/layout/DashboardHeader'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { filterOptions, mockRecords, months } from '../mocks/dashboard'
import type { BarItem, Filters, MockRecord } from '../types/dashboard'
import { formatMillions } from '../utils/format'

const initialFilters: Filters = { provincia: null, tipo: null, mes: null }

function bars(rows: MockRecord[], field: 'impuesto' | 'provincia' | 'tipo', selected?: string | null): BarItem[] {
  const totals = new Map<string, number>()
  rows.forEach((row) => totals.set(row[field], (totals.get(row[field]) ?? 0) + row.valor))
  return [...totals].map(([label, valor]) => ({ label, valor, selected: selected === label }))
    .sort((a, b) => b.valor - a.valor)
}

export function DashboardPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const view = useMemo(() => {
    const byArea = mockRecords.filter((r) =>
      (filters.provincia === null || r.provincia === filters.provincia)
      && (filters.tipo === null || r.tipo === filters.tipo))
    const selected = byArea.filter((r) => filters.mes === null || r.mes === filters.mes)
    const total = selected.reduce((sum, row) => sum + row.valor, 0)
    const iva = selected.filter((r) => r.impuesto === 'IVA MENSUAL')
      .reduce((sum, row) => sum + row.valor, 0)
    const tendencia = months.map((label, index) => ({
      mes: index + 1, label,
      valor: byArea.filter((row) => row.mes === index + 1).reduce((sum, row) => sum + row.valor, 0),
    }))
    const mayor = tendencia.reduce((top, month) => month.valor > top.valor ? month : top)
    const detail = [...selected].sort((a, b) => b.valor - a.valor).slice(0, 6)
      .map((r) => ({ ...r, porcentaje: total === 0 ? null : r.valor / total * 100 }))

    return {
      total, iva, mayor, tendencia, detail, count: selected.length,
      impuestos: bars(selected, 'impuesto'),
      provincias: bars(mockRecords.filter((r) =>
        (filters.tipo === null || r.tipo === filters.tipo)
        && (filters.mes === null || r.mes === filters.mes)), 'provincia', filters.provincia),
      tipos: bars(mockRecords.filter((r) =>
        (filters.provincia === null || r.provincia === filters.provincia)
        && (filters.mes === null || r.mes === filters.mes)), 'tipo', filters.tipo),
    }
  }, [filters])

  return (
    <DashboardLayout
      header={<DashboardHeader />}
      filters={<FilterBar filters={filters} options={filterOptions} onChange={setFilters} />}
      kpis={<>
        {view.count === 0 && <Grid size={12}><Alert severity="info">Sin datos para esta selección</Alert></Grid>}
        <Grid size={{ xs: 12, md: 4 }}><KpiCard label="Recaudación total" value={view.total}
          format="usdMillions" note="Cifras de ejemplo" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><KpiCard label="Participación del IVA"
          value={view.total === 0 ? null : view.iva / view.total * 100} format="percent"
          note={`${formatMillions(view.iva)} de ejemplo`} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><KpiCard label="Mes de mayor recaudación"
          value={view.mayor.label} format="text" note={formatMillions(view.mayor.valor)} /></Grid>
      </>}
      charts={<>
        <Grid size={{ xs: 12, md: 7 }}><MonthlyLineChart points={view.tendencia} selectedMonth={filters.mes} /></Grid>
        <Grid size={{ xs: 12, md: 5 }}><HorizontalBarChart title="Participación por impuesto" items={view.impuestos} /></Grid>
        <Grid size={{ xs: 12, md: 6 }}><HorizontalBarChart title="Recaudación por provincia" items={view.provincias} /></Grid>
        <Grid size={{ xs: 12, md: 6 }}><HorizontalBarChart title="Personas naturales vs. sociedades"
          items={view.tipos} color="secondary" /></Grid>
      </>}
      detail={<RecordsDetail rows={view.detail} total={view.count} />}
    />
  )
}
