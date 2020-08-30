import LineSensorValue from '../LineSensorValue';
import { sensors } from '../Color';

class TestBlock {
  appendDummyInput = jest.fn(() => new TestBlock())

  appendField = jest.fn(() => new TestBlock())

  setOutput = jest.fn()

  setColour = jest.fn()

  setTooltip = jest.fn()

  setHelpUrl = jest.fn()
}

describe('LineSensorValue block', () => {
  test('initializes successfully', () => {
    const testBlock = new TestBlock();
    const { init } = LineSensorValue.definition;
    const boundInit = init.bind(testBlock);
    boundInit();

    expect(testBlock.setOutput).toHaveBeenCalledWith(true, 'Number');
    expect(testBlock.setColour).toHaveBeenCalledWith(sensors.HUE);
  });

  test('generates code correctly', () => {
    const block = {
      getFieldValue: jest.fn(() => 'LEFT'),
    };
    const result = LineSensorValue.generator(block);

    expect(block.getFieldValue).toHaveBeenCalledWith('SENSOR');
    expect(result[0]).toBe('getLineSensorValue(\'LEFT\')');
  });
});
