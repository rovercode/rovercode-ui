import Continue from '../Continue';
import { time } from '../Color';

jest.mock('blockly');

import Blockly from 'blockly'; // eslint-disable-line import/first, import/order

class TestBlock {
  appendDummyInput = jest.fn(() => new TestBlock())

  appendField = jest.fn()

  appendValueInput = jest.fn(() => new TestBlock())

  setCheck = jest.fn()

  setColour = jest.fn()

  setInputsInline = jest.fn()

  setNextStatement = jest.fn()

  setPreviousStatement = jest.fn()

  setTooltip = jest.fn()

  setHelpUrl = jest.fn()
}

describe('Continue block', () => {
  test('initializes successfully', () => {
    const testBlock = new TestBlock();
    const { init } = Continue.definition;
    const boundInit = init.bind(testBlock);
    boundInit();

    expect(testBlock.setColour).toHaveBeenCalledWith(time.HUE);
    expect(testBlock.setInputsInline).toHaveBeenCalledWith(true);
    expect(testBlock.setNextStatement).toHaveBeenCalledWith(true);
    expect(testBlock.setPreviousStatement).toHaveBeenCalledWith(true);
  });

  test('generates code correctly for seconds', () => {
    Blockly.JavaScript.valueToCode = jest.fn(() => 1);
    const block = {
      getFieldValue: jest.fn(() => 'UNITS_seconds'),
    };
    const result = Continue.generator(block);

    expect(block.getFieldValue).toHaveBeenCalledWith('UNITS');
    expect(result).toBe('sleep(1000);');
  });

  test('generates code correctly for milliseconds', () => {
    Blockly.JavaScript.valueToCode = jest.fn(() => 500);
    const block = {
      getFieldValue: jest.fn(() => 'UNITS_milliseconds'),
    };
    const result = Continue.generator(block);

    expect(block.getFieldValue).toHaveBeenCalledWith('UNITS');
    expect(result).toBe('sleep(500);');
  });
});
