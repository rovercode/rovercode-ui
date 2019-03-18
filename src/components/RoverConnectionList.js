import React, { Component, Fragment } from 'react';
import { Card, Loader } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import RoverConnection from '@/components/RoverConnection';

class RoverConnectionList extends Component {
  componentDidMount() {
    const { fetchRovers } = this.props;

    return fetchRovers();
  }

  render() {
    const {
      activeRover,
      changeActiveRover,
      changeLeftSensorState,
      changeRightSensorState,
      commands,
      popCommand,
      rovers,
    } = this.props;

    let activeRoverObject = null;
    let inactiveRovers = null;

    if (rovers) {
      const activeRoverIndex = rovers.findIndex(rover => rover.client_id === activeRover);

      if (activeRoverIndex > -1) {
        ({ [`${activeRoverIndex}`]: activeRoverObject, ...inactiveRovers } = rovers);
        inactiveRovers = Object.values(inactiveRovers);
      }
    }

    if (!inactiveRovers) {
      inactiveRovers = rovers;
    }

    return (
      <Fragment>
        {
          rovers ? (
            <Card.Group style={{ margin: '10px' }}>
              {
                activeRoverObject ? (
                  <RoverConnection
                    key={activeRoverObject.id}
                    clientId={activeRoverObject.client_id}
                    name={activeRoverObject.name}
                    changeLeftSensorState={changeLeftSensorState}
                    changeRightSensorState={changeRightSensorState}
                    changeActiveRover={changeActiveRover}
                    popCommand={popCommand}
                    commands={commands}
                    isActive
                  />
                ) : (null)
              }
              {
                inactiveRovers.map(rover => (
                  <RoverConnection
                    key={rover.id}
                    clientId={rover.client_id}
                    name={rover.name}
                    changeLeftSensorState={changeLeftSensorState}
                    changeRightSensorState={changeRightSensorState}
                    changeActiveRover={changeActiveRover}
                    popCommand={popCommand}
                    isActive={false}
                  />
                ))
              }
            </Card.Group>
          ) : (
            <Loader active />
          )
        }
      </Fragment>
    );
  }
}

RoverConnectionList.defaultProps = {
  activeRover: null,
  rovers: null,
};

RoverConnectionList.propTypes = {
  activeRover: PropTypes.string,
  rovers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      client_id: PropTypes.string.isRequired,
    }),
  ),
  fetchRovers: PropTypes.func.isRequired,
  changeLeftSensorState: PropTypes.func.isRequired,
  changeRightSensorState: PropTypes.func.isRequired,
  changeActiveRover: PropTypes.func.isRequired,
  popCommand: PropTypes.func.isRequired,
  commands: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default hot(module)(RoverConnectionList);
