import { createMuiTheme } from '@material-ui/core/styles';
import Blockly from 'blockly';

export default createMuiTheme({
  overrides: {
    MuiCardHeader: {
      title: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      subheader: {
        fontSize: 13,
      },
    },
    MuiListItemIcon: {
      root: { minWidth: '32px' },
    },
  },
  palette: {
    primary: {
      main: '#114BFD' /* blue */,
    },
    secondary: {
      main: '#FF0459' /* magenta */,
    },
    warning: {
      main: '#FEAD11' /* yellow */,
    },
    info: {
      main: '#00FDA3' /* lime green, cyan */,
    },
    success: {
      main: '#21BA45' /* green */,
    },
    background: {
      default: '#F9F9F9',
      paper: '#FFFFFF',
    },

    /* Keep default error red */
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontSize: 14,
    fontFamily: ['Lato', 'sans-serif'].join(','),
    h1: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    h4: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    h5: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    body1: {
      fontSize: 16,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 13,
    },

    button: {
      fontWeight: 'bold',
      textTransform: 'none',
    },
  },
});

export const blocklyTheme = Blockly.Theme.defineTheme('themeName', {
  base: Blockly.Themes.Classic,
  startHats: true,
  fontStyle: {
    family: 'sans-serif',
    size: 12,
  },
  componentStyles: {
    toolboxBackgroundColour: '#EEEEEE',
    flyoutBackgroundColour: '#E0E0E0',
    workspaceBackgroundColour: '#FFFFFF',
  },
});
