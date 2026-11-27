import { Box, Card, CardContent, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import type { MonthlyPoint } from '../../types/dashboard'
import { formatMillions } from '../../utils/format'

interface Props {
  points: MonthlyPoint[]
  selectedMonth: number | null
}

export function MonthlyLineChart({ points, selectedMonth }: Props) {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const left = mobile ? 30 : 42
  const right = mobile ? 329 : 586
  const bottom = mobile ? 165 : 195
  const chartHeight = mobile ? 125 : 155
  const x = (index: number) => left + index * (mobile ? 27 : 48)
  const y = (value: number, max: number) => bottom - value / max * chartHeight
  const max = Math.max(1, ...points.map((point) => point.valor))
  const path = points.map((point, i) => `${i ? 'L' : 'M'} ${x(i)} ${y(point.valor, max)}`).join(' ')

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" gap={1}>
          <Typography variant="h6">Tendencia mensual</Typography>
          <Typography color="text.secondary" variant="caption">USD millones</Typography>
        </Stack>
        {points.length === 0 ? <Typography sx={{ py: 4 }} color="text.secondary">Sin datos para esta selección</Typography> : (
          <Box sx={{ mt: 2 }}>
            <svg viewBox={mobile ? '0 0 340 210' : '0 0 620 240'} width="100%" role="img"
              aria-label={`Recaudación mensual. ${points.map((p) => `${p.label}: ${formatMillions(p.valor)}`).join('; ')}`}>
              {[0, 0.5, 1].map((part) => (
                <g key={part}>
                  <line x1={left} x2={right} y1={y(part * max, max)} y2={y(part * max, max)}
                    stroke="#dce6f0" strokeDasharray="4 4" />
                  <text x={mobile ? 25 : 34} y={y(part * max, max) + 4} textAnchor="end"
                    fill="#62768c" fontSize="12">{(part * max / 1_000_000).toFixed(0)}</text>
                </g>
              ))}
              <path d={path} fill="none" stroke="#1463b6" strokeWidth="3" strokeLinejoin="round" />
              {points.map((point, index) => (
                <g key={point.mes}>
                  <circle cx={x(index)} cy={y(point.valor, max)}
                    r={point.mes === selectedMonth ? 7 : 3.5}
                    fill={point.mes === selectedMonth ? '#087d80' : 'white'}
                    stroke={point.mes === selectedMonth ? '#087d80' : '#1463b6'} strokeWidth="2.5">
                    <title>{point.label}: {formatMillions(point.valor)}</title>
                  </circle>
                   <text x={x(index)} y={mobile ? 194 : 225} textAnchor="middle"
                     fill={point.mes === selectedMonth ? '#087d80' : '#62768c'}
                     fontSize={mobile ? 11 : 12} fontWeight={point.mes === selectedMonth ? 700 : 400}>{point.label}</text>
                </g>
              ))}
            </svg>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
