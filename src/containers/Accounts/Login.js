import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router';
import {
  Button,
  Form,
  Grid,
  Icon,
  Message,
  Segment,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import axios from 'axios';
import URL from 'url-parse';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';

import { updateValidAuth as actionUpdateValidAuth } from '@/actions/auth';
import { updateUser as actionUpdateUser } from '@/actions/user';

const mapDispatchToProps = dispatch => ({
  updateUser: data => dispatch(actionUpdateUser({ ...data, isSocial: false })),
  updateValidAuth: isValidAuth => dispatch(actionUpdateValidAuth(isValidAuth)),
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

  basicLogin = () => {
    const { cookies, updateUser, updateValidAuth } = this.props;
    const { username, password } = this.state;

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
    const service = element.target.id;
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
    const { intl } = this.props;
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

    return (
      <Fragment>
        {
          basicSuccess ? (
            <Redirect to="/" />
          ) : (null)
        }
        <Grid centered columns={16}>
          <Grid.Row>
            <p>
              <FormattedMessage
                id="app.login.social"
                description="Notifies the user of third-party account access"
                defaultMessage="You can sign up / sign in with one of your existing third-party accounts."
              />
            </p>
          </Grid.Row>
          {
            socialError ? (
              <Grid.Row>
                <Message negative>
                  <Message.Header>
                    <FormattedMessage
                      id="app.login.social_error"
                      description="Notifies the user of an error in third-party authentication"
                      defaultMessage="There was an error initiating social login."
                    />
                  </Message.Header>
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
                </Message>
              </Grid.Row>
            ) : (null)
          }
          <Grid.Row>
            <Grid.Column width={8}>
              <Button id="google" floated="right" color="red" onClick={this.redirectToSocial}>
                <Icon name="google" />
                <FormattedMessage
                  id="app.login.button_google"
                  description="Button label for Google sign in"
                  defaultMessage="Sign in with Google"
                />
              </Button>
            </Grid.Column>
            <Grid.Column width={8}>
              <Button id="github" floated="left" color="black" onClick={this.redirectToSocial}>
                <Icon name="github" />
                <FormattedMessage
                  id="app.login.button_github"
                  description="Button label for GitHub sign in"
                  defaultMessage="Sign in with GitHub"
                />
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
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
          </Grid.Row>
          <Grid.Row>
            <p>
              <FormattedMessage
                id="app.login.account_question"
                description="Asks the user if he/she has an account"
                defaultMessage="Already have a rovercode account? Sign in here:"
              />
            </p>
          </Grid.Row>
          {
            basicError ? (
              <Grid.Row>
                <Message negative>
                  <Message.Header>
                    <FormattedMessage
                      id="app.login.invalid"
                      description="Indicates that the username or password is incorrect"
                      defaultMessage="Invalid username or password."
                    />
                  </Message.Header>
                </Message>
              </Grid.Row>
            ) : (null)
          }
          <Grid.Row>
            <Grid.Column width={4}>
              <Segment raised secondary>
                <Form floated="left" onSubmit={this.basicLogin}>
                  <Form.Input required icon="user" iconPosition="left" placeholder={usernamePlaceholder} onChange={this.handleUsernameChange} />
                  <Form.Input required icon="lock" iconPosition="left" type="password" placeholder={passwordPlaceholder} onChange={this.handlePasswordChange} />
                  <Form.Button primary type="submit">
                    <FormattedMessage
                      id="app.login.sign_in"
                      description="Button label for initiating sign in"
                      defaultMessage="Sign In"
                    />
                  </Form.Button>
                </Form>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <p>
              <a href="/accounts/reset">
                <FormattedMessage
                  id="app.login.forgot"
                  description="Button label for initiating forgot password"
                  defaultMessage="Forgot Password?"
                />
              </a>
            </p>
          </Grid.Row>
        </Grid>
      </Fragment>
    );
  }
}

Login.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  updateUser: PropTypes.func.isRequired,
  updateValidAuth: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default withCookies(injectIntl(connect(null, mapDispatchToProps)(Login)));
