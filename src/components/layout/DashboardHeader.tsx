import { Box, Chip, Stack, Typography } from '@mui/material'

export function DashboardHeader() {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box aria-hidden="true" sx={{ width: 6, height: 53, bgcolor: 'primary.main', borderRadius: 2, flexShrink: 0 }} />
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontSize: { xs: 25, md: 34 } }}>
            Recaudación tributaria 2024
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
            Fuente: SRI · Datos Abiertos Ecuador
          </Typography>
        </Box>
      </Stack>
      <Chip label="Datos de ejemplo" size="small" color="secondary" variant="outlined" />
    </Stack>
  )
}
