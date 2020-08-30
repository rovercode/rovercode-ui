import Blockly from 'blockly';
import { sensors } from './Color';

const SensorsGetCovered = {
  definition: {
    init() {
      this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([['left', 'SENSORS_leftIr'], ['right', 'SENSORS_rightIr']]), 'SENSORS');
      this.appendDummyInput()
        .appendField(' sensor is covered');
      this.setInputsInline(true);
      this.setOutput(true, 'Boolean');
      this.setColour(sensors.HUE);
      this.setTooltip('');
      this.setHelpUrl('http://www.example.com/');
    },
  },
  generator: (block) => {
    const dropdownSensors = block.getFieldValue('SENSOR');
    const code = `getSensorCovered('${dropdownSensors}')`;
    return [code, Blockly.JavaScript.ORDER_NONE];
  },
};

export default SensorsGetCovered;
