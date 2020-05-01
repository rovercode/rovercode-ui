import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { GitHub, Lock, Person } from '@material-ui/icons';
import {
  Button,
  Container,
  Grid,
  InputAdornment,
  Link,
  TextField,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { grey, red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import axios from 'axios';
import URL from 'url-parse';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';

import { updateValidAuth as actionUpdateValidAuth } from '@/actions/auth';
import { updateUser as actionUpdateUser } from '@/actions/user';

const mapDispatchToProps = (dispatch) => ({
  updateUser: (data) => dispatch(actionUpdateUser({ ...data, isSocial: false })),
  updateValidAuth: (isValidAuth) => dispatch(actionUpdateValidAuth(isValidAuth)),
});

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socialError: false,
      basicError: false,
      basicSuccess: false,
      username: '',
      password: '',
    };
  }

  basicLogin = (e) => {
    const { cookies, updateUser, updateValidAuth } = this.props;
    const { username, password } = this.state;

    e.preventDefault();

    return axios.post('/api/api-token-auth/', {
      username,
      password,
    })
      .then((response) => {
        updateUser(jwtDecode(response.data.token));
        cookies.set('auth_jwt', response.data.token, { path: '/' });
        updateValidAuth(true);
        this.setState({
          basicSuccess: true,
        });
      })
      .catch(() => {
        this.setState({
          basicError: true,
        });
      });
  }

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  }

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value,
    });
  }

  redirectToSocial = (element) => {
    const service = element.target.parentNode.id || element.target.id;
    return axios.post(`/jwt/auth/social/${service}/auth-server/`)
      .then((response) => {
        const url = URL(response.data.url);
        const parsed = queryString.parse(url.query);
        const redirectUrl = URL(parsed.redirect_uri);
        redirectUrl.set('pathname', `/accounts/login/callback/${service}`);
        parsed.redirect_uri = redirectUrl.toString();
        url.query = queryString.stringify(parsed);
        window.location.assign(url.toString());
      })
      .catch(() => {
        this.setState({
          socialError: true,
        });
      });
  }

  render() {
    const { intl, location } = this.props;
    const { basicError, basicSuccess, socialError } = this.state;

    const usernamePlaceholder = intl.formatMessage({
      id: 'app.login.username',
      description: 'Placeholder for username entry',
      defaultMessage: 'Username',
    });

    const passwordPlaceholder = intl.formatMessage({
      id: 'app.login.password',
      description: 'Placeholder for password entry',
      defaultMessage: 'Password',
    });

    const GoogleButton = withStyles((theme) => ({
      root: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        '&:hover': {
          backgroundColor: red[700],
        },
      },
    }))(Button);

    const GitHubButton = withStyles((theme) => ({
      root: {
        color: theme.palette.getContrastText(grey[500]),
        backgroundColor: grey[500],
        '&:hover': {
          backgroundColor: grey[700],
        },
      },
    }))(Button);

    return (
      <>
        {
          basicSuccess ? (
            <Redirect to="/" />
          ) : (null)
        }
        <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
          <Grid item>
            <p>
              <FormattedMessage
                id="app.login.social"
                description="Notifies the user of third-party account access"
                defaultMessage="You can sign up / sign in with one of your existing third-party accounts."
              />
            </p>
          </Grid>
          {
            socialError ? (
              <Grid item>
                <Alert variant="outlined" severity="error">
                  <AlertTitle>
                    <FormattedMessage
                      id="app.login.social_error"
                      description="Notifies the user of an error in third-party authentication"
                      defaultMessage="There was an error initiating social login."
                    />
                  </AlertTitle>
                  <p>
                    <FormattedMessage
                      id="app.login.social_contact_1"
                      description="First part of instructions for contacting support"
                      defaultMessage="Contact"
                    />
                    {' '}
                    <a href="mailto:support@rovercode.com">
                      support@rovercode.com
                    </a>
                    {' '}
                    <FormattedMessage
                      id="app.login.social_contact_2"
                      description="Second part of instructions for contacting support"
                      defaultMessage="for help with this issue."
                    />
                  </p>
                </Alert>
              </Grid>
            ) : (null)
          }
          {
            location && location.state && location.state.callbackError ? (
              <Grid item>
                <Alert variant="outlined" severity="error">
                  <AlertTitle>
                    <FormattedMessage
                      id="app.login.social_callback_error"
                      description="Notifies the user of an error in third-party registration"
                      defaultMessage="There was an error creating an account using social provider."
                    />
                  </AlertTitle>
                  <p>
                    {location.state.callbackError}
                  </p>
                </Alert>
              </Grid>
            ) : (null)
          }
          <Grid item container direction="row">
            <Grid item xs>
              <GoogleButton
                id="google"
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                onClick={this.redirectToSocial}
              >
                <FormattedMessage
                  id="app.login.button_google"
                  description="Button label for Google sign in"
                  defaultMessage="Sign in with Google"
                />
              </GoogleButton>
            </Grid>
            <Grid item xs>
              <GitHubButton
                id="github"
                variant="contained"
                startIcon={<GitHub />}
                onClick={this.redirectToSocial}
              >
                <FormattedMessage
                  id="app.login.button_github"
                  description="Button label for GitHub sign in"
                  defaultMessage="Sign in with GitHub"
                />
              </GitHubButton>
            </Grid>
          </Grid>
          <Grid item>
            <p>
              <FormattedMessage
                id="app.login.social_question"
                description="Asks the user if he/she has a social account for sign in"
                defaultMessage="Don't have any of those accounts?"
              />
              {' '}
              <a href="/accounts/signup">
                <FormattedMessage
                  id="app.login.create"
                  description="Directs the user to create an account"
                  defaultMessage="Create a rovercode account."
                />
              </a>
            </p>
          </Grid>
          <Grid item>
            <p>
              <FormattedMessage
                id="app.login.account_question"
                description="Asks the user if he/she has an account"
                defaultMessage="Already have a rovercode account? Sign in here:"
              />
            </p>
          </Grid>
          {
            basicError ? (
              <Grid item>
                <Alert variant="outlined" severity="error">
                  <AlertTitle>
                    <FormattedMessage
                      id="app.login.invalid"
                      description="Indicates that the username or password is incorrect"
                      defaultMessage="Invalid username or password."
                    />
                  </AlertTitle>
                </Alert>
              </Grid>
            ) : (null)
          }
          <form onSubmit={this.basicLogin}>
            <Container>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  placeholder={usernamePlaceholder}
                  onChange={this.handleUsernameChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                  type="password"
                  placeholder={passwordPlaceholder}
                  onChange={this.handlePasswordChange}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  <FormattedMessage
                    id="app.login.sign_in"
                    description="Button label for initiating sign in"
                    defaultMessage="Sign In"
                  />
                </Button>
              </Grid>
            </Container>
          </form>
          <Grid item>
            <Link href="/accounts/reset">
              <FormattedMessage
                id="app.login.forgot"
                description="Button label for initiating forgot password"
                defaultMessage="Forgot Password?"
              />
            </Link>
          </Grid>
        </Grid>
      </>
    );
  }
}

Login.defaultProps = {
  location: {
    state: {
      callbackError: null,
    },
  },
};

Login.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  updateUser: PropTypes.func.isRequired,
  updateValidAuth: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      callbackError: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

export default withCookies(injectIntl(connect(null, mapDispatchToProps)(Login)));
