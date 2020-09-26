import DisplayMessage from '../DisplayMessage';
import { display } from '../Color';

jest.mock('blockly');

import Blockly from 'blockly'; // eslint-disable-line import/first, import/order

class TestBlock {
  appendField = jest.fn()

  appendValueInput = jest.fn(() => new TestBlock())

  setCheck = jest.fn(() => new TestBlock())

  setColour = jest.fn()

  setInputsInline = jest.fn()

  setNextStatement = jest.fn()

  setPreviousStatement = jest.fn()

  setTooltip = jest.fn()

  setHelpUrl = jest.fn()
}

describe('DisplayMessage block', () => {
  test('initializes successfully', () => {
    const testBlock = new TestBlock();
    const { init } = DisplayMessage.definition;
    const boundInit = init.bind(testBlock);
    boundInit();

    expect(testBlock.setColour).toHaveBeenCalledWith(display.HUE);
    expect(testBlock.setInputsInline).toHaveBeenCalledWith(true);
    expect(testBlock.setNextStatement).toHaveBeenCalledWith(true, null);
    expect(testBlock.setPreviousStatement).toHaveBeenCalledWith(true, null);
  });

  test('generates code correctly', () => {
    Blockly.JavaScript.valueToCode = jest.fn(() => 'test message');
    const block = {};
    const result = DisplayMessage.generator(block);

    expect(result).toBe('displayMessage(String(test message));\n');
  });
});
