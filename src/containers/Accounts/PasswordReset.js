import React, { Component } from 'react';
import {
  Form,
  Grid,
  Header,
  List,
  Message,
  Segment,
} from 'semantic-ui-react';
import axios from 'axios';

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
      <Grid.Row>
        <Message negative>
          <List bulleted>
            {
              emailError.map((error, i) => (
                <List.Item key={i}>
                  {error}
                </List.Item>
              ))
            }
          </List>
        </Message>
      </Grid.Row>
    );
  }

  reset = () => {
    const { email } = this.state;

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
    const { success, emailError } = this.state;

    return (
      <Grid centered columns={16}>
        <Grid.Row>
          <Header size="huge">
            Password Reset
          </Header>
        </Grid.Row>
        <Grid.Row>
          <p>
            Forgotten your password?
          </p>
        </Grid.Row>
        <Grid.Row>
          <p>
            Enter your e-mail address below, and we&apos;ll send you an e-mail
            allowing you to reset it.
          </p>
        </Grid.Row>
        {
          success ? (
            <Message positive>
              { success }
            </Message>
          ) : (null)
        }
        {this.errorMessage()}
        <Grid.Row>
          <Grid.Column width={4}>
            <Segment raised secondary>
              <Form floated="left" onSubmit={this.reset}>
                <Form.Input required icon="mail" iconPosition="left" placeholder="Email" onChange={this.handleEmailChange} error={emailError} />
                <Form.Button primary type="submit">
                  Reset Password
                </Form.Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default PasswordReset;
