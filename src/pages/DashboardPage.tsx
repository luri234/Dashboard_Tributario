import { useMemo, useState } from 'react'
import { Alert, Box, CircularProgress, Container, Grid, Stack } from '@mui/material'
import { MonthlyLineChart } from '../components/charts/MonthlyLineChart'
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart'
import { RecordsDetail } from '../components/detail/RecordsDetail'
import { FilterBar } from '../components/filters/FilterBar'
import { KpiCard } from '../components/kpis/KpiCard'
import { DashboardHeader } from '../components/layout/DashboardHeader'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { useTaxRecords } from '../hooks/useTaxRecords'
import type { Filters } from '../types/dashboard'
import { calculateDashboard, EMPTY_FILTERS, getFilterOptions } from '../utils/dashboard'
import { formatMillions } from '../utils/format'

export function DashboardPage() {
  const { records, loading, error, source } = useTaxRecords()
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const options = useMemo(() => getFilterOptions(records), [records])
  const view = useMemo(() => calculateDashboard(records, filters), [records, filters])

  if (loading || error) {
    return (
      <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 3, md: 5 } }}>
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <DashboardHeader source={source} />
            {error
              ? <Alert severity="error" role="alert">No se pudieron cargar los datos: {error}</Alert>
              : <Stack direction="row" spacing={2} alignItems="center" role="status">
                <CircularProgress size={24} aria-label="Cargando" />
                <span>Cargando datos de recaudación…</span>
              </Stack>}
          </Stack>
        </Container>
      </Box>
    )
  }

  return (
    <DashboardLayout
      header={<DashboardHeader source={source} />}
      filters={<FilterBar filters={filters} options={options} onChange={setFilters} />}
      kpis={<>
        {view.totalCombinaciones === 0 && <Grid size={12}>
          <Alert severity="info">Sin datos para esta selección</Alert>
        </Grid>}
        <Grid size={{ xs: 12, md: 4 }}><KpiCard label="Recaudación total"
          value={view.total} format="usdMillions" note="Con filtros aplicados" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><KpiCard label="Participación del IVA"
          value={view.porcentajeIva} format="percent"
          note={`${formatMillions(view.iva)} recaudados`} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><KpiCard label="Mes de mayor recaudación"
          value={view.mesMayor?.label ?? null} format="text"
          note={view.mesMayor ? formatMillions(view.mesMayor.valor) : undefined} /></Grid>
      </>}
      charts={<>
        <Grid size={{ xs: 12, md: 7 }}><MonthlyLineChart points={view.tendencia} selectedMonth={filters.mes} /></Grid>
        <Grid size={{ xs: 12, md: 5 }}><HorizontalBarChart title="Participación por impuesto" items={view.impuestos} /></Grid>
        <Grid size={{ xs: 12, md: 6 }}><HorizontalBarChart title="Recaudación por provincia" items={view.provincias} /></Grid>
        <Grid size={{ xs: 12, md: 6 }}><HorizontalBarChart title="Personas naturales vs. sociedades"
          items={view.tipos} color="secondary" /></Grid>
      </>}
      detail={<RecordsDetail rows={view.detalle} total={view.totalCombinaciones} />}
    />
  )
}
