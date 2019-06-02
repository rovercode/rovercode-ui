import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';

import {
  changeActiveRover as actionChangeActiveRover,
  popCommand as actionPopCommand,
  fetchRovers,
} from '@/actions/rover';
import {
  changeLeftSensorState as actionChangeLeftSensorState,
  changeRightSensorState as actionChangeRightSensorState,
} from '@/actions/sensor';
import { updateValidAuth } from '@/actions/auth';
import RoverConnectionList from '@/components/RoverConnectionList';

const mapStateToProps = ({ rover }) => ({ ...rover });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchRovers: () => {
    const fetchRoversAction = fetchRovers({
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(fetchRoversAction).catch((error) => {
      if (error.response.status === 401) {
        // Authentication is no longer valid
        dispatch(updateValidAuth(false));
      }
    });
  },
  changeLeftSensorState: state => dispatch(actionChangeLeftSensorState(state)),
  changeRightSensorState: state => dispatch(actionChangeRightSensorState(state)),
  changeActiveRover: clientId => dispatch(actionChangeActiveRover(clientId)),
  popCommand: () => dispatch(actionPopCommand()),
});

const RoverConnectionListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoverConnectionList);

RoverConnectionListContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(RoverConnectionListContainer));
