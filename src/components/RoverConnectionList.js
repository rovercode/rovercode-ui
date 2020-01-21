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
      isFetching,
      popCommand,
      rovers,
    } = this.props;

    let activeRoverObject = null;
    let inactiveRovers = null;

    if (rovers && rovers.results.length) {
      let activeRoverIndex = rovers.results.findIndex(rover => rover.client_id === activeRover);
      if (activeRoverIndex < 0) {
        changeActiveRover(rovers.results[0].client_id);
        activeRoverIndex = 0;
      }

      ({ [activeRoverIndex]: activeRoverObject, ...inactiveRovers } = rovers.results);
      inactiveRovers = Object.values(inactiveRovers);
    } else if (!isFetching) {
      inactiveRovers = [];
    }

    return (
      <Fragment>
        {
          !isFetching && inactiveRovers !== null ? (
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
  rovers: {
    next: null,
    previous: null,
    results: [],
  },
  isFetching: false,
};

RoverConnectionList.propTypes = {
  activeRover: PropTypes.string,
  rovers: PropTypes.shape({
    next: PropTypes.string,
    previous: PropTypes.string,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        client_id: PropTypes.string.isRequired,
      }),
    ),
  }),
  isFetching: PropTypes.bool,
  fetchRovers: PropTypes.func.isRequired,
  changeLeftSensorState: PropTypes.func.isRequired,
  changeRightSensorState: PropTypes.func.isRequired,
  changeActiveRover: PropTypes.func.isRequired,
  popCommand: PropTypes.func.isRequired,
  commands: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default hot(module)(RoverConnectionList);
