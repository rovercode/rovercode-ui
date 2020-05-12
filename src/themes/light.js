import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 1000600,
  //     md: 1000960,
  //     lg: 10001280,
  //     xl: 10001920,
  //   },
  // },
  palette: {
    primary: {
      main: '#114BFD', /* blue */
    },
    secondary: {
      main: '#FF0459', /* magenta */
    },
    warning: {
      main: '#FEAD11', /* yellow */
    },
    info: {
      main: '#00FDA3', /* lime green, cyan */
    },
    success: {
      main: '#21BA45', /* green */
    },
    /* Keep default error red */
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontSize: 16,
    fontFamily: [
      'Lato', 'sans-serif',
    ].join(','),
    button: {
      fontWeight: 'bold',
      textTransform: 'none',
    },
  },
});
