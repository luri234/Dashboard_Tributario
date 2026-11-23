import { Typography } from '@mui/material'
import { DashboardHeader } from './components/layout/DashboardHeader'
import { DashboardLayout } from './components/layout/DashboardLayout'

export default function App() {
  return (
    <DashboardLayout
      header={<DashboardHeader />}
      filters={<Typography color="text.secondary">Filtros en construcción</Typography>}
      kpis={<Typography color="text.secondary">Indicadores en construcción</Typography>}
      charts={<Typography color="text.secondary">Gráficos en construcción</Typography>}
      detail={<Typography color="text.secondary">Detalle en construcción</Typography>}
    />
  )
}
