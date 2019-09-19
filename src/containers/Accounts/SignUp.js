import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router';
import {
  Form,
  Grid,
  Header,
  List,
  Message,
  Segment,
} from 'semantic-ui-react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

import { updateUser as actionUpdateUser } from '@/actions/user';

const mapDispatchToProps = dispatch => ({
  updateUser: data => dispatch(actionUpdateUser({ ...data, isSocial: false })),
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
      <Grid.Row>
        <Message negative>
          <List bulleted>
            {
              messages.map((message, i) => (
                <List.Item key={i}>
                  {message}
                </List.Item>
              ))
            }
          </List>
        </Message>
      </Grid.Row>
    );
  }

  signUp = () => {
    const { cookies, updateUser } = this.props;
    const {
      username,
      email,
      password1,
      password2,
    } = this.state;

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
      <Fragment>
        {
          success ? (
            <Redirect to="/" />
          ) : (null)
        }
        <Grid centered columns={16}>
          <Grid.Row>
            <Header size="huge">
              <FormattedMessage
                id="app.signup.header"
                description="Header for sign up"
                defaultMessage="Sign Up"
              />
            </Header>
          </Grid.Row>
          <Grid.Row>
            <p>
              <FormattedMessage
                id="app.signup.check_1"
                description="First part of Checking if the user already has an account"
                defaultMessage="Already have an account? Then please"
              />
              {' '}
              <a href="/accounts/login">
                <FormattedMessage
                  id="app.signup.check_2"
                  description="Second part of Checking if the user already has an account"
                  defaultMessage="sign in."
                />
              </a>
            </p>
          </Grid.Row>
          {this.errorMessage()}
          <Grid.Row>
            <Grid.Column width={4}>
              <Segment raised secondary>
                <Form floated="left" onSubmit={this.signUp}>
                  <Form.Input required icon="user" iconPosition="left" placeholder={usernamePlaceholder} onChange={this.handleUsernameChange} error={usernameError} />
                  <Form.Input required icon="mail" iconPosition="left" placeholder={emailPlaceholder} onChange={this.handleEmailChange} error={emailError} />
                  <Form.Input required icon="lock" iconPosition="left" type="password" placeholder={passwordPlaceholder} onChange={this.handlePassword1Change} error={password1Error} />
                  <Form.Input required icon="lock" iconPosition="left" type="password" placeholder={passwordPlaceholder} onChange={this.handlePassword2Change} error={password2Error} />
                  <Form.Button primary type="submit">
                    <FormattedMessage
                      id="app.signup.signup"
                      description="Button label for initiating sign up"
                      defaultMessage="Sign Up"
                    />
                  </Form.Button>
                </Form>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Fragment>
    );
  }
}

SignUp.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  updateUser: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default withCookies(injectIntl(connect(null, mapDispatchToProps)(SignUp)));
