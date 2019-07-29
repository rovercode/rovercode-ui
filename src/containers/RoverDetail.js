import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { editRover, fetchRover } from '../actions/rover';
import { checkAuthError, authHeader } from '../actions/auth';
import RoverDetail from '../components/RoverDetail';

const mapStateToProps = ({ rover }) => ({ ...rover });
const mapDispatchToProps = (dispatch, { cookies, match }) => ({
  id: parseInt(match.params.id, 10),
  editRover: (id, settings) => dispatch(editRover(id, settings, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  fetchRover: id => dispatch(fetchRover(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
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
