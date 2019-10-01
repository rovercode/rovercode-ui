import React, { Component } from 'react';
import {
  Form,
  Grid,
  Header,
  List,
  Message,
  Segment,
} from 'semantic-ui-react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
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
    const { intl } = this.props;
    const { success, emailError } = this.state;

    const emailPlaceholder = intl.formatMessage({
      id: 'app.password_reset.email_placeholder',
      description: 'Placeholder for email entry',
      defaultMessage: 'Email',
    });

    return (
      <Grid centered columns={16}>
        <Grid.Row>
          <Header size="huge">
            <FormattedMessage
              id="app.password_reset.header"
              description="Header for password reset"
              defaultMessage="Password Reset"
            />
          </Header>
        </Grid.Row>
        <Grid.Row>
          <p>
            <FormattedMessage
              id="app.password_reset.verify"
              description="Verifies that the user has forgotten password"
              defaultMessage="Forgotten your password?"
            />
          </p>
        </Grid.Row>
        <Grid.Row>
          <p>
            <FormattedMessage
              id="app.password_reset.email"
              description="Directs the user to enter e-mail for password reset"
              defaultMessage="Enter your e-mail address below, and well send you an e-mail allowing you to reset it."
            />
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
                <Form.Input required icon="mail" iconPosition="left" placeholder={emailPlaceholder} onChange={this.handleEmailChange} error={emailError} />
                <Form.Button primary type="submit">
                  <FormattedMessage
                    id="app.password_reset.reset"
                    description="Button label for initiating reset password"
                    defaultMessage="Reset Password"
                  />
                </Form.Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

PasswordReset.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(PasswordReset);
