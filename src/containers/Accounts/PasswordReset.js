import React, { Component } from 'react';
import { Mail } from '@material-ui/icons';
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
import axios from 'axios';
import PropTypes from 'prop-types';

class PasswordReset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailError: null,
      success: '',
    };
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  }

  errorMessage = () => {
    const { emailError } = this.state;

    if (emailError === null) {
      return (null);
    }

    /* eslint react/no-array-index-key: 0 */
    return (
      <Grid item>
        <Alert variant="outlined" severity="error">
          <List dense>
            {
              emailError.map((error, i) => (
                <ListItem key={i}>
                  <ListItemText>
                    {`- ${error}`}
                  </ListItemText>
                </ListItem>
              ))
            }
          </List>
        </Alert>
      </Grid>
    );
  }

  reset = (e) => {
    const { email } = this.state;

    e.preventDefault();

    return axios.post('/jwt/auth/password/reset/', {
      email,
    })
      .then((response) => {
        this.setState({
          success: response.data.detail,
          emailError: null,
        });
      })
      .catch((error) => {
        this.setState({
          success: '',
          emailError: error.response.data.email,
        });
      });
  }

  render() {
    const { intl } = this.props;
    const { success, emailError } = this.state;

    const emailPlaceholder = intl.formatMessage({
      id: 'app.password_reset.email_placeholder',
      description: 'Placeholder for email entry',
      defaultMessage: 'Email',
    });

    return (
      <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
        <Grid item>
          <Typography variant="h4">
            <FormattedMessage
              id="app.password_reset.header"
              description="Header for password reset"
              defaultMessage="Password Reset"
            />
          </Typography>
        </Grid>
        <Grid item>
          <FormattedMessage
            id="app.password_reset.verify"
            description="Verifies that the user has forgotten password"
            defaultMessage="Forgotten your password?"
          />
        </Grid>
        <Grid item>
          <FormattedMessage
            id="app.password_reset.email"
            description="Directs the user to enter e-mail for password reset"
            defaultMessage="Enter your e-mail address below, and well send you an e-mail allowing you to reset it."
          />
        </Grid>
        {
          success ? (
            <Alert variant="outlined" severity="success">
              { success }
            </Alert>
          ) : (null)
        }
        {this.errorMessage()}
        <Grid item>
          <form onSubmit={this.reset}>
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
              <Button variant="contained" color="primary" type="submit">
                <FormattedMessage
                  id="app.password_reset.reset"
                  description="Button label for initiating reset password"
                  defaultMessage="Reset Password"
                />
              </Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
    );
  }
}

PasswordReset.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(PasswordReset);
