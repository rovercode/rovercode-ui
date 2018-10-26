import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

const mapStateToProps = ({ user }) => ({ user });

class ProtectedRoute extends Component {
  isAuthenticated = () => {
    const { user } = this.props;

    if (user.exp) {
      if (moment().isAfter(moment.unix(user.exp))) {
        return false;
      }
      return true;
    }

    return false;
  }

  render() {
    const { component: Component, ...rest } = this.props;

    return (
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
    );
  }
}

ProtectedRoute.propTypes = {
  user: PropTypes.shape({
    exp: PropTypes.number,
  }).isRequired,
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

export default connect(mapStateToProps)(ProtectedRoute);
