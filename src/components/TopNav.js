import React, { Component } from 'react';
import { red } from '@material-ui/core/colors';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import {
  makeStyles,
  styled,
  withStyles,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core';
import {
  Dropdown,
  Image,
  Menu,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { withCookies, Cookies } from 'react-cookie';
import { logout as actionLogout } from '@/actions/auth';

import logoImage from '@/assets/images/rovercode_logo_magenta.png';

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(actionLogout()),
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


class TopNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToLogin: false,
    };
  }

  signout = () => {
    const { cookies, logout } = this.props;

    cookies.remove('auth_jwt', { path: '/' });
    logout();

    this.setState({ redirectToLogin: true });
  }

  render() {
    const { userName } = this.props;
    const { redirectToLogin } = this.state;

    const ConnectionButton = styled(Typography)({
      textAlign: 'left',
      fontWeight: 'bold',
    });

    return (
      <>
        {
          redirectToLogin ? (
            <Redirect to="/accounts/login" />
          ) : (null)
        }

        <div>
          <AppBar position="static" color="secondary">
            <Toolbar>
              <Grid item container direction="row" spacing={4}>
                <Grid item xs={2}>
                  <Box
                    display="flex"
                    justifyContent="left"
                  >
                    <Button
                      size="large"
                      variant="contained"
                      disableElevation
                      color="secondary"
                    >
                      <Typography variant="h6">
                        Logo/Connect
                      </Typography>
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    display="flex"
                    justifyContent="center"
                  >
                    <Button
                      size="large"
                      variant="contained"
                      disableElevation
                      color="secondary"
                    >
                      <Typography variant="h6">
                        My Programs
                      </Typography>
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    display="flex"
                    justifyContent="center"
                  >
                    <Button
                      size="large"
                      variant="contained"
                      disableElevation
                      color="secondary"
                    >
                      <Typography variant="h6">
                        Community Programs
                      </Typography>
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    display="flex"
                    justifyContent="center"
                  >
                    <Button
                      size="large"
                      variant="contained"
                      disableElevation
                      color="secondary"
                    >
                      <Typography variant="h6">
                        Courses
                      </Typography>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <Button
                size="large"
                variant="contained"
                disableElevation
                color="secondary"
                endIcon={<ArrowDropDownIcon />}
              >
                <Typography variant="h6">
                  {userName}
                </Typography>
              </Button>
            </Toolbar>
          </AppBar>
        </div>

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
      </>
    );
  }
}

TopNav.defaultProps = {
  userName: '',
};

TopNav.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  userName: PropTypes.string,
  logout: PropTypes.func.isRequired,
};

export default withCookies(connect(null, mapDispatchToProps)(TopNav));
