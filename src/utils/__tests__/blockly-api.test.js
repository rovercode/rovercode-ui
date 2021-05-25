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
    sensorStateCache.A_BUTTON = false;
    sensorStateCache.B_BUTTON = false;
    sensorStateCache.LEFT_LIGHT = 1;
    sensorStateCache.RIGHT_LIGHT = 2;
    sensorStateCache.LEFT_LINE = 3;
    sensorStateCache.RIGHT_LINE = 4;
    sensorStateCache.DISTANCE = 5;

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
    expect(sendToRover).toHaveBeenCalledWith('left-motor:100\n');
  });

  test('handles setMotor with BOTH', () => {
    const setMotorHandler = interpreter.createNativeFunction.mock.calls[2][0];

    const result = setMotorHandler({ data: 'BOTH' }, { data: 'FORWARD' }, { data: 100 });

    expect(result).toBe(false);
    expect(sendToRover).toHaveBeenCalledTimes(1);
    expect(sendToRover).toHaveBeenCalledWith('both-motors:100\n');
  });

  test('handles setMotor with BACKWARD', () => {
    const setMotorHandler = interpreter.createNativeFunction.mock.calls[2][0];

    const result = setMotorHandler({ data: 'RIGHT' }, { data: 'BACKWARD' }, { data: -100 });

    expect(result).toBe(false);
    expect(sendToRover).toHaveBeenCalledTimes(1);
    expect(sendToRover).toHaveBeenCalledWith('right-motor:100\n');
  });

  test('handles stopMotor', () => {
    const stopMotorHandler = interpreter.createNativeFunction.mock.calls[3][0];

    const result = stopMotorHandler({ data: 'RIGHT' });

    expect(result).toBe(false);
    expect(sendToRover).toHaveBeenCalledTimes(1);
    expect(sendToRover.mock.calls[0][0]).toBe('right-motor:0\n');
  });

  test('handles getLightSensorValue', () => {
    const getLightSensorHandler = interpreter.createNativeFunction.mock.calls[4][0];

    getLightSensorHandler('LEFT');

    expect(interpreter.createPrimitive).toHaveBeenCalled();
    expect(interpreter.createPrimitive).toHaveBeenCalledWith(1);
  });

  test('handles getLineSensorValue', () => {
    const getLineSensorHandler = interpreter.createNativeFunction.mock.calls[5][0];

    getLineSensorHandler('LEFT');

    expect(interpreter.createPrimitive).toHaveBeenCalled();
    expect(interpreter.createPrimitive).toHaveBeenCalledWith(3);
  });

  test('handles buttonHasBeenPressed', () => {
    const buttonHasBeenPressedHandler = interpreter.createNativeFunction.mock.calls[6][0];

    buttonHasBeenPressedHandler('A');

    expect(interpreter.createPrimitive).toHaveBeenCalled();
    expect(interpreter.createPrimitive).toHaveBeenCalledWith(false);
  });

  test('handles sleep', () => {
    const sleepHandler = interpreter.createNativeFunction.mock.calls[7][0];

    sleepHandler(100);

    expect(beginSleep).toHaveBeenCalled();
    expect(beginSleep).toHaveBeenCalledWith(100);
    expect(writeToConsole).toHaveBeenCalled();
    expect(writeToConsole).toHaveBeenCalledWith('Sleeping for 100ms.');
  });

  test('handles setHeadlightRgbLed for left headlight', () => {
    const setHeadlightRgbLedHandler = interpreter.createNativeFunction.mock.calls[8][0];

    const result = setHeadlightRgbLedHandler({ data: 'LEFT' }, { data: '#ff0042' });

    expect(result).toBe(false);
    expect(sendToRover).toHaveBeenCalledTimes(1);
    expect(sendToRover).toHaveBeenCalledWith('left-hl:255:0:66\n');
  });

  test('handles setHeadlightRgbLed for right headlight', () => {
    const setHeadlightRgbLedHandler = interpreter.createNativeFunction.mock.calls[8][0];

    const result = setHeadlightRgbLedHandler({ data: 'RIGHT' }, { data: '#42ff00' });

    expect(result).toBe(false);
    expect(sendToRover).toHaveBeenCalledTimes(1);
    expect(sendToRover).toHaveBeenCalledWith('right-hl:66:255:0\n');
  });

  test('handles setHeadlightRgbLed for both headlights', () => {
    const setHeadlightRgbLedHandler = interpreter.createNativeFunction.mock.calls[8][0];

    const result = setHeadlightRgbLedHandler({ data: 'BOTH' }, { data: '#0042ff' });

    expect(result).toBe(false);
    expect(sendToRover).toHaveBeenCalledTimes(1);
    expect(sendToRover).toHaveBeenCalledWith('both-hl:0:66:255\n');
  });

  test('handles setHeadlightRgbLed with missing id', () => {
    const setHeadlightRgbLedHandler = interpreter.createNativeFunction.mock.calls[8][0];

    const result = setHeadlightRgbLedHandler({ data: null }, { data: '#ff0042' });

    expect(result).toBe(false);
    expect(sendToRover).not.toHaveBeenCalled();
  });

  test('handles displayMessage', () => {
    const displayMessageHandler = interpreter.createNativeFunction.mock.calls[9][0];

    const result = displayMessageHandler({ data: 'hello world' });

    expect(result).toBe(false);
    expect(sendToRover).toHaveBeenCalledTimes(1);
    expect(sendToRover).toHaveBeenCalledWith('disp:hello world\n');
    expect(beginSleep).toHaveBeenCalled();
    // 11 characters in 'hello world' times 1500 ms each
    expect(beginSleep).toHaveBeenCalledWith(16500);
  });

  test('handles displayMessage with single charatcter message by padding', () => {
    const displayMessageHandler = interpreter.createNativeFunction.mock.calls[9][0];

    const result = displayMessageHandler({ data: 'h' });

    expect(result).toBe(false);
    expect(sendToRover).toHaveBeenCalledTimes(1);
    expect(sendToRover).toHaveBeenCalledWith('disp: h \n');
    expect(beginSleep).toHaveBeenCalled();
    // 3 characters in ' h ' times 1500 ms each
    expect(beginSleep).toHaveBeenCalledWith(4500);
  });

  test('handles getDistanceSensorValue', () => {
    const getDistanceSensorHandler = interpreter.createNativeFunction.mock.calls[10][0];

    getDistanceSensorHandler();

    expect(interpreter.createPrimitive).toHaveBeenCalled();
    expect(interpreter.createPrimitive).toHaveBeenCalledWith(5);
  });
});
