import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: {
      main: '#114BFD', /* blue */
    },
    secondary: {
      main: '#FF0459', /* magenta */
    },
    error: {
      main: '#FF0000', /* TODO: some kind of red??? */
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
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: [
      'Lato', 'sans-serif',
    ].join(','),
    button: {
      fontWeight: 'bold',
      textTransform: 'none',
    },
  },
});
