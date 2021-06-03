import DistanceSensorValue from '../DistanceSensorValue';
import { sensors } from '../Color';

class TestBlock {
  appendDummyInput = jest.fn(() => new TestBlock())

  appendField = jest.fn(() => new TestBlock())

  setOutput = jest.fn()

  setColour = jest.fn()

  setTooltip = jest.fn()

  setHelpUrl = jest.fn()
}

describe('DistanceSensorValue block', () => {
  test('initializes successfully', () => {
    const testBlock = new TestBlock();
    const { init } = DistanceSensorValue.definition;
    const boundInit = init.bind(testBlock);
    boundInit();

    expect(testBlock.setOutput).toHaveBeenCalledWith(true, 'Number');
    expect(testBlock.setColour).toHaveBeenCalledWith(sensors.HUE);
  });

  test('generates code correctly', () => {
    const result = DistanceSensorValue.generator();

    expect(result[0]).toBe('getDistanceSensorValue()');
  });
});
