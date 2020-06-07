import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';

import { changeExecutionState as actionChangeExecutionState } from '@/actions/code';
import { append } from '@/actions/console';
import {
  scan as roverScan,
  connect as roverConnect,
  disconnect as roverDisconnect,
} from '@/actions/rover';
import {
  changeLeftSensorState as actionChangeLeftSensorState,
  changeRightSensorState as actionChangeRightSensorState,
  changeLightSensorReadings as actionChangeLightSensorReadings,
  changeBatteryVoltageReading as actionChangeBatteryVoltageReading,
} from '@/actions/sensor';
import RoverConnection from '@/components/RoverConnection';

const mapStateToProps = ({ rover }) => ({ ...rover });
const mapDispatchToProps = (dispatch) => ({
  changeExecutionState: (state) => dispatch(actionChangeExecutionState(state)),
  changeLeftSensorState: (state) => dispatch(actionChangeLeftSensorState(state)),
  changeRightSensorState: (state) => dispatch(actionChangeRightSensorState(state)),
  changeLightSensorReadings: (leftReading, rightReading) => dispatch(
    actionChangeLightSensorReadings(leftReading, rightReading),
  ),
  changeBatteryVoltageReading: (voltageReading) => dispatch(
    actionChangeBatteryVoltageReading(voltageReading),
  ),
  connectToRover: (rover, onMessage) => dispatch(roverConnect(rover, onMessage)),
  disconnectFromRover: (rover) => dispatch(roverDisconnect(rover)),
  scanForRover: () => dispatch(roverScan()),
  write: (message) => dispatch(append(message)),
});

const RoverConnectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoverConnection);

export default hot(module)(RoverConnectionContainer);
