import React, { Component, Fragment } from 'react';
import {
  Button,
  Grid,
  Icon,
  Image,
  Message,
} from 'semantic-ui-react';
import axios from 'axios';
import URL from 'url-parse';
import queryString from 'query-string';

import logoImage from '../assets/images/rovercode_logo.png';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
    };
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
          error: true,
        });
      });
  }

  render() {
    const { error } = this.state;

    return (
      <Fragment>
        <Grid centered columns="equal">
          <Grid.Row>
            <Image src={logoImage} />
          </Grid.Row>
          <Grid.Row>
            <p>
              You can sign up / sign in with one of your existing third-party accounts.
            </p>
          </Grid.Row>
          {
            error ? (
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
            <Grid.Column>
              <Button id="google" floated="right" color="red" onClick={this.redirectToSocial}>
                <Icon name="google" />
                Sign in with Google
              </Button>
            </Grid.Column>
            <Grid.Column>
              <Button id="github" floated="left" color="black" onClick={this.redirectToSocial}>
                <Icon name="github" />
                Sign in with GitHub
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Fragment>
    );
  }
}
