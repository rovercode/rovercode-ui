import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import {
  Box,
  Grid,
  Button,
  Typography,
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { FormattedMessage } from 'react-intl';
import { withCookies, Cookies } from 'react-cookie';
import { logout as actionLogout } from '@/actions/auth';

import RoverConnection from '@/containers/RoverConnection';
import ConnectionHelp from '@/components/ConnectionHelp';

import MenuIcon from '@material-ui/icons/Menu';

const styles = (theme) => ({
  hiddenOnMobile: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  hiddenOnWeb: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(actionLogout()),
});
const NavBarSpacer = withStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
}))(Box);

const NavButtonBox = withStyles(() => ({
  root: {
    height: '100%',
  },
}))(Box);

class TopNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToLogin: false,
      userMenuAnchorElement: null,
      mobileMenuAnchorElement: null,
    };
  }

  signout = () => {
    const { cookies, logout } = this.props;

    cookies.remove('auth_jwt', { path: '/' });
    cookies.remove('refresh_jwt', { path: '/' });
    logout();

    this.setState({ redirectToLogin: true });
  };

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

  handleClick = (event) => {
    this.setState({
      mobileMenuAnchorElement: event.target,
    });
  };

  handleClose = () => {
    this.setState({
      mobileMenuAnchorElement: null,
    });
  };

  render() {
    const { userName, classes } = this.props;
    const { redirectToLogin, userMenuAnchorElement } = this.state;
    const { mobileMenuAnchorElement } = this.state;

    return (
      <>
        {redirectToLogin ? <Redirect to="/accounts/login" /> : null}

        <div>
          <AppBar position="static" color="secondary">
            <Toolbar className={classes.hiddenOnMobile}>
              <Box display="flex" justifyContent="left" marginRight={2}>
                <RoverConnection />
                <ConnectionHelp suppressGuide={window.location.pathname === '/purchase'} />
              </Box>
              <Grid container direction="row" spacing={2}>
                <Grid item>
                  <NavButtonBox display="flex" justifyContent="center">
                    <Button
                      size="large"
                      variant="contained"
                      disableElevation
                      color="secondary"
                      component={Link}
                      to="/programs/mine"
                    >
                      <Typography variant="h3">
                        <FormattedMessage
                          id="app.top_nav.my_programs"
                          description="Button label to go to the user's own programs"
                          defaultMessage="My Programs"
                        />
                      </Typography>
                    </Button>
                  </NavButtonBox>
                </Grid>
                <Grid item>
                  <NavButtonBox display="flex" justifyContent="center">
                    <Button
                      size="large"
                      variant="contained"
                      disableElevation
                      color="secondary"
                      component={Link}
                      to="/programs/community"
                    >
                      <Typography variant="h3">
                        <FormattedMessage
                          id="app.top_nav.community_programs"
                          description="Button label to go to the community programs"
                          defaultMessage="Community Programs"
                        />
                      </Typography>
                    </Button>
                  </NavButtonBox>
                </Grid>
                <Grid item>
                  <NavButtonBox display="flex" justifyContent="center">
                    <Button
                      size="large"
                      variant="contained"
                      disableElevation
                      color="secondary"
                      component={Link}
                      to="/courses"
                    >
                      <Typography variant="h3">
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
                <Typography variant="h3">{userName}</Typography>
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
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <FormattedMessage
                    id="app.top_nav.settings"
                    description="Button label to go to settings"
                    defaultMessage="Settings"
                  />
                </MenuItem>
                <MenuItem onClick={this.signout}>
                  <ListItemIcon>
                    <ExitToAppIcon fontSize="small" />
                  </ListItemIcon>
                  <FormattedMessage
                    id="app.top_nav.sign_out"
                    description="Button label to sign out"
                    defaultMessage="Sign Out"
                  />
                </MenuItem>
              </Menu>
            </Toolbar>
            <Toolbar className={classes.hiddenOnWeb}>
              <Box display="flex" justifyContent="space-between" style={{ width: '100%' }}>
                <Box display="flex" justifyContent="left">
                  <RoverConnection />
                  <ConnectionHelp suppressGuide={window.location.pathname === '/purchase'} />
                </Box>

                <Button
                  edge="end"
                  color="inherit"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={this.handleClick}
                  startIcon={<MenuIcon />}
                >
                  <Typography variant="h3">Menu</Typography>
                </Button>
                <Menu
                  id="simple-menu"
                  anchorEl={mobileMenuAnchorElement}
                  keepMounted
                  open={Boolean(mobileMenuAnchorElement)}
                  onClose={this.handleClose}
                  getContentAnchorEl={null}
                >
                  <MenuItem component={Link} to="/user/settings">
                    <ListItemIcon>
                      <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    {userName}
                  </MenuItem>
                  <MenuItem onClick={this.signout} divider>
                    <ListItemIcon>
                      <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    <FormattedMessage
                      id="app.top_nav.sign_out"
                      description="Button label to sign out"
                      defaultMessage="Sign Out"
                    />
                  </MenuItem>
                  <MenuItem component={Link} to="/programs/mine">
                    <FormattedMessage
                      id="app.top_nav.my_programs"
                      description="Button label to go to the user's own programs"
                      defaultMessage="My Programs"
                    />
                  </MenuItem>
                  <MenuItem component={Link} to="/programs/community">
                    <FormattedMessage
                      id="app.top_nav.community_programs"
                      description="Button label to go to the community programs"
                      defaultMessage="Community Programs"
                    />
                  </MenuItem>
                  <MenuItem component={Link} to="/courses">
                    <FormattedMessage
                      id="app.top_nav.courses"
                      description="Button label to go to the courses"
                      defaultMessage="Courses"
                    />
                  </MenuItem>
                </Menu>
              </Box>
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
  classes: PropTypes.shape({
    hiddenOnMobile: PropTypes.string.isRequired,
    hiddenOnWeb: PropTypes.string.isRequired,
  }).isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  userName: PropTypes.string,
  logout: PropTypes.func.isRequired,
};

export default withCookies(connect(null, mapDispatchToProps)(withStyles(styles)(TopNav)));
