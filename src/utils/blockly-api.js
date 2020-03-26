class BlocklyApi {
  constructor(highlightBlock, beginSleep, sensorStateCache, writeToConsole, sendToRover) {
    this.highlightBlock = highlightBlock;
    this.beginSleep = beginSleep;
    this.sensorStateCache = sensorStateCache;
    this.writeToConsole = writeToConsole;
    this.sendToRover = sendToRover;
  }

  sendMotorCommand = (blocklyMotor, blocklyDirection, speed) => {
    console.log("Sending to rover");
    this.sendToRover("P\n");
    // this.sendToRover(JSON.stringify({
    //   type: 'motor-command',
    //   'motor-id': blocklyMotor === 'LEFT' ? 'motor-left' : 'motor-right',
    //   'motor-value': speed,
    //   direction: blocklyDirection === 'FORWARD' ? 'forward' : 'backward',
    //   unit: 'percent',
    // }));
  }

  setChainableRgbLed = (blocklyLedId, blocklyColorHexString) => {
    if (blocklyLedId === null || blocklyColorHexString === null) {
      return;
    }
    const red = parseInt(blocklyColorHexString.substring(1, 3), 16);
    const green = parseInt(blocklyColorHexString.substring(3, 5), 16);
    const blue = parseInt(blocklyColorHexString.substring(5, 7), 16);
    this.sendToRover(JSON.stringify({
      type: 'chainable-rgb-led-command',
      'led-id': blocklyLedId,
      'red-value': red,
      'green-value': green,
      'blue-value': blue,
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
    wrapper = (lengthInMs) => {
      this.beginSleep(lengthInMs);
      this.writeToConsole(`Sleeping for ${lengthInMs}ms.`);
      return false;
    };
    interpreter.setProperty(scope, 'sleep',
      interpreter.createNativeFunction(wrapper));

    // Add set chainable RGB LED API function
    wrapper = (ledId, colorHexString) => {
      this.setChainableRgbLed(ledId.data, colorHexString.data);
      return false;
    };
    interpreter.setProperty(scope, 'setChainableRgbLed',
      interpreter.createNativeFunction(wrapper));
  }
}

export default BlocklyApi;
