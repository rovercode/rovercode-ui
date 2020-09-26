import Blockly from 'blockly';
import { sensors } from './Color';

const ButtonPress = {
  definition: {
    init() {
      this.appendDummyInput()
        .appendField('button')
        .appendField(new Blockly.FieldDropdown([['A', 'A'], ['B', 'B']]), 'BUTTON')
        .appendField('has been pressed');
      this.setOutput(true, 'Boolean');
      this.setColour(sensors.HUE);
      this.setTooltip('Returns true if the button has been pressed since the last time you asked.');
      this.setHelpUrl('https://docs.rovercode.com/blocks/button-press');
    },
  },
  generator: (block) => {
    const dropdownButton = block.getFieldValue('BUTTON');
    const code = `buttonHasBeenPressed('${dropdownButton}')`;
    return [code, Blockly.JavaScript.ORDER_NONE];
  },
};

export default ButtonPress;
