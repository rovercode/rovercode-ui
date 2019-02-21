import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { editRover, fetchRover } from '../actions/rover';
import { updateValidAuth } from '../actions/auth';
import RoverDetail from '../components/RoverDetail';

const mapStateToProps = ({ rover }) => ({ ...rover });
const mapDispatchToProps = (dispatch, { cookies, match }) => ({
  id: parseInt(match.params.id, 10),
  editRover: (id, settings) => {
    const editRoverAction = editRover(id, settings, {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(editRoverAction).catch((error) => {
      if (error.response.status === 401) {
        // Authentication is no longer valid
        dispatch(updateValidAuth(false));
      }
    });
  },
  fetchRover: (id) => {
    const fetchRoverAction = fetchRover(id, {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(fetchRoverAction).catch((error) => {
      if (error.response.status === 401) {
        // Authentication is no longer valid
        dispatch(updateValidAuth(false));
      }
    });
  },
});

const RoverDetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoverDetail);

RoverDetailContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default hot(module)(withCookies(RoverDetailContainer));
