import ButtonPress from '../ButtonPress';
import { sensors } from '../Color';

class TestBlock {
  appendDummyInput = jest.fn(() => new TestBlock())

  appendField = jest.fn(() => new TestBlock())

  setOutput = jest.fn()

  setColour = jest.fn()

  setTooltip = jest.fn()

  setHelpUrl = jest.fn()
}

describe('ButtonPress block', () => {
  test('initializes successfully', () => {
    const testBlock = new TestBlock();
    const { init } = ButtonPress.definition;
    const boundInit = init.bind(testBlock);
    boundInit();

    expect(testBlock.setOutput).toHaveBeenCalledWith(true, 'Boolean');
    expect(testBlock.setColour).toHaveBeenCalledWith(sensors.HUE);
  });

  test('generates code correctly', () => {
    const block = {
      getFieldValue: jest.fn(() => 'A'),
    };
    const result = ButtonPress.generator(block);

    expect(block.getFieldValue).toHaveBeenCalledWith('BUTTON');
    expect(result[0]).toBe('buttonHasBeenPressed(\'A\')');
  });
});
