import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Lock, Mail, Person } from '@material-ui/icons';
import {
  Button,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

import { updateUser as actionUpdateUser } from '@/actions/user';

const mapDispatchToProps = (dispatch) => ({
  updateUser: (data) => dispatch(actionUpdateUser({ ...data, isSocial: false })),
});

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password1: '',
      password2: '',
      usernameError: null,
      emailError: null,
      password1Error: null,
      password2Error: null,
      nonFieldError: null,
      success: false,
    };
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  }

  handlePassword1Change = (event) => {
    this.setState({
      password1: event.target.value,
    });
  }

  handlePassword2Change = (event) => {
    this.setState({
      password2: event.target.value,
    });
  }

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value,
    });
  }

  errorMessage = () => {
    const {
      usernameError,
      emailError,
      password1Error,
      password2Error,
      nonFieldError,
    } = this.state;

    const errors = [
      usernameError,
      emailError,
      password1Error,
      password2Error,
      nonFieldError,
    ];

    const activeErrors = errors.filter(Boolean);

    if (activeErrors.length === 0) {
      return (null);
    }

    const messages = [];

    activeErrors.forEach((error) => {
      error.forEach((message) => {
        messages.push(message);
      });
    });

    /* eslint react/no-array-index-key: 0 */
    return (
      <Grid item>
        <Alert variant="outlined" severity="error">
          <List dense>
            {
              messages.map((message, i) => (
                <ListItem key={i}>
                  <ListItemText>
                    {`- ${message}`}
                  </ListItemText>
                </ListItem>
              ))
            }
          </List>
        </Alert>
      </Grid>
    );
  }

  signUp = (e) => {
    const { cookies, updateUser } = this.props;
    const {
      username,
      email,
      password1,
      password2,
    } = this.state;

    e.preventDefault();

    return axios.post('/jwt/auth/registration/', {
      username,
      email,
      password1,
      password2,
    })
      .then((response) => {
        updateUser(jwtDecode(response.data.token));
        cookies.set('auth_jwt', response.data.token, { path: '/' });
        this.setState({
          success: true,
        });
      })
      .catch((error) => {
        this.setState({
          usernameError: error.response.data.username,
          emailError: error.response.data.email,
          password1Error: error.response.data.password1,
          password2Error: error.response.data.password2,
          nonFieldError: error.response.data.non_field_errors,
        });
      });
  }

  render() {
    const { intl } = this.props;
    const {
      success,
      usernameError,
      emailError,
      password1Error,
      password2Error,
    } = this.state;

    const passwordPlaceholder = intl.formatMessage({
      id: 'app.signup.password',
      description: 'Placeholder for password entry',
      defaultMessage: 'Password',
    });

    const usernamePlaceholder = intl.formatMessage({
      id: 'app.signup.username',
      description: 'Placeholder for username entry',
      defaultMessage: 'Username',
    });

    const emailPlaceholder = intl.formatMessage({
      id: 'app.signup.email',
      description: 'Placeholder for email entry',
      defaultMessage: 'Email',
    });

    return (
      <>
        {
          success ? (
            <Redirect to="/" />
          ) : (null)
        }
        <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
          <Grid item>
            <Typography variant="h4">
              <FormattedMessage
                id="app.signup.header"
                description="Header for sign up"
                defaultMessage="Sign Up"
              />
            </Typography>
          </Grid>
          <Grid item>
            <Typography>
              <FormattedMessage
                id="app.signup.check_1"
                description="First part of Checking if the user already has an account"
                defaultMessage="Already have an account? Then please"
              />
              {' '}
              <Link to="/accounts/login">
                <FormattedMessage
                  id="app.signup.check_2"
                  description="Second part of Checking if the user already has an account"
                  defaultMessage="sign in."
                />
              </Link>
            </Typography>
          </Grid>
          {this.errorMessage()}
          <Grid item>
            <form onSubmit={this.signUp}>
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
                  error={!!usernameError}
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
                        <Mail />
                      </InputAdornment>
                    ),
                  }}
                  placeholder={emailPlaceholder}
                  onChange={this.handleEmailChange}
                  error={!!emailError}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  required
                  type="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                  placeholder={passwordPlaceholder}
                  onChange={this.handlePassword1Change}
                  error={!!password1Error}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  required
                  type="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                  placeholder={passwordPlaceholder}
                  onChange={this.handlePassword2Change}
                  error={!!password2Error}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  <FormattedMessage
                    id="app.signup.signup"
                    description="Button label for initiating sign up"
                    defaultMessage="Sign Up"
                  />
                </Button>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </>
    );
  }
}

SignUp.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  updateUser: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default withCookies(injectIntl(connect(null, mapDispatchToProps)(SignUp)));
