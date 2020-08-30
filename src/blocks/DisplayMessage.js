import Blockly from 'blockly';
import { display } from './Color';

const DisplayMessage = {
  definition: {
    init() {
      this.appendValueInput('MESSAGE')
        .setCheck(['String', 'Boolean', 'Number'])
        .appendField('display message');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(display.HUE);
      this.setTooltip('Scroll a message on the 5x5 LED display');
      this.setHelpUrl('https://docs.rovercode.com/blocks/display-string');
    },
  },
  generator: (block) => {
    const valueMessage = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC);
    const code = `displayMessage(String(${valueMessage}));\n`;
    return code;
  },
};

export default DisplayMessage;
