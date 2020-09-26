import Blockly from 'blockly';
import { time } from './Color';

const Continue = {
  definition: {
    init() {
      this.appendDummyInput()
        .appendField('continue');
      this.appendValueInput('LENGTH')
        .setCheck('Number');
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([['seconds', 'UNITS_seconds'], ['milliseconds', 'UNITS_milliseconds']]), 'UNITS');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour(time.HUE);
      this.setTooltip('');
      this.setHelpUrl('');
    },
  },
  generator: (block) => {
    let valueLength = Blockly.JavaScript.valueToCode(block, 'LENGTH', Blockly.JavaScript.ORDER_ATOMIC);
    const dropdownUnits = block.getFieldValue('UNITS');
    if (dropdownUnits === 'UNITS_seconds') valueLength *= 1000;
    /* From here on out, "continue" is known as "sleep" */
    const code = `sleep(${valueLength});`;
    return code;
  },
};

export default Continue;
