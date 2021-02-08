import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { CircularProgress, Grid, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import axios from 'axios';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';

import { updateValidAuth as actionUpdateValidAuth } from '@/actions/auth';
import { updateUser as actionUpdateUser } from '@/actions/user';

const mapDispatchToProps = (dispatch) => ({
  updateUser: (data) => dispatch(actionUpdateUser({ ...data, isSocial: true })),
  updateValidAuth: (isValidAuth) => dispatch(actionUpdateValidAuth(isValidAuth)),
});

class LoginCallback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loginSuccess: false,
      error: null,
    };
  }

  componentDidMount() {
    const {
      cookies, location, match, updateUser, updateValidAuth,
    } = this.props;
    const queryParams = queryString.parse(location.search);

    return axios.post(`/jwt/auth/social/${match.params.service}/login/`, {
      code: queryParams.code,
      state: queryParams.state,
    })
      .then((response) => {
        updateUser(jwtDecode(response.data.access_token));
        cookies.set('auth_jwt', response.data.access_token, { path: '/' });
        updateValidAuth(true);
        this.setState({
          loading: false,
          loginSuccess: true,
        });
      })
      .catch((error) => {
        let errorMessage = null;
        if (error.response && error.response.data) {
          errorMessage = error.response.data.non_field_errors;
        }
        this.setState({
          loading: false,
          loginSuccess: false,
          error: errorMessage,
        });
      });
  }

  redirect = () => {
    const { error, loading, loginSuccess } = this.state;

    if (loading) {
      return (
        <>
          <Grid container direction="column" justify="center" alignItems="center">
            <Typography variant="h4">
              <FormattedMessage
                id="app.login_callback.logging_in"
                description="Shows the user that the application is logging in"
                defaultMessage="Logging in..."
              />
            </Typography>
            <CircularProgress />
          </Grid>
        </>
      );
    }

    if (loginSuccess) {
      return <Redirect to="/" />;
    }

    return (
      <Redirect to={{
        pathname: '/accounts/login',
        state: { callbackError: error },
      }}
      />
    );
  }

  render() {
    return (
      <>
        { this.redirect() }
      </>
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
  updateValidAuth: PropTypes.func.isRequired,
};

export default withCookies(connect(null, mapDispatchToProps)(LoginCallback));
