import Blockly from 'blockly';
import { motors } from './Color';

const MotorsStop = {
  definition: {
    init() {
      this.appendDummyInput()
        .appendField('stop')
        .appendField(new Blockly.FieldDropdown([['left motor', 'LEFT'], ['right motor', 'RIGHT'], ['both motors', 'BOTH']]), 'MOTOR');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(motors.HUE);
      this.setTooltip('Stop one or both motor');
      this.setHelpUrl('https://docs.rovercode.com/blocks/motors-stop');
    },
  },
  generator: (block) => {
    const dropdownMotor = block.getFieldValue('MOTOR');
    const code = `stopMotor('${dropdownMotor}');\n`;
    return code;
  },
};

export default MotorsStop;
