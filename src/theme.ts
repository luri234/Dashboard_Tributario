import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 600, md: 768, lg: 1200, xl: 1536 } },
  palette: {
    mode: 'light',
    primary: { main: '#1463b6' },
    secondary: { main: '#087d80' },
    background: { default: '#eef3f8', paper: '#ffffff' },
    text: { primary: '#182e46', secondary: '#62768c' },
  },
  typography: {
    fontFamily: '"Segoe UI", Inter, Arial, sans-serif',
    h4: { fontWeight: 750, letterSpacing: '-0.03em' },
    h6: { fontWeight: 700, letterSpacing: '-0.02em' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: { styleOverrides: { root: { border: '1px solid #e0e8f0', boxShadow: 'none' } } },
    MuiButtonBase: { defaultProps: { disableRipple: false } },
  },
})
