import Headlight from '../Headlight';
import { headlights } from '../Color';

jest.mock('blockly');

import Blockly from 'blockly'; // eslint-disable-line import/first, import/order

class TestBlock {
  appendField = jest.fn(() => new TestBlock())

  appendDummyInput = jest.fn(() => new TestBlock())

  appendValueInput = jest.fn(() => new TestBlock())

  setCheck = jest.fn(() => new TestBlock())

  setColour = jest.fn()

  setInputsInline = jest.fn()

  setNextStatement = jest.fn()

  setPreviousStatement = jest.fn()

  setTooltip = jest.fn()

  setHelpUrl = jest.fn()
}

describe('Headlight block', () => {
  test('initializes successfully', () => {
    const testBlock = new TestBlock();
    const { init } = Headlight.definition;
    const boundInit = init.bind(testBlock);
    boundInit();

    expect(testBlock.setColour).toHaveBeenCalledWith(headlights.HUE);
    expect(testBlock.setInputsInline).toHaveBeenCalledWith(true);
    expect(testBlock.setNextStatement).toHaveBeenCalledWith(true, null);
    expect(testBlock.setPreviousStatement).toHaveBeenCalledWith(true, null);
  });

  test('generates code correctly', () => {
    Blockly.JavaScript.valueToCode = jest.fn(() => 'colourRgb(50, 0, 0)');
    const block = {
      getFieldValue: jest.fn().mockReturnValueOnce('LEFT'),
    };
    const result = Headlight.generator(block);

    expect(result).toBe('setHeadlightRgbLed(\'LEFT\', colourRgb(50, 0, 0));');
  });
});
