import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router';
import { Loader } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';

import { updateUser as actionUpdateUser } from '@/actions/user';

const mapDispatchToProps = dispatch => ({
  updateUser: data => dispatch(actionUpdateUser(data)),
});

class LoginCallback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loginSuccess: false,
    };
  }

  componentDidMount() {
    const {
      cookies, location, match, updateUser,
    } = this.props;
    const queryParams = queryString.parse(location.search);

    return axios.post(`/jwt/auth/social/${match.params.service}/login/`, {
      code: queryParams.code,
      state: queryParams.state,
    })
      .then((response) => {
        updateUser(jwtDecode(response.data.token));
        cookies.set('auth_jwt', response.data.token, { path: '/' });
        this.setState({
          loading: false,
          loginSuccess: true,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
          loginSuccess: false,
        });
      });
  }

  redirect = () => {
    const { loading, loginSuccess } = this.state;

    if (loading) {
      return <Loader content="Logging in..." />;
    }

    if (loginSuccess) {
      return <Redirect to="/" />;
    }

    return <Redirect to="/accounts/login" />;
  }

  render() {
    return (
      <Fragment>
        { this.redirect() }
      </Fragment>
    );
  }
}

LoginCallback.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      service: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default withCookies(connect(null, mapDispatchToProps)(LoginCallback));
