import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import {
  Button,
  Dropdown,
  Image,
  Menu,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { withCookies, Cookies } from 'react-cookie';

import logoImage from '@/assets/images/rovercode_logo_magenta.png';

class TopNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToLogin: false,
    };
  }

  signout = () => {
    const { cookies } = this.props;

    cookies.remove('auth_jwt', { path: '/' });

    this.setState({ redirectToLogin: true });
  }

  render() {
    const { userName } = this.props;
    const { redirectToLogin } = this.state;

    return (
      <Fragment>
        {
          redirectToLogin ? (
            <Redirect to="/accounts/login" />
          ) : (null)
        }
        <Menu inverted color="black">
          <Menu.Item as={Link} to="/">
            <Image src={logoImage} size="mini" />
          </Menu.Item>
          <Menu.Item as={Link} to="/programs">
            <FormattedMessage
              id="app.top_nav.programs"
              description="Button label to go to programs"
              defaultMessage="Programs"
            />
          </Menu.Item>
          <Menu.Item as={Link} to="/rovers">
            <FormattedMessage
              id="app.top_nav.rovers"
              description="Button label to go to rovers"
              defaultMessage="Rovers"
            />
          </Menu.Item>
          <Menu.Menu position="right">
            <Dropdown item text={userName}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/user/settings">
                  <FormattedMessage
                    id="app.top_nav.settings"
                    description="Button label to go to settings"
                    defaultMessage="Settings"
                  />
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Button} onClick={this.signout}>
                  <FormattedMessage
                    id="app.top_nav.sign_out"
                    description="Button label to sign out"
                    defaultMessage="Sign Out"
                  />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </Fragment>
    );
  }
}

TopNav.defaultProps = {
  userName: '',
};

TopNav.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  userName: PropTypes.string,
};

export default withCookies(TopNav);
