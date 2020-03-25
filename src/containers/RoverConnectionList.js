import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';

import {
  changeActiveRover as actionChangeActiveRover,
  popCommand as actionPopCommand,
  fetchRovers,
  scan as roverScan,
  connect as roverConnect,
  disconnect as roverDisconnect,
} from '@/actions/rover';
import {
  changeLeftSensorState as actionChangeLeftSensorState,
  changeRightSensorState as actionChangeRightSensorState,
} from '@/actions/sensor';
import { checkAuthError, authHeader } from '@/actions/auth';
import RoverConnectionList from '@/components/RoverConnectionList';

const mapStateToProps = ({ rover }) => ({ ...rover });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchRovers: () => dispatch(fetchRovers(authHeader(cookies))).catch(checkAuthError(dispatch)),
  changeLeftSensorState: state => dispatch(actionChangeLeftSensorState(state)),
  changeRightSensorState: state => dispatch(actionChangeRightSensorState(state)),
  changeActiveRover: clientId => dispatch(actionChangeActiveRover(clientId)),
  popCommand: () => dispatch(actionPopCommand()),
  connectToRover: (rover, onMessage) => dispatch(roverConnect(rover, onMessage)),
  disconnectFromRover: rover => dispatch(roverDisconnect(rover)),
  scanForRover: () => dispatch(roverScan()),
});

const RoverConnectionListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoverConnectionList);

RoverConnectionListContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(RoverConnectionListContainer));
