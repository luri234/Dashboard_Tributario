import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import type { BarItem } from '../../types/dashboard'
import { formatMillions } from '../../utils/format'

interface Props {
  title: string
  items: BarItem[]
  color?: 'primary' | 'secondary'
}

export function HorizontalBarChart({ title, items, color = 'primary' }: Props) {
  const max = Math.max(1, ...items.map((item) => item.valor))
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" gap={1} sx={{ mb: 2 }}>
          <Typography variant="h6">{title}</Typography>
          <Typography color="text.secondary" variant="caption" sx={{ whiteSpace: 'nowrap' }}>USD millones</Typography>
        </Stack>
        {items.length === 0 ? <Typography sx={{ py: 4 }} color="text.secondary">Sin datos para esta selección</Typography> : (
          <Stack spacing={1.5} sx={{ maxHeight: 280, overflowY: 'auto', pr: 1 }}>
            {items.map((item) => (
              <Box key={item.label}>
                <Stack direction="row" justifyContent="space-between" gap={1}>
                  <Typography noWrap variant="caption" color={item.selected ? `${color}.main` : 'text.primary'}
                    fontWeight={item.selected ? 700 : 400} title={item.label}>{item.label}</Typography>
                  <Typography variant="caption" sx={{ whiteSpace: 'nowrap' }}>{formatMillions(item.valor)}</Typography>
                </Stack>
                <Box aria-label={`${item.label}: ${formatMillions(item.valor)}`} role="img"
                  sx={{ mt: 0.5, height: 8, bgcolor: '#eaf0f6', borderRadius: 10, overflow: 'hidden' }}>
                  <Box sx={{ height: '100%', width: `${Math.max(0, item.valor / max * 100)}%`,
                    bgcolor: `${color}.main`, opacity: item.selected ? 1 : 0.75, borderRadius: 10 }} />
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
