import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Lock, Person, Settings } from '@material-ui/icons';
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';

import PlanClass from '@/components/PlanClass';
import PlanFree from '@/components/PlanFree';
import PlanIndividual from '@/components/PlanIndividual';
import PlanItem from '@/components/PlanItem';

class UserSetting extends Component {
  constructor(props) {
    super(props);

    const { user } = props;

    this.state = {
      username: user.username,
      password1: null,
      password2: null,
      saveSuccess: false,
      usernameError: null,
      password1Error: null,
      password2Error: null,
      nonFieldError: null,
    };
  }

  componentDidMount() {
    const { fetchSubscription, user } = this.props;

    fetchSubscription(user.user_id);
  }

  errorMessage = () => {
    const {
      usernameError,
      password1Error,
      password2Error,
      nonFieldError,
    } = this.state;

    const errors = [
      usernameError,
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

  saveUserUsername = (e) => {
    const { editUserUsername } = this.props;
    const { username } = this.state;

    e.preventDefault();

    return editUserUsername(username)
      .then(() => this.setState({ saveSuccess: true }))
      .catch((error) => this.setState({ usernameError: error.response.data.username }));
  }

  saveUserPassword = (e) => {
    const { editUserPassword, intl } = this.props;
    const { password1, password2 } = this.state;

    e.preventDefault();

    const passwordMatch = intl.formatMessage({
      id: 'app.user_setting.match',
      description: 'Error message indicating both passwords must match',
      defaultMessage: 'Passwords must match',
    });

    if (password1 !== password2) {
      this.setState({
        password1Error: [passwordMatch],
        password2Error: [passwordMatch],
      });
      return null;
    }

    return editUserPassword(password1)
      .then(() => this.setState({ saveSuccess: true }))
      .catch((error) => {
        this.setState({
          password1Error: error.response.data.new_password1,
          password2Error: error.response.data.new_password2,
        });
      });
  }

  handleChange = (event) => this.setState({ [event.target.name]: event.target.value })

  render() {
    const {
      isFetching,
      intl,
      refreshSession,
      subscription,
      upgradeError,
      upgradeSubscription,
      user,
    } = this.props;
    const {
      saveSuccess,
      usernameError,
      password1Error,
      password2Error,
    } = this.state;

    const usernameLabel = intl.formatMessage({
      id: 'app.user_setting.username',
      description: 'Label for username entry',
      defaultMessage: 'Username:',
    });

    const passwordLabel = intl.formatMessage({
      id: 'app.user_setting.password',
      description: 'Label for password entry',
      defaultMessage: 'New Password:',
    });

    const verifyLabel = intl.formatMessage({
      id: 'app.user_setting.verify',
      description: 'Label for password verify entry',
      defaultMessage: 'Verify:',
    });

    return (
      <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
        {
          saveSuccess ? (
            <Redirect to="/accounts/login" />
          ) : (null)
        }
        <Grid item container direction="row" justify="center" alignItems="center" spacing={2}>
          <Grid item>
            <Settings fontSize="large" />
          </Grid>
          <Grid item>
            <Typography variant="h3">
              <FormattedMessage
                id="app.user_setting.header"
                description="Header for the user's settings"
                defaultMessage="My Settings"
              />
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Alert severity="info">
            <FormattedMessage
              id="app.user_setting.info"
              description="Notifies the user that changing settings requires signing back in"
              defaultMessage="Changing any of these settings requires signing back in."
            />
          </Alert>
        </Grid>
        {this.errorMessage()}
        <Grid item>
          <Box p={3} border={1} borderRadius="borderRadius" boxShadow={3} borderColor="grey.500">
            <Grid item container direction="row" justify="center" alignItems="center" spacing={1}>
              <Grid item>
                <Person fontSize="large" />
              </Grid>
              <Grid item>
                <Typography variant="h5">
                  <FormattedMessage
                    id="app.user_setting.username_header"
                    description="Header for changing username"
                    defaultMessage="Change Username"
                  />
                </Typography>
              </Grid>
            </Grid>
            <form key={user.user_id} onSubmit={this.saveUserUsername}>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="dense"
                  label={usernameLabel}
                  name="username"
                  error={!!usernameError}
                  defaultValue={user.username}
                  onChange={this.handleChange}
                  required
                />
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
                  <FormattedMessage
                    id="app.user_setting.save_username"
                    description="Button label to save username settings"
                    defaultMessage="Save"
                  />
                </Button>
              </Grid>
            </form>
          </Box>
        </Grid>
        {
          !user.isSocial ? (
            <>
              <Grid item>
                <Box p={3} border={1} borderRadius="borderRadius" boxShadow={3} borderColor="grey.500">
                  <Grid item container direction="row" justify="center" alignItems="center" spacing={1}>
                    <Grid item>
                      <Lock fontSize="large" />
                    </Grid>
                    <Grid item>
                      <Typography variant="h5">
                        <FormattedMessage
                          id="app.user_setting.password_header"
                          description="Header for changing password"
                          defaultMessage="Change Password"
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                  <form key={user.user_id} onSubmit={this.saveUserPassword}>
                    <Grid item container direction="row" spacing={1}>
                      <Grid item>
                        <TextField
                          variant="outlined"
                          margin="dense"
                          label={passwordLabel}
                          name="password1"
                          error={!!password1Error}
                          onChange={this.handleChange}
                          type="password"
                          required
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          variant="outlined"
                          margin="dense"
                          label={verifyLabel}
                          name="password2"
                          error={!!password2Error}
                          onChange={this.handleChange}
                          type="password"
                          required
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" color="primary" type="submit">
                        <FormattedMessage
                          id="app.user_setting.save_password"
                          description="Button label to save password settings"
                          defaultMessage="Save"
                        />
                      </Button>
                    </Grid>
                  </form>
                </Box>
              </Grid>
            </>
          ) : (null)
        }
        <Grid item>
          <Typography variant="h4">
            <FormattedMessage
              id="app.user_setting.plans"
              description="Header for list of plans"
              defaultMessage="Plans"
            />
          </Typography>
        </Grid>
        <Grid item container direction="row" justify="center" alignItems="flex-start" spacing={1}>
          {
          isFetching ? (
            <>
              <Grid item>
                <Skeleton animation="wave" width={300} height={200} />
              </Grid>
              <Grid item>
                <Skeleton animation="wave" width={300} height={200} />
              </Grid>
              <Grid item>
                <Skeleton animation="wave" width={300} height={200} />
              </Grid>
            </>
          ) : (
            <>
              <Grid item>
                <PlanItem title="Free Plan" active={!subscription.plan || subscription.plan === '1'}>
                  <PlanFree freeSlots={8} />
                </PlanItem>
              </Grid>
              <Grid item>
                <PlanItem title="Individual Plan" active={subscription.plan === '3'}>
                  <PlanIndividual />
                </PlanItem>
              </Grid>
              <Grid item>
                <PlanItem title="Class Plan" active={subscription.plan === '2'}>
                  <PlanClass
                    active={subscription.plan === '2'}
                    error={upgradeError ? upgradeError.response.data.accessCode[0] : null}
                    expires={moment.unix(subscription.start).add(1, 'year').unix()}
                    maxLength={8}
                    refreshSession={refreshSession}
                    upgradeSubscription={upgradeSubscription}
                    userId={user.user_id}
                  />
                </PlanItem>
              </Grid>
            </>
          )
        }
        </Grid>
      </Grid>
    );
  }
}

UserSetting.defaultProps = {
  subscription: {
    plan: '',
    price: 0,
    interval: '',
    start: 0,
  },
  upgradeError: null,
};

UserSetting.propTypes = {
  editUserUsername: PropTypes.func.isRequired,
  editUserPassword: PropTypes.func.isRequired,
  fetchSubscription: PropTypes.func.isRequired,
  refreshSession: PropTypes.func.isRequired,
  upgradeSubscription: PropTypes.func.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    isSocial: PropTypes.bool.isRequired,
  }).isRequired,
  subscription: PropTypes.shape({
    plan: PropTypes.string,
    price: PropTypes.number,
    interval: PropTypes.string,
    start: PropTypes.number,
  }),
  isFetching: PropTypes.bool.isRequired,
  upgradeError: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(UserSetting);
