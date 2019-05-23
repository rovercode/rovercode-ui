class BlocklyApi {
  constructor(highlightBlock, beginSleep, sensorStateCache, writeToConsole, sendToRover) {
    this.highlightBlock = highlightBlock;
    this.beginSleep = beginSleep;
    this.sensorStateCache = sensorStateCache;
    this.writeToConsole = writeToConsole;
    this.sendToRover = sendToRover;
  }

  sendMotorCommand = (blocklyMotor, blocklyDirection, speed) => {
    this.sendToRover(JSON.stringify({
      type: 'motor-command',
      'motor-id': blocklyMotor === 'LEFT' ? 'motor-left' : 'motor-right',
      'motor-value': speed,
      direction: blocklyDirection === 'FORWARD' ? 'forward' : 'backward',
      unit: 'percent',
    }));
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
      this.sendMotorCommand(motor.data, direction.data, speed.data);
      return false;
    };
    interpreter.setProperty(scope, 'setMotor',
      interpreter.createNativeFunction(wrapper));

    // Add stop motor API function
    wrapper = (motor) => {
      /* Stop both forward and backward pins, just to be safe */
      this.sendMotorCommand(motor.data, 'FORWARD', 0);
      this.sendMotorCommand(motor.data, 'BACKWARD', 0);
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
