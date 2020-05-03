import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Lock } from '@material-ui/icons';
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
import PropTypes from 'prop-types';
import axios from 'axios';

class PasswordResetCallback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password1: '',
      password2: '',
      password1Error: null,
      password2Error: null,
      tokenError: null,
      uidError: null,
      success: false,
    };
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

  errorMessage = () => {
    const {
      password1Error,
      password2Error,
      tokenError,
      uidError,
    } = this.state;

    const errors = [
      password1Error,
      password2Error,
      tokenError,
      uidError,
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

  confirm = (e) => {
    const { match } = this.props;
    const { password1, password2 } = this.state;

    e.preventDefault();

    return axios.post('/jwt/auth/password/reset/confirm/', {
      uid: match.params.uid,
      token: match.params.token,
      new_password1: password1,
      new_password2: password2,
    })
      .then(() => {
        this.setState({
          success: true,
        });
      })
      .catch((error) => {
        this.setState({
          password1Error: error.response.data.new_password1,
          password2Error: error.response.data.new_password2,
          tokenError: error.response.data.token,
          uidError: error.response.data.uid,
        });
      });
  }

  render() {
    const { intl } = this.props;
    const {
      success,
      password1Error,
      password2Error,
    } = this.state;

    const passwordPlaceholder = intl.formatMessage({
      id: 'app.password_reset_callback.password',
      description: 'Placeholder for password entry',
      defaultMessage: 'Password',
    });

    return (
      <>
        {
          success ? (
            <Redirect to="/accounts/login" />
          ) : (null)
        }
        <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
          <Grid item>
            <Typography variant="h4">
              <FormattedMessage
                id="app.password_reset_callback.header"
                description="Header for password reset"
                defaultMessage="Password Reset"
              />
            </Typography>
          </Grid>
          <Grid item>
            <FormattedMessage
              id="app.password_reset_callback.new_password"
              description="Directs the user to enter a new password"
              defaultMessage="Enter a new password for your account below."
            />
          </Grid>
          {this.errorMessage()}
          <Grid item>
            <form onSubmit={this.confirm}>
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
                    id="app.password_reset_callback.set"
                    description="Button label for initiating set password"
                    defaultMessage="Set Password"
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

PasswordResetCallback.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      uid: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(PasswordResetCallback);
