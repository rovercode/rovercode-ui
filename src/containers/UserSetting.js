import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { editUserPassword, editUserUsername } from '@/actions/user';
import { checkAuthError, authHeader } from '@/actions/auth';
import UserSetting from '@/components/UserSetting';

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  editUserUsername: (username) => dispatch(editUserUsername(username, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  editUserPassword: (password) => dispatch(editUserPassword(password, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
});

const UserSettingContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSetting);

UserSettingContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(UserSettingContainer));
