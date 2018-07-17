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
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';

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
    const { cookies } = this.props;
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
    const {
      success,
      usernameError,
      emailError,
      password1Error,
      password2Error,
    } = this.state;

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
              Sign Up
            </Header>
          </Grid.Row>
          <Grid.Row>
            <p>
              Already have an account? Then please
              {' '}
              <a href="/accounts/login">
                sign in.
              </a>
            </p>
          </Grid.Row>
          {this.errorMessage()}
          <Grid.Row>
            <Grid.Column width={4}>
              <Segment raised secondary>
                <Form floated="left" onSubmit={this.signUp}>
                  <Form.Input required icon="user" iconPosition="left" placeholder="Username" onChange={this.handleUsernameChange} error={usernameError} />
                  <Form.Input required icon="mail" iconPosition="left" placeholder="Email" onChange={this.handleEmailChange} error={emailError} />
                  <Form.Input required icon="lock" iconPosition="left" type="password" placeholder="Password" onChange={this.handlePassword1Change} error={password1Error} />
                  <Form.Input required icon="lock" iconPosition="left" type="password" placeholder="Password" onChange={this.handlePassword2Change} error={password2Error} />
                  <Form.Button primary type="submit">
                    Sign Up
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
};

export default withCookies(SignUp);
