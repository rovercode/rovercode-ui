import Comment from '../Comment';
import { display } from '../Color';

class TestBlock {
  appendField = jest.fn(() => new TestBlock())

  appendDummyInput = jest.fn(() => new TestBlock())

  setColour = jest.fn()

  setInputsInline = jest.fn()

  setNextStatement = jest.fn()

  setPreviousStatement = jest.fn()

  setTooltip = jest.fn()

  setHelpUrl = jest.fn()
}

describe('Comment block', () => {
  test('initializes successfully', () => {
    const testBlock = new TestBlock();
    const { init } = Comment.definition;
    const boundInit = init.bind(testBlock);
    boundInit();

    expect(testBlock.setColour).toHaveBeenCalledWith(display.HUE);
    expect(testBlock.setInputsInline).toHaveBeenCalledWith(true);
    expect(testBlock.setNextStatement).toHaveBeenCalledWith(true, null);
    expect(testBlock.setPreviousStatement).toHaveBeenCalledWith(true, null);
  });

  test('generates code correctly', () => {
    const block = {
      getFieldValue: jest.fn(() => 'test message'),
    };
    const result = Comment.generator(block);

    expect(result).toBe('/* test message */\n');
  });
});
