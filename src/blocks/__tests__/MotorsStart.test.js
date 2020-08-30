import MotorsStart from '../MotorsStart';
import { motors } from '../Color';

jest.mock('blockly');

import Blockly from 'blockly'; // eslint-disable-line import/first, import/order

class TestBlock {
  appendDummyInput = jest.fn(() => new TestBlock())

  appendField = jest.fn(() => new TestBlock())

  appendValueInput = jest.fn(() => new TestBlock())

  setCheck = jest.fn(() => new TestBlock())

  setColour = jest.fn()

  setInputsInline = jest.fn()

  setNextStatement = jest.fn()

  setPreviousStatement = jest.fn()

  setTooltip = jest.fn()

  setHelpUrl = jest.fn()
}

describe('MotorsStart block', () => {
  test('initializes successfully', () => {
    const testBlock = new TestBlock();
    const { init } = MotorsStart.definition;
    const boundInit = init.bind(testBlock);
    boundInit();

    expect(testBlock.setColour).toHaveBeenCalledWith(motors.HUE);
    expect(testBlock.setInputsInline).toHaveBeenCalledWith(true);
    expect(testBlock.setNextStatement).toHaveBeenCalledWith(true, null);
    expect(testBlock.setPreviousStatement).toHaveBeenCalledWith(true, null);
  });

  test('generates code correctly for integer', () => {
    Blockly.JavaScript.valueToCode = jest.fn(() => 50);
    const block = {
      getFieldValue: jest.fn().mockReturnValueOnce('LEFT').mockReturnValueOnce('FORWARD'),
    };
    const result = MotorsStart.generator(block);

    expect(result).toBe('setMotor(\'LEFT\', \'FORWARD\', \'50\');\n');
  });

  test('generates code correctly for variable', () => {
    Blockly.JavaScript.valueToCode = jest.fn(() => 'i');
    const block = {
      getFieldValue: jest.fn().mockReturnValueOnce('RIGHT').mockReturnValueOnce('BACKWARD'),
    };
    const result = MotorsStart.generator(block);

    expect(result).toBe('setMotor(\'RIGHT\', \'BACKWARD\', i.toString());\n');
  });
});
