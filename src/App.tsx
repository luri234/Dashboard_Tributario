import { useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { DashboardHeader } from './components/layout/DashboardHeader'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { FilterBar } from './components/filters/FilterBar'
import { KpiCard } from './components/kpis/KpiCard'
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
      charts={<Typography color="text.secondary">Gráficos en construcción</Typography>}
      detail={<Typography color="text.secondary">Detalle en construcción</Typography>}
    />
  )
}
