class BlocklyApi {
  constructor(highlightBlock, beginSleep, sensorStateCache, writeToConsole, sendToRover) {
    this.highlightBlock = highlightBlock;
    this.beginSleep = beginSleep;
    this.sensorStateCache = sensorStateCache;
    this.writeToConsole = writeToConsole;
    this.sendToRover = sendToRover;
  }

  sendMotorCommand = (blocklyMotor, blocklyDirection, speed) => {
    let motor;
    switch (blocklyMotor) {
      case 'LEFT':
        motor = 'left-motor';
        break;
      case 'RIGHT':
        motor = 'right-motor';
        break;
      default:
        motor = 'both-motors';
    }
    if (blocklyDirection === 'BACKWARD') {
      speed *= -1;
    }
    this.sendToRover(`${motor}:${speed}\n`);
  }

  sendDisplayCommand = (message) => {
    if (message.length < 2) {
      // pad with spaces to ensure scrolling
      message = ` ${message} `;
    }
    this.sendToRover(`disp:${message}\n`);
    // Give 1.5 seconds per letter to display
    this.beginSleep(message.length * 1500);
  }

  setHeadlightRgbLed = (blocklyHeadlightId, blocklyColorHexString) => {
    if (blocklyHeadlightId === null || blocklyColorHexString === null) {
      return;
    }
    let headlight;
    switch (blocklyHeadlightId) {
      case 'LEFT':
        headlight = 'left-hl';
        break;
      case 'RIGHT':
        headlight = 'right-hl';
        break;
      default:
        headlight = 'both-hl';
    }
    const red = parseInt(blocklyColorHexString.substring(1, 3), 16);
    const green = parseInt(blocklyColorHexString.substring(3, 5), 16);
    const blue = parseInt(blocklyColorHexString.substring(5, 7), 16);
    this.sendToRover(`${headlight}:${red}:${green}:${blue}\n`);
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
      this.sendMotorCommand(motor.data, 'FORWARD', 0);
      return false;
    };
    interpreter.setProperty(scope, 'stopMotor',
      interpreter.createNativeFunction(wrapper));

    // Add get light sensor API function
    wrapper = (sensor) => {
      const sensorReading = this.sensorStateCache[`${sensor}_LIGHT`];
      return interpreter.createPrimitive(sensorReading);
    };
    interpreter.setProperty(scope, 'getLightSensorValue',
      interpreter.createNativeFunction(wrapper));

    // Add get line sensor API function
    wrapper = (sensor) => {
      const sensorReading = this.sensorStateCache[`${sensor}_LINE`];
      return interpreter.createPrimitive(sensorReading);
    };
    interpreter.setProperty(scope, 'getLineSensorValue',
      interpreter.createNativeFunction(wrapper));

    // Add get button pressed API function
    wrapper = (sensor) => {
      const buttonReading = this.sensorStateCache[`${sensor}_BUTTON`];
      return interpreter.createPrimitive(buttonReading);
    };
    interpreter.setProperty(scope, 'buttonHasBeenPressed',
      interpreter.createNativeFunction(wrapper));

    // Add continue API function
    wrapper = (lengthInMs) => {
      this.beginSleep(lengthInMs);
      this.writeToConsole(`Sleeping for ${lengthInMs}ms.`);
      return false;
    };
    interpreter.setProperty(scope, 'sleep',
      interpreter.createNativeFunction(wrapper));

    // Add set headlight LED API function
    wrapper = (headlightId, colorHexString) => {
      this.setHeadlightRgbLed(headlightId.data, colorHexString.data);
      return false;
    };
    interpreter.setProperty(scope, 'setHeadlightRgbLed',
      interpreter.createNativeFunction(wrapper));

    // Add display message API function
    wrapper = (message) => {
      this.sendDisplayCommand(message.data);
      return false;
    };
    interpreter.setProperty(scope, 'displayMessage',
      interpreter.createNativeFunction(wrapper));

    // Add get distance sensor API function
    wrapper = () => {
      const sensorReading = this.sensorStateCache.DISTANCE;
      return interpreter.createPrimitive(sensorReading);
    };
    interpreter.setProperty(scope, 'getDistanceSensorValue',
      interpreter.createNativeFunction(wrapper));
  }
}

export default BlocklyApi;
