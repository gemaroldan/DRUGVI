import { createTheme } from '@mui/material/styles';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    menuButton: true;
    menuButtonLogo: true;
  }
}

const primaryHighlight = '#13DEFC';

const baseMenuButtonStyles = {
  fontSize: '1.2rem',
  textTransform: 'capitalize',
  '&:hover': {
    backgroundColor: 'transparent',
    color: primaryHighlight,
  },
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#003B6F',
      light: '#dfe6ed', //'#cce1f7',
    },
    secondary: {
      main: '#e74c3c',
    },
    background: {
      default: '#e9f2fa', //'#f5f5f5', //'87455c' //'#e0f7fa'
    },
  },
  typography: {
    fontFamily: 'system-ui', //`'sans-serif','Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    fontSize: 14, // tamaño base (en px)
    h1: {
      fontSize: '2.5rem', // 40px aprox
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem', // 32px aprox
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      textAlign: 'justify',
      lineHeight: 2.5,
    },
    button: {
      textTransform: 'none', // para que los botones no tengan mayúsculas automáticas
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f0f0f0',
          fontFamily: 'Roboto, sans-serif',
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: 'auto',
          paddingTop: 0,
          paddingBottom: 0,
          '&.Mui-expanded': {
            minHeight: 'auto',
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
        content: {
          '&.Mui-expanded': {
            marginBottom: 5,
          },
        },
      },
    },

    MuiButton: {
      variants: [
        {
          props: { variant: 'menuButtonLogo' },
          style: {
            ...baseMenuButtonStyles,
            textTransform: 'capitalize',
            fontSize: '1.3rem',
          },
        },
        {
          props: { variant: 'menuButton' },
          style: {
            ...baseMenuButtonStyles,
            textTransform: 'capitalize',
            '&.active': {
              borderBottom: `2px solid ${primaryHighlight}`,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          },
        },
      ],
    },
  },
});
export default theme;
