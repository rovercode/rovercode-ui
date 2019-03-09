import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { editUserPassword, editUserUsername } from '@/actions/user';
import { updateValidAuth } from '@/actions/auth';
import UserSetting from '@/components/UserSetting';

const mapStateToProps = ({ user }) => ({ user });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  editUserUsername: (username) => {
    const editUserUsernameAction = editUserUsername(username, {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(editUserUsernameAction).catch((error) => {
      if (error.response.status === 401) {
        // Authentication is no longer valid
        return dispatch(updateValidAuth(false));
      }
      throw error;
    });
  },
  editUserPassword: (password) => {
    const editUserPasswordAction = editUserPassword(password, {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(editUserPasswordAction).catch((error) => {
      if (error.response.status === 401) {
        // Authentication is no longer valid
        return dispatch(updateValidAuth(false));
      }
      throw error;
    });
  },
});

const UserSettingContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserSetting);

UserSettingContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(UserSettingContainer));
