import Blockly from 'blockly';
import { sensors } from './Color';

const DistanceSensorValue = {
  definition: {
    init() {
      this.appendDummyInput()
        .appendField('distance sensor value');
      this.setOutput(true, 'Number');
      this.setTooltip('Get the distance sensor value in centimeters.');
      this.setColour(sensors.HUE);
      this.setHelpUrl('https://docs.rovercode.com/blocks/distance-sensor-value');
    },
  },
  generator: () => {
    const code = 'getDistanceSensorValue()';
    return [code, Blockly.JavaScript.ORDER_NONE];
  },
};

export default DistanceSensorValue;
