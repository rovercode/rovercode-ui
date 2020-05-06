import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import {
  withStyles,
} from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Button,
  Typography,
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { FormattedMessage } from 'react-intl';
import { withCookies, Cookies } from 'react-cookie';
import { logout as actionLogout } from '@/actions/auth';

import RoverConnection from '@/containers/RoverConnection';

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(actionLogout()),
});

class TopNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToLogin: false,
      userMenuAnchorElement: null,
    };
  }

  signout = () => {
    const { cookies, logout } = this.props;

    cookies.remove('auth_jwt', { path: '/' });
    logout();

    this.setState({ redirectToLogin: true });
  }

  handleMenuOpen = (event) => {
    this.setState({
      userMenuAnchorElement: event.target,
    });
  };

  handleMenuClose = () => {
    this.setState({
      userMenuAnchorElement: null,
    });
  };

  render() {
    const { userName } = this.props;
    const { redirectToLogin, userMenuAnchorElement } = this.state;

    const NavBarSpacer = withStyles((theme) => ({
      root: {
        marginBottom: theme.spacing(2),
      },
    }))(Box);

    const NavButtonBox = withStyles(() => ({
      root: {
        height: '100%',
      },
    }))(Box);

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
                    <RoverConnection />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <NavButtonBox
                    display="flex"
                    justifyContent="center"
                  >
                    <Button
                      size="large"
                      variant="contained"
                      disableElevation
                      color="secondary"
                      component={Link}
                      to="/programs"
                    >
                      <Typography variant="h6">
                        <FormattedMessage
                          id="app.top_nav.my_programs"
                          description="Button label to go to the user's own programs"
                          defaultMessage="My Programs"
                        />
                      </Typography>
                    </Button>
                  </NavButtonBox>
                </Grid>
                <Grid item xs={2}>
                  <NavButtonBox
                    display="flex"
                    justifyContent="center"
                  >
                    <Button
                      size="large"
                      variant="contained"
                      disableElevation
                      color="secondary"
                      component={Link}
                      to="/programs"
                    >
                      <Typography variant="h6">
                        <FormattedMessage
                          id="app.top_nav.community_programs"
                          description="Button label to go to the community programs"
                          defaultMessage="Community Programs"
                        />
                      </Typography>
                    </Button>
                  </NavButtonBox>
                </Grid>
                <Grid item xs={2}>
                  <NavButtonBox
                    display="flex"
                    justifyContent="center"
                  >
                    <Button
                      size="large"
                      variant="contained"
                      disableElevation
                      color="secondary"
                      component={Link}
                      to="/programs"
                    >
                      <Typography variant="h6">
                        <FormattedMessage
                          id="app.top_nav.courses"
                          description="Button label to go to the courses"
                          defaultMessage="Courses"
                        />
                      </Typography>
                    </Button>
                  </NavButtonBox>
                </Grid>
              </Grid>
              <Button
                size="large"
                variant="contained"
                disableElevation
                color="secondary"
                endIcon={<ArrowDropDownIcon />}
                aria-label="account of current user"
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={this.handleMenuOpen}
              >
                <Typography variant="h6">
                  {userName}
                </Typography>
              </Button>
              <Menu
                id="user-menu"
                anchorEl={userMenuAnchorElement}
                keepMounted
                open={Boolean(userMenuAnchorElement)}
                onClose={this.handleMenuClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <MenuItem component={Link} to="/user/settings">
                  <FormattedMessage
                    id="app.top_nav.settings"
                    description="Button label to go to settings"
                    defaultMessage="Settings"
                  />
                </MenuItem>
                <MenuItem onClick={this.signout}>
                  <FormattedMessage
                    id="app.top_nav.sign_out"
                    description="Button label to sign out"
                    defaultMessage="Sign Out"
                  />
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
          <NavBarSpacer />
        </div>
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
