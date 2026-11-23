import type { ReactNode } from 'react'
import { Box, Container, Grid, Stack } from '@mui/material'

interface Props {
  header: ReactNode
  filters: ReactNode
  kpis: ReactNode
  charts: ReactNode
  detail: ReactNode
}

export function DashboardLayout({ header, filters, kpis, charts, detail }: Props) {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack spacing={3}>{header}{filters}</Stack>
          <Grid container spacing={2}>{kpis}</Grid>
          <Grid container spacing={2}>{charts}</Grid>
          {detail}
        </Stack>
      </Container>
    </Box>
  )
}
