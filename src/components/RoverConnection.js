import React, { Component, Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import { COVERED, NOT_COVERED } from '@/actions/sensor';
import { write } from 'js-interpreter';

class RoverConnection extends Component {
  connect = () => {
    const { scanForRover, connectToRover } = this.props;

    return scanForRover().then((rover) => {
      rover.value.addEventListener('gattserverdisconnected', this.onDisconnected);
      return connectToRover(rover.value, this.onMessage);
    });
  }

  onMessage = (event) => {
    const { changeLeftSensorState, changeRightSensorState, writeToConsole } = this.props;

    const receivedData = [];
    for (let i = 0; i < event.target.value.byteLength; i++) {
      receivedData[i] = event.target.value.getUint8(i);
    }

    const receivedString = String.fromCharCode.apply(null, receivedData);
    writeToConsole(new Date().getMilliseconds() + receivedString);
    console.log(receivedString);
    if (receivedString === 'left-sensor:1') {
      changeLeftSensorState(COVERED);
    } else if (receivedString === 'left-sensor:0') {
      changeLeftSensorState(NOT_COVERED);
    } else if (receivedString === 'right-sensor:1') {
      changeRightSensorState(COVERED);
    } else if (receivedString === 'right-sensor:0') {
      changeRightSensorState(NOT_COVERED);
    }
  }

  onDisconnected = () => {
    const { disconnectFromRover, rover } = this.props;

    disconnectFromRover(rover);
  }

  render() {
    const { rover } = this.props;

    return (
      <Fragment>
        {
          rover ? (
            <Button primary fluid onClick={this.onDisconnected}>
              <FormattedMessage
                id="app.rover_list.disconnect"
                description="Button label to disconnect from the rover"
                defaultMessage="Disconnect from"
              />
              {` ${rover.name.slice(15, 20)}`}
            </Button>
          ) : (
            <Button primary fluid onClick={this.connect}>
              <FormattedMessage
                id="app.rover_list.connect"
                description="Button label to connect to the rover"
                defaultMessage="Connect to rover"
              />
            </Button>
          )
        }
      </Fragment>
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
  writeToConsole: PropTypes.func.isRequired,
};

export default hot(module)(RoverConnection);
