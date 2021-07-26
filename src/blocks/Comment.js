import Blockly from 'blockly';
import { display } from './Color';

const Comment = {
  definition: {
    init() {
      this.appendDummyInput()
        .appendField('/* ')
        .appendField(new Blockly.FieldTextInput('Write a comment here!'), 'COMMENT')
        .appendField('*/');
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(display.HUE);
      this.setTooltip('Write a comment to explain your code. It will not affect how your program runs.');
      this.setHelpUrl('https://docs.rovercode.com/blocks/comment');
    },
  },
  generator: (block) => {
    const valueComment = block.getFieldValue('COMMENT');
    return `/* ${valueComment} */\n`; // Injection risk, but more power to them
  },
};

export default Comment;
