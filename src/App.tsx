import { useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { MonthlyLineChart } from './components/charts/MonthlyLineChart'
import { HorizontalBarChart } from './components/charts/HorizontalBarChart'
import { FilterBar } from './components/filters/FilterBar'
import { KpiCard } from './components/kpis/KpiCard'
import { DashboardHeader } from './components/layout/DashboardHeader'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { filterOptions, mockRecords, months } from './mocks/dashboard'
import type { Filters } from './types/dashboard'

export default function App() {
  const [filters, setFilters] = useState<Filters>({ provincia: null, tipo: null, mes: null })
  const rows = mockRecords.filter((row) =>
    (filters.provincia === null || row.provincia === filters.provincia)
    && (filters.tipo === null || row.tipo === filters.tipo)
    && (filters.mes === null || row.mes === filters.mes))
  const total = rows.reduce((sum, row) => sum + row.valor, 0)
  const iva = rows.filter((row) => row.impuesto === 'IVA MENSUAL').reduce((sum, row) => sum + row.valor, 0)
  const byArea = mockRecords.filter((row) =>
    (filters.provincia === null || row.provincia === filters.provincia)
    && (filters.tipo === null || row.tipo === filters.tipo))
  const points = months.map((label, i) => ({
    mes: i + 1, label,
    valor: byArea.filter((row) => row.mes === i + 1).reduce((sum, row) => sum + row.valor, 0),
  }))
  const taxes = [...new Set(rows.map((row) => row.impuesto))].map((label) => ({
    label, valor: rows.filter((row) => row.impuesto === label).reduce((sum, row) => sum + row.valor, 0),
  }))

  return (
    <DashboardLayout
      header={<DashboardHeader />}
      filters={<FilterBar filters={filters} options={filterOptions} onChange={setFilters} />}
      kpis={<>
        <Grid size={{ xs: 12, md: 4 }}><KpiCard label="Recaudación total"
          value={total} format="usdMillions" note="Cifras de ejemplo" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><KpiCard label="Participación del IVA"
          value={total === 0 ? null : iva / total * 100} format="percent" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><KpiCard label="Mes elegido"
          value={filters.mes === null ? 'Todo el año' : months[filters.mes - 1]}
          format="text" /></Grid>
      </>}
      charts={<>
        <Grid size={{ xs: 12, md: 7 }}><MonthlyLineChart points={points} selectedMonth={filters.mes} /></Grid>
        <Grid size={{ xs: 12, md: 5 }}><HorizontalBarChart title="Participación por impuesto" items={taxes} /></Grid>
      </>}
      detail={<Typography color="text.secondary">Detalle en construcción</Typography>}
    />
  )
}
