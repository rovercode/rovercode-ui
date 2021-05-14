import Blockly from 'blockly';
import { headlights } from './Color';

const Headlight = {
  definition: {
    init() {
      this.appendDummyInput()
        .appendField('set')
        .appendField(new Blockly.FieldDropdown([['left headlight', 'LEFT'], ['right headlight', 'RIGHT'], ['both headlights', 'BOTH']]), 'HEADLIGHT_ID')
        .appendField('to color ');
      this.appendValueInput('COLOUR')
        .setCheck('Colour');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(headlights.HUE);
      this.setTooltip('Set the color of a headlight');
      this.setHelpUrl('https://docs.rovercode.com/blocks/chainable_rgb_set');
    },
  },
  generator: (block) => {
    const headlightId = block.getFieldValue('HEADLIGHT_ID');
    const colour = Blockly.JavaScript.valueToCode(block, 'COLOUR', Blockly.JavaScript.ORDER_ATOMIC);
    return `setHeadlightRgbLed('${headlightId}', ${colour});`;
  },
};

export default Headlight;
