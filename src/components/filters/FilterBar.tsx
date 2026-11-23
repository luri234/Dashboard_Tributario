import { Grid } from '@mui/material'
import type { FilterOptions, Filters } from '../../types/dashboard'
import { FilterSelect } from './FilterSelect'

interface Props {
  filters: Filters
  options: FilterOptions
  onChange: (filters: Filters) => void
}

export function FilterBar({ filters, options, onChange }: Props) {
  return (
    <Grid container spacing={1.5} component="section" aria-label="Filtros de recaudación">
      <Grid size={{ xs: 6, md: 4 }}>
        <FilterSelect id="provincia" label="Provincia" allLabel="Todas"
          value={filters.provincia} options={options.provincias}
          onChange={(provincia) => onChange({ ...filters, provincia })} />
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <FilterSelect id="tipo" label="Tipo de contribuyente" allLabel="Todos"
          value={filters.tipo} options={options.tipos}
          onChange={(tipo) => onChange({ ...filters, tipo })} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FilterSelect id="mes" label="Mes" allLabel="Todo el año"
          value={filters.mes} options={options.meses}
          onChange={(mes) => onChange({ ...filters, mes })} />
      </Grid>
    </Grid>
  )
}
