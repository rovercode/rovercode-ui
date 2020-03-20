import React, { Component, Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

class RoverConnectionList extends Component {
  connect = () => {
    const { scanForRover, connectToRover } = this.props;

    scanForRover().then(rover => connectToRover(rover.value));
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
};

export default hot(module)(RoverConnectionList);
