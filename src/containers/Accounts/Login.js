import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { GitHub, Lock, Person } from '@material-ui/icons';
import {
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Link,
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
        updateUser(jwtDecode(response.data.access));
        cookies.set('auth_jwt', response.data.access, { path: '/' });
        cookies.set('refresh_jwt', response.data.refresh, { path: '/' });
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
    const { location } = this.props;

    const next = location && location.state && location.state.next ? location.state.next : null;
    const service = element.target.parentNode.id || element.target.id;
    return axios.post(`/jwt/auth/social/${service}/auth-server/`, null, { params: { ...(next && { next }) } })
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
        color: theme.palette.getContrastText(grey[300]),
        backgroundColor: grey[300],
        '&:hover': {
          backgroundColor: grey[500],
        },
      },
    }))(Button);

    return (
      <>
        {
          basicSuccess ? (
            <Redirect to={{
              pathname: location && location.state && location.state.next ? location.state.next : '/',
            }}
            />
          ) : (null)
        }
        <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
          <Grid item>
            <Typography variant="h6">
              <FormattedMessage
                id="app.login.login"
                description="Explains the need for making an account"
                defaultMessage="Welcome! To use Rovercode, you need an account for saving and sharing your work."
              />
            </Typography>
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
                  <Typography>
                    <FormattedMessage
                      id="app.login.social_contact_1"
                      description="First part of instructions for contacting support"
                      defaultMessage="Contact"
                    />
                    {' '}
                    <Link href="mailto:support@rovercode.com">
                      support@rovercode.com
                    </Link>
                    {' '}
                    <FormattedMessage
                      id="app.login.social_contact_2"
                      description="Second part of instructions for contacting support"
                      defaultMessage="for help with this issue."
                    />
                  </Typography>
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
                  <Typography>
                    {location.state.callbackError}
                  </Typography>
                </Alert>
              </Grid>
            ) : (null)
          }
          <Grid item container direction="row" justify="center" alignItems="center" spacing={4}>
            <Grid item>
              <GoogleButton
                id="google"
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                onClick={this.redirectToSocial}
              >
                <FormattedMessage
                  id="app.login.button_google"
                  description="Button label for Google sign in"
                  defaultMessage="Sign up or sign in with Google"
                />
              </GoogleButton>
            </Grid>
            <Grid item>
              <GitHubButton
                id="github"
                variant="contained"
                startIcon={<GitHub />}
                onClick={this.redirectToSocial}
              >
                <FormattedMessage
                  id="app.login.button_github"
                  description="Button label for GitHub sign in"
                  defaultMessage="Sign up or sign in with GitHub"
                />
              </GitHubButton>
            </Grid>
          </Grid>
          <Grid item>
            <Typography>
              <FormattedMessage
                id="app.login.social_question"
                description="Asks the user if he/she has a social account for sign in"
                defaultMessage="Don't have any of those accounts?"
              />
            </Typography>
          </Grid>
          <Grid item>
            <Button
              size="large"
              variant="contained"
              disableElevation
              color="primary"
              component={RouterLink}
              to="/accounts/signup"
            >
              <FormattedMessage
                id="app.login.create"
                description="Directs the user to create an account"
                defaultMessage="Create a Rovercode account"
              />
            </Button>
          </Grid>
          <Grid item>
            <Typography>
              <FormattedMessage
                id="app.login.account_question"
                description="Asks the user if he/she has an account"
                defaultMessage="Already have a Rovercode account? Sign in here:"
              />
            </Typography>
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
            <Link component={RouterLink} to="/accounts/reset">
              <Typography>
                <FormattedMessage
                  id="app.login.forgot"
                  description="Button label for initiating forgot password"
                  defaultMessage="Forgot Password?"
                />
              </Typography>
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
      next: null,
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
      next: PropTypes.string,
    }),
  }),
};

export default withCookies(injectIntl(connect(null, mapDispatchToProps)(Login)));
