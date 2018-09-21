import BlocklyApi from '../blockly-api';

describe('Blockly API', () => {
  let highlightBlock = null;
  let beginSleep = null;
  let interpreter = null;
  let writeToConsole = null;
  let api = null;

  beforeEach(() => {
    highlightBlock = jest.fn();
    beginSleep = jest.fn();
    writeToConsole = jest.fn();
    interpreter = {
      createPrimitive: jest.fn(),
      createNativeFunction: jest.fn(),
      setProperty: jest.fn(),
    };
    const sensorStateCache = [];
    sensorStateCache.SENSORS_leftIr = false;
    sensorStateCache.SENSORS_rightIr = false;

    api = new BlocklyApi(highlightBlock, beginSleep, sensorStateCache, writeToConsole);
    api.initApi(interpreter);
  });

  test('handles alert', () => {
    const alertHandler = interpreter.createNativeFunction.mock.calls[0][0];

    alertHandler('test string');

    expect(writeToConsole).toHaveBeenCalled();
    expect(writeToConsole).toHaveBeenCalledWith('test string');
  });

  test('handles alert with blank string', () => {
    const alertHandler = interpreter.createNativeFunction.mock.calls[0][0];

    alertHandler('');

    expect(writeToConsole).toHaveBeenCalled();
    expect(writeToConsole).toHaveBeenCalledWith('');
  });

  test('handles highlightBlock', () => {
    const highlightBlockHandler = interpreter.createNativeFunction.mock.calls[1][0];

    highlightBlockHandler(123);

    expect(interpreter.createPrimitive).toHaveBeenCalledTimes(1);
    expect(highlightBlock).toHaveBeenCalledTimes(1);
    expect(highlightBlock).toHaveBeenCalledWith('123');
  });

  test('handles highlightBlock with no id', () => {
    const highlightBlockHandler = interpreter.createNativeFunction.mock.calls[1][0];

    highlightBlockHandler();

    expect(interpreter.createPrimitive).toHaveBeenCalledTimes(1);
    expect(highlightBlock).toHaveBeenCalledTimes(1);
    expect(highlightBlock).toHaveBeenCalledWith('');
  });

  test('handles setMotor', () => {
    const setMotorHandler = interpreter.createNativeFunction.mock.calls[2][0];

    const result = setMotorHandler('LEFT', 'FORWARD', 100);

    expect(result).toBe(false);
  });

  test('handles stopMotor', () => {
    const stopMotorHandler = interpreter.createNativeFunction.mock.calls[3][0];

    const result = stopMotorHandler('LEFT');

    expect(result).toBe(false);
  });

  test('handles getSensorCovered', () => {
    const getSensorCoveredHandler = interpreter.createNativeFunction.mock.calls[4][0];

    getSensorCoveredHandler('SENSORS_leftIr');

    expect(interpreter.createPrimitive).toHaveBeenCalled();
    expect(interpreter.createPrimitive).toHaveBeenCalledWith(false);
  });

  test('handles sleep', () => {
    const sleepHandler = interpreter.createNativeFunction.mock.calls[5][0];

    sleepHandler(100);

    expect(beginSleep).toHaveBeenCalled();
    expect(beginSleep).toHaveBeenCalledWith(100);
    expect(writeToConsole).toHaveBeenCalled();
    expect(writeToConsole).toHaveBeenCalledWith('Sleeping for 100ms.');
  });
});
