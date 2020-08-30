import Blockly from 'blockly';
import { sensors } from './Color';

const LightSensorValue = {
  definition: {
    init() {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([['left', 'LEFT'], ['right', 'RIGHT']]), 'SENSOR')
        .appendField('light sensor value');
      this.setOutput(true, 'Number');
      this.setTooltip('Get the brightness value from a light sensor. 0 is darkest; 1023 is brightest.');
      this.setColour(sensors.HUE);
      this.setHelpUrl('https://docs.rovercode.com/blocks/light-sensor-value');
    },
  },
  generator: (block) => {
    const dropdownSensors = block.getFieldValue('SENSOR');
    const code = `getLightSensorValue('${dropdownSensors}')`;
    return [code, Blockly.JavaScript.ORDER_NONE];
  },
};

export default LightSensorValue;
