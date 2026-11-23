import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import type { DetailRow } from '../../types/dashboard'
import { months } from '../../mocks/dashboard'
import { formatMillions, formatPercent } from '../../utils/format'

export function RecordsTable({ rows }: { rows: DetailRow[] }) {
  return (
    <TableContainer>
      <Table size="small" aria-label="Detalle de recaudación de ejemplo">
        <TableHead>
          <TableRow sx={{ bgcolor: '#f3f7fb' }}>
            {['Mes', 'Impuesto', 'Provincia', 'Tipo de contribuyente', 'Valor USD M', '% del total'].map((label) => (
              <TableCell key={label} align={label.startsWith('Valor') || label.startsWith('%') ? 'right' : 'left'}
                sx={{ whiteSpace: 'nowrap', fontWeight: 700 }}>{label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.mes}/${row.impuesto}/${row.provincia}/${row.tipo}`}>
              <TableCell>{months[row.mes - 1]}</TableCell>
              <TableCell>{row.impuesto}</TableCell>
              <TableCell>{row.provincia}</TableCell>
              <TableCell>{row.tipo}</TableCell>
              <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 700, whiteSpace: 'nowrap' }}>
                {formatMillions(row.valor)}
              </TableCell>
              <TableCell align="right">{formatPercent(row.porcentaje)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
