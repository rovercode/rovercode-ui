import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';

import {
  scan as roverScan,
  connect as roverConnect,
  disconnect as roverDisconnect,
} from '@/actions/rover';
import {
  changeLeftSensorState as actionChangeLeftSensorState,
  changeRightSensorState as actionChangeRightSensorState,
} from '@/actions/sensor';
import RoverConnection from '@/components/RoverConnection';

const mapStateToProps = ({ rover }) => ({ ...rover });
const mapDispatchToProps = dispatch => ({
  changeLeftSensorState: state => dispatch(actionChangeLeftSensorState(state)),
  changeRightSensorState: state => dispatch(actionChangeRightSensorState(state)),
  connectToRover: (rover, onMessage) => dispatch(roverConnect(rover, onMessage)),
  disconnectFromRover: rover => dispatch(roverDisconnect(rover)),
  scanForRover: () => dispatch(roverScan()),
});

const RoverConnectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoverConnection);

export default hot(module)(RoverConnectionContainer);
