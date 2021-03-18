import React, { Component } from 'react';
import {
  Button,
  Typography,
  Popover,
  Box,
} from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import { EXECUTION_STOP } from '@/actions/code';
import { COVERED, NOT_COVERED } from '@/actions/sensor';

import LogoIcon from './LogoIcon';

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
      button: this.handleButton,
    };

    this.state = {
      unsupportedPopoverAnchorElement: null,
      supportedPlatform: navigator && navigator.bluetooth,
    };
  }

  handlePopoverOpen = (event) => {
    this.setState({
      unsupportedPopoverAnchorElement: event.target,
    });
  };

  handlePopoverClose = () => {
    this.setState({
      unsupportedPopoverAnchorElement: null,
    });
  };

  handleLightSensor = (params) => {
    const { changeLightSensorReadings } = this.props;

    const [left, right] = params.split(',');
    const leftReading = parseInt(left, 10);
    const rightReading = parseInt(right, 10);
    changeLightSensorReadings(leftReading, rightReading);
  }

  handleLineSensor = (params) => {
    const { changeLineSensorReadings } = this.props;

    const [left, right] = params.split(',');
    const leftReading = parseInt(left, 10);
    const rightReading = parseInt(right, 10);
    changeLineSensorReadings(leftReading, rightReading);
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
    const { changeBatteryVoltageReading } = this.props;

    changeBatteryVoltageReading(parseInt(params, 10));
  }

  handleDewPointSensor = (params) => {
    const { write } = this.props;

    write(`Dew Point Sensor - ${params} C`);
  }

  handleButton = (params) => {
    const { changeLeftSensorState, changeRightSensorState, sensor } = this.props;

    if (params === 'a') {
      changeLeftSensorState(sensor.left === COVERED ? NOT_COVERED : COVERED);
    } else if (params === 'b') {
      changeRightSensorState(sensor.right === COVERED ? NOT_COVERED : COVERED);
    }
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
    const { changeExecutionState, disconnectFromRover, rover } = this.props;

    changeExecutionState(EXECUTION_STOP);
    disconnectFromRover(rover);
  }

  render() {
    const { rover } = this.props;
    const { unsupportedPopoverAnchorElement, supportedPlatform } = this.state;

    const PopoverMessage = withStyles(() => ({
      root: {
        pointerEvents: 'none',
      },
    }))(Popover);

    const ConnectionButton = withStyles((theme) => ({
      root: {
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
          backgroundColor: grey[300],
        },
        '&:disabled': {
          backgroundColor: grey[400],
        },
      },
    }))(Button);

    const NoRoverText = withStyles(() => ({
      root: {
        color: grey[600],
      },
    }))(Typography);

    const ConnectText = withStyles(() => ({
      root: {
        textTransform: 'uppercase',
      },
    }))(Typography);

    const DisconnectText = withStyles(() => ({
      root: {
        textTransform: 'uppercase',
        color: grey[600],
      },
    }))(Typography);

    const PopoverMessageText = withStyles((theme) => ({
      root: {
        padding: theme.spacing(2),
        pointerEvents: 'none',
      },
    }))(Typography);

    const NavBarLogo = withStyles((theme) => {
      let color = grey[800];
      if (!supportedPlatform) {
        color = theme.palette.warning.dark;
      }
      if (rover) {
        color = theme.palette.primary.main;
      }
      return {
        root: { color },
      };
    })(LogoIcon);

    if (rover) {
      return (
        <ConnectionButton
          size="large"
          variant="outlined"
          disableElevation
          startIcon={<NavBarLogo style={{ fontSize: 50 }} />}
          onClick={this.onDisconnected}
        >
          <div>
            <Typography variant="h6">
              {` ${rover.name.slice(15, 20)}`}
              <br />
            </Typography>
            <DisconnectText color="primary">
              <FormattedMessage
                id="app.rover_connection.disconnect"
                description="Button label to disconnect from the rover"
                defaultMessage="Disconnect"
              />
            </DisconnectText>
          </div>
        </ConnectionButton>
      );
    }

    const popoverOpen = Boolean(unsupportedPopoverAnchorElement);

    const button = (
      <ConnectionButton
        variant="outlined"
        disableElevation
        style={{
          justifyContent: 'flex-start',
          minWidth: '200px',
          height: '48px',
          padding: '0px 8px',
          border: 'none',
        }}
        onClick={this.connect}
        startIcon={<NavBarLogo style={{ fontSize: 50 }} />}
        disabled={!supportedPlatform}
      >
        <Box display="flex" flexDirection="column" alignItems="baseline">
          <NoRoverText variant="body1" style={{ lineHeight: '1' }}>
            <FormattedMessage
              id="app.rover_connection.no_rover"
              description="Label when no rover is connected"
              defaultMessage="No Rover"
            />
            <br />
          </NoRoverText>
          <ConnectText variant="subtitle2" color={supportedPlatform ? 'primary' : 'initial'}>
            <FormattedMessage
              id="app.rover_connection.connect"
              description="Button label to connect to the rover"
              defaultMessage="Connect"
            />
          </ConnectText>
        </Box>
      </ConnectionButton>
    );

    return supportedPlatform ? (button) : (
      <>
        <span
          aria-owns={popoverOpen ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={this.handlePopoverOpen}
          onMouseLeave={this.handlePopoverClose}
        >
          {button}
        </span>
        <PopoverMessage
          id="mouse-over-popover"
          open={popoverOpen}
          anchorEl={unsupportedPopoverAnchorElement}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus
        >
          <PopoverMessageText variant="h6">
            <FormattedMessage
              id="app.rover_connection.unsupported_platform"
              description="Popup text for unsupported platform"
              defaultMessage="This browser or device is not supported.
                  'Try using Google Chrome or Microsoft Edge '
                  'on a PC, Macbook, or Android tablet. Also, '
                  'make sure Bluetooth is enabled."
            />
          </PopoverMessageText>
        </PopoverMessage>
      </>
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
  sensor: PropTypes.shape({
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
  }).isRequired,
  connectToRover: PropTypes.func.isRequired,
  disconnectFromRover: PropTypes.func.isRequired,
  scanForRover: PropTypes.func.isRequired,
  changeExecutionState: PropTypes.func.isRequired,
  changeLeftSensorState: PropTypes.func.isRequired,
  changeRightSensorState: PropTypes.func.isRequired,
  changeLightSensorReadings: PropTypes.func.isRequired,
  changeLineSensorReadings: PropTypes.func.isRequired,
  changeBatteryVoltageReading: PropTypes.func.isRequired,
  write: PropTypes.func.isRequired,
};

export default hot(module)(RoverConnection);
