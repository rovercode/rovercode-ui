import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Dropdown, Image, Menu } from 'semantic-ui-react';

import logoImage from '@/assets/images/rovercode_logo_magenta.png';

class TopNav extends PureComponent {
  render() {
    const { userName } = this.props;
    return (
      <Menu inverted color="black">
        <Menu.Item as={Link} to="/">
          <Image src={logoImage} size="mini" />
        </Menu.Item>
        <Menu.Item as={Link} to="/programs/create">
          Create New Program
        </Menu.Item>
        <Menu.Item as={Link} to="/explore">
          Explore
        </Menu.Item>
        <Menu.Item as={Link} to="/programs">
          My Programs
        </Menu.Item>
        <Menu.Menu position="right">
          <Dropdown item text={userName}>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/rovers">
                Rovers
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/accounts/settings">
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to="/signout">
                Signout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    );
  }
}

TopNav.defaultProps = {
  userName: '',
};

TopNav.propTypes = {
  userName: PropTypes.string,
};

export default TopNav;
