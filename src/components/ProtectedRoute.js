import React, { Component, Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { logout as actionLogout } from '@/actions/auth';
import TopNav from './TopNav';

const mapStateToProps = ({ auth, user }) => ({ auth, user });
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(actionLogout()),
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

  render() {
    const { component: Component, user, ...rest } = this.props;
    return (
      <Fragment>
        <TopNav userName={user.username} />
        <Route
          {...rest}
          render={props => (
            this.isAuthenticated() ? (
              <Component {...props} />
            ) : (
              <Redirect to="/accounts/login" />
            )
          )}
        />
      </Fragment>
    );
  }
}

ProtectedRoute.propTypes = {
  auth: PropTypes.shape({
    isValidAuth: PropTypes.bool,
  }).isRequired,
  user: PropTypes.shape({
    exp: PropTypes.number,
  }).isRequired,
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  logout: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
