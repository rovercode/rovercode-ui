import React, { Component, Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import { COVERED, NOT_COVERED } from '@/actions/sensor';

class RoverConnection extends Component {
  constructor(props) {
    super(props);

    this.protocolMap = {
      'light-sens': this.handleLightSensor,
    };
  }

  handleLightSensor = (params) => {
    const { changeLeftSensorState, changeRightSensorState } = this.props;

    const [left, right] = params.split(',');
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

  connect = () => {
    const { scanForRover, connectToRover } = this.props;

    return scanForRover().then((rover) => {
      rover.value.addEventListener('gattserverdisconnected', this.onDisconnected);
      return connectToRover(rover.value, this.onMessage);
    });
  }

  onMessage = (event) => {
    const receivedData = [];
    for (let i = 0; i < event.target.value.byteLength; i++) {
      receivedData[i] = event.target.value.getUint8(i);
    }

    const receivedString = String.fromCharCode.apply(null, receivedData);

    const [command, params] = receivedString.split(':');
    try {
      this.protocolMap[command](params);
    } catch (e) {
      // Unknown command received
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
};

export default hot(module)(RoverConnection);
