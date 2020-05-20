import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
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
    fontSize: 14,
    fontFamily: [
      'Lato', 'sans-serif',
    ].join(','),
    button: {
      fontWeight: 'bold',
      textTransform: 'none',
    },
  },
});
