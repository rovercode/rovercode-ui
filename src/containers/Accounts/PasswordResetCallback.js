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

  confirm = () => {
    const { match } = this.props;
    const { password1, password2 } = this.state;

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
    const {
      success,
      password1Error,
      password2Error,
    } = this.state;

    return (
      <Fragment>
        {
          success ? (
            <Redirect to="/accounts/login" />
          ) : (null)
        }
        <Grid centered columns={16}>
          <Grid.Row>
            <Header size="huge">
              Reset Password
            </Header>
          </Grid.Row>
          <Grid.Row>
            <p>
              Enter a new password for your account below.
            </p>
          </Grid.Row>
          {this.errorMessage()}
          <Grid.Row>
            <Grid.Column width={4}>
              <Segment raised secondary>
                <Form floated="left" onSubmit={this.confirm}>
                  <Form.Input required icon="lock" iconPosition="left" type="password" placeholder="Password" onChange={this.handlePassword1Change} error={password1Error} />
                  <Form.Input required icon="lock" iconPosition="left" type="password" placeholder="Password" onChange={this.handlePassword2Change} error={password2Error} />
                  <Form.Button primary type="submit">
                    Set Password
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

PasswordResetCallback.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      uid: PropTypes.string.isRequired,
      token: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default PasswordResetCallback;
