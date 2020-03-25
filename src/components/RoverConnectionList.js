import React, { Component, Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import { COVERED, NOT_COVERED } from '@/actions/sensor';

class RoverConnectionList extends Component {
  connect = () => {
    const { scanForRover, connectToRover } = this.props;

    scanForRover().then(rover => connectToRover(rover.value, this.onMessage));
  }

  onMessage = (event) => {
    const { changeLeftSensorState, changeRightSensorState } = this.props;

    const receivedData = [];
    for (let i = 0; i < event.target.value.byteLength; i++) {
      receivedData[i] = event.target.value.getUint8(i);
    }

    const receivedString = String.fromCharCode.apply(null, receivedData);
    if (receivedString === 'A') {
      changeLeftSensorState(COVERED);
    } else if (receivedString === 'B') {
      changeLeftSensorState(NOT_COVERED);
    }
  }

  render() {
    const { disconnectFromRover, rover } = this.props;

    return (
      <Fragment>
        {
          rover ? (
            <Button primary onClick={() => disconnectFromRover(rover)}>
              <FormattedMessage
                id="app.rover_list.disconnect"
                description="Button label to disconnect from the rover"
                defaultMessage="Disconnect from"
              />
              {` ${rover.name}`}
            </Button>
          ) : (
            <Button primary onClick={this.connect}>
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

RoverConnectionList.propTypes = {
  rover: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  connectToRover: PropTypes.func.isRequired,
  disconnectFromRover: PropTypes.func.isRequired,
  scanForRover: PropTypes.func.isRequired,
  changeLeftSensorState: PropTypes.func.isRequired,
  changeRightSensorState: PropTypes.func.isRequired,
};

export default hot(module)(RoverConnectionList);
