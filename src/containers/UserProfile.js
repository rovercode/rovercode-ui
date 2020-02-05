import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { createRover, fetchRovers, removeRover } from '../actions/rover';
import { checkAuthError, authHeader } from '../actions/auth';
import UserProfile from '../components/UserProfile';

const mapStateToProps = ({ rover }) => ({ ...rover });
const mapDispatchToProps = (dispatch, { cookies }) => ({
});

const UserProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProfile);

UserProfileContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(UserProfileContainer));
