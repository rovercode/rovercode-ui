import Blockly from 'blockly';
import { motors } from './Color';

const MotorsStart = {
  definition: {
    init() {
      this.appendDummyInput()
        .appendField('turn on')
        .appendField(new Blockly.FieldDropdown([['left motor', 'LEFT'], ['right motor', 'RIGHT'], ['both motors', 'BOTH']]), 'MOTOR')
        .appendField('going')
        .appendField(new Blockly.FieldDropdown([['forward', 'FORWARD'], ['backward', 'BACKWARD']]), 'DIRECTION')
        .appendField('at speed');
      this.appendValueInput('SPEED')
        .setCheck('Number');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(motors.HUE);
      this.setTooltip('Set the speed and direction of one or both motors. 0 is stopped; 100 is max speed.');
      this.setHelpUrl('https://docs.rovercode.com/blocks/motors-start');
    },
  },
  generator: (block) => {
    const dropdownMotor = block.getFieldValue('MOTOR');
    const dropdownDirection = block.getFieldValue('DIRECTION');
    const valueSpeed = Blockly.JavaScript.valueToCode(block, 'SPEED', Blockly.JavaScript.ORDER_ATOMIC);
    let code = `setMotor('${dropdownMotor}', '${dropdownDirection}'`;
    if (valueSpeed && Number.isNaN(parseInt(valueSpeed, 10))) {
      code += `, ${valueSpeed}.toString());\n`;
    } else {
      code += `, '${valueSpeed}');\n`;
    }
    return code;
  },
};

export default MotorsStart;
