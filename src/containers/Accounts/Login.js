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
import axios from 'axios';
import URL from 'url-parse';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

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
    const { cookies } = this.props;
    const { username, password } = this.state;

    return axios.post('/api/api-token-auth/', {
      username,
      password,
    })
      .then((response) => {
        cookies.set('auth_jwt', response.data.token, { path: '/' });
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
        redirectUrl.set('pathname', `/login/${service}/callback/`);
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
    const { basicError, basicSuccess, socialError } = this.state;

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
              You can sign up / sign in with one of your existing third-party accounts.
            </p>
          </Grid.Row>
          {
            socialError ? (
              <Grid.Row>
                <Message negative>
                  <Message.Header>
                    There was an error initiating social login.
                  </Message.Header>
                  <p>
                    Contact
                    {' '}
                    <a href="mailto:support@rovercode.com">
                      support@rovercode.com
                    </a>
                    {' '}
                    for help with this issue.
                  </p>
                </Message>
              </Grid.Row>
            ) : (null)
          }
          <Grid.Row>
            <Grid.Column width={8}>
              <Button id="google" floated="right" color="red" onClick={this.redirectToSocial}>
                <Icon name="google" />
                Sign in with Google
              </Button>
            </Grid.Column>
            <Grid.Column width={8}>
              <Button id="github" floated="left" color="black" onClick={this.redirectToSocial}>
                <Icon name="github" />
                Sign in with GitHub
              </Button>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <p>
              Don&apos;t have any of those accounts?
              {' '}
              <a href="/accounts/signup">
                Create a rovercode account.
              </a>
            </p>
          </Grid.Row>
          <Grid.Row>
            <p>
              Already have a rovercode account? Sign in here:
            </p>
          </Grid.Row>
          {
            basicError ? (
              <Grid.Row>
                <Message negative>
                  <Message.Header>
                    Invalid username or password.
                  </Message.Header>
                </Message>
              </Grid.Row>
            ) : (null)
          }
          <Grid.Row>
            <Grid.Column width={4}>
              <Segment raised secondary>
                <Form floated="left" onSubmit={this.basicLogin}>
                  <Form.Input required icon="user" iconPosition="left" placeholder="Username" onChange={this.handleUsernameChange} />
                  <Form.Input required icon="lock" iconPosition="left" type="password" placeholder="Password" onChange={this.handlePasswordChange} />
                  <Form.Button primary type="submit">
Sign In
                  </Form.Button>
                </Form>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <p>
              <a href="/accounts/reset">
                Forgot Password?
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
};

export default withCookies(Login);
