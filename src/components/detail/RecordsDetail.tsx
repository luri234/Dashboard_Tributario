import { Card, CardContent, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import type { DetailRow } from '../../types/dashboard'
import { RecordsCardList } from './RecordsCardList'
import { RecordsTable } from './RecordsTable'

interface Props {
  rows: DetailRow[]
  total: number
}

export function RecordsDetail({ rows, total }: Props) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Card component="section" aria-labelledby="detail-title">
      <CardContent>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={1} sx={{ mb: 2 }}>
          <Typography id="detail-title" variant="h6">Detalle de recaudación</Typography>
          <Typography color="text.secondary" variant="caption">Mostrando {rows.length} de {total} combinaciones</Typography>
        </Stack>
        {rows.length === 0
          ? <Typography color="text.secondary">Sin datos para esta selección</Typography>
          : mobile ? <RecordsCardList rows={rows} /> : <RecordsTable rows={rows} />}
      </CardContent>
    </Card>
  )
}
