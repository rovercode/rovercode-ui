import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import PropTypes from 'prop-types';
import moment from 'moment';
import { logout as actionLogout } from '@/actions/auth';
import { clearNotification as actionClearNotification } from '@/actions/notification';
import TopNav from './TopNav';

const mapStateToProps = ({ auth, notification, user }) => ({ auth, notification, user });
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(actionLogout()),
  clearNotification: () => dispatch(actionClearNotification()),
});

class ProtectedRoute extends Component {
  isAuthenticated = () => {
    const { auth, logout, user } = this.props;

    if (!auth.isValidAuth) {
      logout();
      return false;
    }

    if (user.exp) {
      if (moment().isAfter(moment.unix(user.exp))) {
        logout();
        return false;
      }
      return true;
    }

    return false;
  }

  handleClose = (event, reason) => {
    const { clearNotification } = this.props;

    if (reason === 'clickaway') {
      return;
    }

    clearNotification();
  }

  render() {
    const {
      component: Component,
      notification,
      user,
      ...rest
    } = this.props;
    return (
      <>
        <TopNav userName={user.username} />
        <Route
          {...rest}
          render={(props) => (
            this.isAuthenticated() ? (
              <Component {...props} />
            ) : (
              <Redirect to="/accounts/login" />
            )
          )}
        />
        <Snackbar
          open={!!notification.message}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={notification.duration}
          onClose={this.handleClose}
        >
          <Alert onClose={this.handleClose} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </>
    );
  }
}


ProtectedRoute.propTypes = {
  auth: PropTypes.shape({
    isValidAuth: PropTypes.bool,
  }).isRequired,
  notification: PropTypes.shape({
    message: PropTypes.string,
    duration: PropTypes.number,
    severity: PropTypes.string,
  }).isRequired,
  user: PropTypes.shape({
    exp: PropTypes.number,
    username: PropTypes.string,
  }).isRequired,
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  logout: PropTypes.func.isRequired,
  clearNotification: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
