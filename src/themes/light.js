import { createMuiTheme } from '@material-ui/core/styles';
import Blockly from 'node-blockly/browser';

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
    fontFamily: [
      'Lato', 'sans-serif',
    ].join(','),
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
