import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Form,
  Grid,
  Header,
  Icon,
  List,
  Message,
  Segment,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';

class UserSetting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password1: null,
      password2: null,
      saveSuccess: false,
      usernameError: null,
      password1Error: null,
      password2Error: null,
      nonFieldError: null,
    };
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

  saveUserUsername = () => {
    const { editUserUsername } = this.props;
    const { username } = this.state;

    return editUserUsername(username)
      .then(() => this.setState({ saveSuccess: true }))
      .catch(error => this.setState({ usernameError: error.response.data.username }));
  }

  saveUserPassword = () => {
    const { editUserPassword } = this.props;
    const { password1, password2 } = this.state;

    if (password1 !== password2) {
      this.setState({
        password1Error: ['Passwords must match'],
        password2Error: ['Passwords must match'],
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

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  render() {
    const { user } = this.props;
    const {
      saveSuccess,
      usernameError,
      password1Error,
      password2Error,
    } = this.state;

    return (
      <Grid centered divided="vertically" columns={16}>
        <Grid.Row>
          <Header as="h1">
            <Icon name="settings" />
            <Header.Content>
              My Settings
            </Header.Content>
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={5}>
            {
              saveSuccess ? (
                <Redirect to="/accounts/login" />
              ) : (null)
            }
            {
              <Fragment>
                <Message info>
                  Changing any of these settings requires signing back in.
                </Message>
                {this.errorMessage()}
                <Grid.Row style={{ paddingBottom: '10px', paddingTop: '10px' }}>
                  <Segment raised>
                    <Header dividing>
                      <Icon name="user" />
                      <Header.Content>
                        Change Username
                      </Header.Content>
                    </Header>
                    <Form key={user.user_id} onSubmit={this.saveUserUsername}>
                      <Form.Input
                        inline
                        label="Username:"
                        name="username"
                        error={usernameError}
                        defaultValue={user.username}
                        onChange={this.handleChange}
                        required
                      />
                      <Form.Button primary>
                        Save
                      </Form.Button>
                    </Form>
                  </Segment>
                </Grid.Row>
                {
                  !user.isSocial ? (
                    <Grid.Row>
                      <Segment raised>
                        <Header dividing>
                          <Icon name="lock" />
                          <Header.Content>
                            Change Password
                          </Header.Content>
                        </Header>
                        <Form key={user.user_id} onSubmit={this.saveUserPassword}>
                          <Form.Group widths="equal">
                            <Form.Input
                              label="New Password:"
                              name="password1"
                              error={password1Error}
                              onChange={this.handleChange}
                              type="password"
                              required
                            />
                            <Form.Input
                              label="Verify:"
                              name="password2"
                              error={password2Error}
                              onChange={this.handleChange}
                              type="password"
                              required
                            />
                          </Form.Group>
                          <Form.Button primary>
                            Save
                          </Form.Button>
                        </Form>
                      </Segment>
                    </Grid.Row>
                  ) : (null)
                }
              </Fragment>
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

UserSetting.propTypes = {
  editUserUsername: PropTypes.func.isRequired,
  editUserPassword: PropTypes.func.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserSetting;
