import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import type { DetailRow } from '../../types/dashboard'
import { MONTH_SHORT } from '../../utils/dashboard'
import { formatMillions, formatPercent } from '../../utils/format'

export function RecordsCardList({ rows }: { rows: DetailRow[] }) {
  return (
    <Stack spacing={1}>
      {rows.map((row) => (
        <Card key={`${row.mes}/${row.impuesto}/${row.provincia}/${row.tipo}`} variant="outlined">
          <CardContent sx={{ '&:last-child': { pb: 2 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
              <Typography fontWeight={700} variant="body2" sx={{ overflowWrap: 'anywhere' }}>{row.impuesto}</Typography>
              <Typography color="primary.main" fontWeight={700} variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                {formatMillions(row.valor)}
              </Typography>
            </Stack>
            <Box sx={{ mt: 1 }}>
              <Typography color="text.secondary" variant="caption" sx={{ overflowWrap: 'anywhere' }}>
                {MONTH_SHORT[row.mes - 1] ?? row.mesNombre} · {row.provincia} · {row.tipo}
              </Typography>
            </Box>
            <Typography color="secondary.main" variant="caption" display="block">
              {formatPercent(row.porcentaje)} del total
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
