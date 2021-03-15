import { createMuiTheme } from '@material-ui/core/styles';
import Blockly from 'blockly';

const defaultTheme = createMuiTheme();
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
      [defaultTheme.breakpoints.up('xs')]: {
        fontSize: '28px !important',
        fontWeight: 'bold',
      },
    },
    h2: {
      [defaultTheme.breakpoints.up('xs')]: {
        fontSize: '24px !important',
        fontWeight: 'bold',
      },
    },
    h3: {
      // fontSize: '18px !important',
      // fontWeight: 'bold',
      [defaultTheme.breakpoints.up('xs')]: {
        fontSize: '18px !important',
        fontWeight: 'bold !important',
      },
    },
    h4: {
      [defaultTheme.breakpoints.up('xs')]: {
        fontSize: '15px !important',
        fontWeight: 'bold',
      },
    },
    h5: {
      [defaultTheme.breakpoints.up('xs')]: {
        fontSize: '14px !important',
        fontWeight: 'bold',
      },
    },
    subtitle1: {
      [defaultTheme.breakpoints.up('xs')]: {
        fontSize: '16px !important',
        fontWeight: 'bold',
      },
    },
    body1: {
      [defaultTheme.breakpoints.up('xs')]: {
        fontSize: '16px !important',
      },
    },
    subtitle2: {
      [defaultTheme.breakpoints.up('xs')]: {
        fontSize: '14px !important',
        fontWeight: 'bold',
      },
    },
    body2: {
      [defaultTheme.breakpoints.up('xs')]: {
        fontSize: '14px !important',
      },
    },
    caption: {
      [defaultTheme.breakpoints.up('xs')]: {
        fontSize: '13px !important',
      },
    },

    button: {
      [defaultTheme.breakpoints.up('xs')]: {
        fontSize: '14px !important',
        fontWeight: 'bold',
        textTransform: 'none',
      },
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
