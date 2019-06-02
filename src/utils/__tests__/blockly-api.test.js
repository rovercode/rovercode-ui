import BlocklyApi from '../blockly-api';

describe('Blockly API', () => {
  let highlightBlock = null;
  let beginSleep = null;
  let interpreter = null;
  let writeToConsole = null;
  let sendToRover = null;
  let api = null;

  beforeEach(() => {
    highlightBlock = jest.fn();
    beginSleep = jest.fn();
    writeToConsole = jest.fn();
    sendToRover = jest.fn();
    interpreter = {
      createPrimitive: jest.fn(),
      createNativeFunction: jest.fn(),
      setProperty: jest.fn(),
    };
    const sensorStateCache = [];
    sensorStateCache.SENSORS_leftIr = false;
    sensorStateCache.SENSORS_rightIr = false;

    api = new BlocklyApi(highlightBlock, beginSleep, sensorStateCache, writeToConsole, sendToRover);
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

    const result = setMotorHandler({ data: 'LEFT' }, { data: 'FORWARD' }, { data: 100 });

    expect(result).toBe(false);
    expect(sendToRover).toHaveBeenCalledTimes(1);
    expect(sendToRover).toHaveBeenCalledWith(JSON.stringify({
      type: 'motor-command',
      'motor-id': 'motor-left',
      'motor-value': 100,
      direction: 'forward',
      unit: 'percent',
    }));
  });

  test('handles stopMotor', () => {
    const stopMotorHandler = interpreter.createNativeFunction.mock.calls[3][0];

    const result = stopMotorHandler({ data: 'RIGHT' });

    expect(result).toBe(false);
    expect(sendToRover).toHaveBeenCalledTimes(2);
    expect(sendToRover.mock.calls[0][0]).toBe(JSON.stringify({
      type: 'motor-command',
      'motor-id': 'motor-right',
      'motor-value': 0,
      direction: 'forward',
      unit: 'percent',
    }));
    expect(sendToRover.mock.calls[1][0]).toBe(JSON.stringify({
      type: 'motor-command',
      'motor-id': 'motor-right',
      'motor-value': 0,
      direction: 'backward',
      unit: 'percent',
    }));
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
