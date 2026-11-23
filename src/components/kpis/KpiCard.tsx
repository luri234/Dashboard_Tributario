import { Card, CardContent, Stack, Typography } from '@mui/material'
import type { KpiFormat } from '../../types/dashboard'
import { formatMillions, formatPercent } from '../../utils/format'

interface Props {
  label: string
  value: number | string | null
  format: KpiFormat
  note?: string
}

export function KpiCard({ label, value, format, note }: Props) {
  const shown = value === null ? '—'
    : format === 'usdMillions' && typeof value === 'number' ? formatMillions(value)
      : format === 'percent' && typeof value === 'number' ? formatPercent(value) : String(value)

  return (
    <Card sx={{ height: '100%', borderTop: 3, borderTopColor: 'primary.main' }}>
      <CardContent>
        <Stack direction={{ xs: 'row', md: 'column' }} alignItems={{ xs: 'baseline', md: 'flex-start' }}
          justifyContent="space-between" spacing={1}>
          <Typography color="text.secondary" variant="body2" fontWeight={600}>{label}</Typography>
          <Typography color="primary.dark" variant="h4" fontWeight={750}
            sx={{ fontSize: { xs: 25, md: 34 }, fontVariantNumeric: 'tabular-nums' }}>{shown}</Typography>
        </Stack>
        {note && <Typography color="secondary.main" fontWeight={600} variant="caption">{note}</Typography>}
      </CardContent>
    </Card>
  )
}
