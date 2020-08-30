import SensorsGetCovered from '../SensorsGetCovered';
import { sensors } from '../Color';

class TestBlock {
  appendDummyInput = jest.fn(() => new TestBlock())

  appendField = jest.fn(() => new TestBlock())

  setOutput = jest.fn()

  setInputsInline = jest.fn()

  setColour = jest.fn()

  setTooltip = jest.fn()

  setHelpUrl = jest.fn()
}

describe('SensorsGetCovered block', () => {
  test('initializes successfully', () => {
    const testBlock = new TestBlock();
    const { init } = SensorsGetCovered.definition;
    const boundInit = init.bind(testBlock);
    boundInit();

    expect(testBlock.setOutput).toHaveBeenCalledWith(true, 'Boolean');
    expect(testBlock.setColour).toHaveBeenCalledWith(sensors.HUE);
  });

  test('generates code correctly', () => {
    const block = {
      getFieldValue: jest.fn(() => 'SENSORS_leftIr'),
    };
    const result = SensorsGetCovered.generator(block);

    expect(block.getFieldValue).toHaveBeenCalledWith('SENSOR');
    expect(result[0]).toBe('getSensorCovered(\'SENSORS_leftIr\')');
  });
});
