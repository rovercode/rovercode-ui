import Blockly from 'blockly';
import { sensors } from './Color';

const LineSensorValue = {
  definition: {
    init() {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([['left', 'LEFT'], ['right', 'RIGHT']]), 'SENSOR')
        .appendField('line sensor value');
      this.setOutput(true, 'Number');
      this.setTooltip('Get the brightness value from a line sensor. 0 is darkest; 1023 is brightest.');
      this.setColour(sensors.HUE);
      this.setHelpUrl('https://docs.rovercode.com/blocks/line-sensor-value');
    },
  },
  generator: (block) => {
    const dropdownSensors = block.getFieldValue('SENSOR');
    const code = `getLineSensorValue('${dropdownSensors}')`;
    return [code, Blockly.JavaScript.ORDER_NONE];
  },
};

export default LineSensorValue;
