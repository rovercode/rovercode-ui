import MotorsStop from '../MotorsStop';
import { motors } from '../Color';

class TestBlock {
  appendDummyInput = jest.fn(() => new TestBlock())

  appendField = jest.fn(() => new TestBlock())

  setColour = jest.fn()

  setInputsInline = jest.fn()

  setNextStatement = jest.fn()

  setPreviousStatement = jest.fn()

  setTooltip = jest.fn()

  setHelpUrl = jest.fn()
}

describe('MotorsStop block', () => {
  test('initializes successfully', () => {
    const testBlock = new TestBlock();
    const { init } = MotorsStop.definition;
    const boundInit = init.bind(testBlock);
    boundInit();

    expect(testBlock.setColour).toHaveBeenCalledWith(motors.HUE);
    expect(testBlock.setInputsInline).toHaveBeenCalledWith(true);
    expect(testBlock.setNextStatement).toHaveBeenCalledWith(true, null);
    expect(testBlock.setPreviousStatement).toHaveBeenCalledWith(true, null);
  });

  test('generates code correctly', () => {
    const block = {
      getFieldValue: jest.fn(() => 'LEFT'),
    };
    const result = MotorsStop.generator(block);

    expect(block.getFieldValue).toHaveBeenCalledWith('MOTOR');
    expect(result).toBe('stopMotor(\'LEFT\');\n');
  });
});
