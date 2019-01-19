import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Dropdown } from 'semantic-ui-react';

class TopNav extends PureComponent {
  render() {
    const { userName } = this.props;
    return (
      <nav className="top-nav" style={{ display: 'flex', justifyContent: 'space-between', padding: '50px' }}>
        <section>
          <Button style={{ color: 'white', background: '#0E6EB8' }}>
            <Link to="/programs/create">
              Create New Program
            </Link>
          </Button>
          <Button style={{ color: 'white', background: '#B413EC' }}>
            <Link to="/explore">
              Explore
            </Link>
          </Button>
          <Button style={{ color: 'white', background: '#008080' }}>
            <Link to="/programs">
              My Programs
            </Link>
          </Button>
        </section>
        <section>
          <Dropdown className="top-nav__dropdown" text={userName} direction="left">
            <Dropdown.Menu>
              <Dropdown.Item>
                <Link to="/rovers">
                  Rovers
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link to="/accounts/settings">
                  Settings
                </Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>
                <Link to="/signout">
                  Signout
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </section>
      </nav>
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
