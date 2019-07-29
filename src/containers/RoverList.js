import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { createRover, fetchRovers, removeRover } from '../actions/rover';
import { checkAuthError, authHeader } from '../actions/auth';
import RoverList from '../components/RoverList';

const mapStateToProps = ({ rover }) => ({ ...rover });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchRovers: (page) => {
    const xhrOptions = authHeader(cookies);

    if (page) {
      xhrOptions.params = { page };
    }

    return dispatch(fetchRovers(xhrOptions)).catch(checkAuthError(dispatch));
  },
  createRover: settings => dispatch(createRover(settings, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  removeRover: id => dispatch(removeRover(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
});

const RoverListContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoverList);

RoverListContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(RoverListContainer));
