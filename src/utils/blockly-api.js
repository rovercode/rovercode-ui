// TODO: rover API
const sendMotorCommand = (command, pin, speed) => console.log(`Motor command: ${command}, ${pin}, ${speed}`); // eslint-disable-line no-console
const leftMotor = { FORWARD: 'XIO-P0', BACKWARD: 'XIO-P1' };
const rightMotor = { FORWARD: 'XIO-P6', BACKWARD: 'XIO-P7' };
const motorPins = { LEFT: leftMotor, RIGHT: rightMotor };

class BlocklyApi {
  constructor(highlightBlock, beginSleep, sensorStateCache, writeToConsole) {
    this.highlightBlock = highlightBlock;
    this.beginSleep = beginSleep;
    this.sensorStateCache = sensorStateCache;
    this.writeToConsole = writeToConsole;
  }

  initApi = (interpreter, scope) => {
    // Add an API function for the alert() block.
    let wrapper = (text) => {
      text = text ? text.toString() : '';
      return interpreter.createPrimitive(this.writeToConsole(text));
    };

    interpreter.setProperty(scope, 'alert',
      interpreter.createNativeFunction(wrapper));

    // Add an API function for highlighting blocks.
    wrapper = (id) => {
      id = id ? id.toString() : '';
      return interpreter.createPrimitive(this.highlightBlock(id));
    };
    interpreter.setProperty(scope, 'highlightBlock',
      interpreter.createNativeFunction(wrapper));

    // Add set motor API function
    wrapper = (motor, direction, speed) => {
      const pin = motorPins[motor][direction];
      sendMotorCommand('START_MOTOR', pin, speed);
      return false;
    };
    interpreter.setProperty(scope, 'setMotor',
      interpreter.createNativeFunction(wrapper));

    // Add stop motor API function
    wrapper = (motor) => {
      /* Stop both forward and backward pins, just to be safe */
      sendMotorCommand('START_MOTOR', motorPins[motor].FORWARD, 0);
      sendMotorCommand('START_MOTOR', motorPins[motor].BACKWARD, 0);
      return false;
    };
    interpreter.setProperty(scope, 'stopMotor',
      interpreter.createNativeFunction(wrapper));

    // Add get sensor covered API function
    wrapper = (sensor) => {
      const sensorCovered = this.sensorStateCache[sensor];
      return interpreter.createPrimitive(sensorCovered);
    };
    interpreter.setProperty(scope, 'getSensorCovered',
      interpreter.createNativeFunction(wrapper));

    // Add continue API function
    /* TODO: Make the highlighting stay on continue block while sleeping */
    wrapper = (lengthInMs) => {
      this.beginSleep(lengthInMs);
      this.writeToConsole(`Sleeping for ${lengthInMs}ms.`);
      return false;
    };
    interpreter.setProperty(scope, 'sleep',
      interpreter.createNativeFunction(wrapper));
  }
}

export default BlocklyApi;
