import React, { Component } from 'react';
import { Button, Popup } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import { COVERED, NOT_COVERED } from '@/actions/sensor';

class RoverConnection extends Component {
  constructor(props) {
    super(props);

    this.protocolMap = {
      'light-sens': this.handleLightSensor,
      'line-sens': this.handleLineSensor,
      'dist-sens': this.handleDistanceSensor,
      'ub-temp-sens': this.handleUBitTempSensor,
      'ub-light-sens': this.handleUBitLightSensor,
      accel: this.handleAccelerationSensor,
      gyro: this.handleGyroscopeSensor,
      'compass-sens': this.handleCompassSensor,
      'mag-sens': this.handleMagneticForceSensor,
      'battery-sens': this.handleBatterySensor,
      'dewpoint-sens': this.handleDewPointSensor,
    };
  }

  handleLightSensor = (params) => {
    const { changeLeftSensorState, changeRightSensorState, write } = this.props;

    const [left, right] = params.split(',');
    write(`Light Sensor - L:${left} R:${right}`);
    if (parseInt(left, 10) > 500) {
      changeLeftSensorState(COVERED);
    } else {
      changeLeftSensorState(NOT_COVERED);
    }
    if (parseInt(right, 10) > 500) {
      changeRightSensorState(COVERED);
    } else {
      changeRightSensorState(NOT_COVERED);
    }
  }

  handleLineSensor = (params) => {
    const { write } = this.props;

    const [left, right] = params.split(',');

    write(`Line Sensor - L:${left} R:${right}`);
  }

  handleDistanceSensor = (params) => {
    const { write } = this.props;

    write(`Distance Sensor - ${params} mm`);
  }

  handleUBitTempSensor = (params) => {
    const { write } = this.props;

    write(`uBit Temperature Sensor - ${params} C`);
  }

  handleUBitLightSensor = (params) => {
    const { write } = this.props;

    write(`uBit Light Sensor - ${params}`);
  }

  handleAccelerationSensor = (params) => {
    const { write } = this.props;

    const [x, y, z] = params.split(',');

    write(`Acceleration Sensor - X:${x} mG Y:${y} mG Z:${z} mG`);
  }

  handleGyroscopeSensor = (params) => {
    const { write } = this.props;

    const [pitch, roll] = params.split(',');

    write(`Gryoscope Sensor - Pitch:${pitch} degrees Roll:${roll} degrees`);
  }

  handleCompassSensor = (params) => {
    const { write } = this.props;

    write(`Compass Sensor - ${params} degrees`);
  }

  handleMagneticForceSensor = (params) => {
    const { write } = this.props;
    const [x, y, z] = params.split(',');

    write(`Magnetic Force Sensor - X:${x} uT Y:${y} uT Z:${z} uT`);
  }

  handleBatterySensor = (params) => {
    const { write } = this.props;

    write(`Battery Sensor - ${params} mV`);
  }

  handleDewPointSensor = (params) => {
    const { write } = this.props;

    write(`Dew Point Sensor - ${params} C`);
  }

  connect = () => {
    const { scanForRover, connectToRover } = this.props;

    return scanForRover().then((rover) => {
      rover.value.addEventListener('gattserverdisconnected', this.onDisconnected);
      return connectToRover(rover.value, this.onMessage);
    });
  }

  onMessage = (event) => {
    const { write } = this.props;

    const receivedData = [];
    for (let i = 0; i < event.target.value.byteLength; i++) {
      receivedData[i] = event.target.value.getUint8(i);
    }

    const receivedString = String.fromCharCode.apply(null, receivedData);

    const [command, params] = receivedString.split(':');
    try {
      this.protocolMap[command](params);
    } catch (e) {
      write('Unknown rover message received.');
    }
  }

  onDisconnected = () => {
    const { disconnectFromRover, rover } = this.props;

    disconnectFromRover(rover);
  }

  supportedPlatform = () => navigator && navigator.bluetooth

  render() {
    const { intl, rover } = this.props;

    const popupText = intl.formatMessage({
      id: 'app.rover_connection.unsupported_platform',
      description: 'Popup text for unsupported platform',
      defaultMessage: 'Please use a supported platform',
    });

    if (rover) {
      return (
        <Button primary fluid onClick={this.onDisconnected}>
          <FormattedMessage
            id="app.rover_connection.disconnect"
            description="Button label to disconnect from the rover"
            defaultMessage="Disconnect from"
          />
          {` ${rover.name.slice(15, 20)}`}
        </Button>
      );
    }

    const button = (
      <Button primary fluid disabled={!this.supportedPlatform()} onClick={this.connect}>
        <FormattedMessage
          id="app.rover_connection.connect"
          description="Button label to connect to the rover"
          defaultMessage="Connect to rover"
        />
      </Button>
    );

    return this.supportedPlatform() ? button : (
      <Popup content={popupText} trigger={<span>{button}</span>} />
    );
  }
}

RoverConnection.defaultProps = {
  rover: null,
};

RoverConnection.propTypes = {
  rover: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  connectToRover: PropTypes.func.isRequired,
  disconnectFromRover: PropTypes.func.isRequired,
  scanForRover: PropTypes.func.isRequired,
  changeLeftSensorState: PropTypes.func.isRequired,
  changeRightSensorState: PropTypes.func.isRequired,
  write: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default hot(module)(injectIntl(RoverConnection));
