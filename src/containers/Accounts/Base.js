import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import NotFound from '@/containers/Global/NotFound';
import logoImage from '@/assets/images/rovercode_logo.png';

import Login from './Login';
import LoginCallback from './LoginCallback';
import PasswordReset from './PasswordReset';
import PasswordResetCallback from './PasswordResetCallback';
import SignUp from './SignUp';


const Base = ({ match }) => (
  <Grid centered columns={16}>
    <Grid.Row>
      <Image src={logoImage} />
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={16}>
        <Switch>
          <Route exact path={`${match.path}/login`} component={Login} />
          <Route exact path={`${match.path}/login/callback/:service`} component={LoginCallback} />
          <Route exact path={`${match.path}/reset`} component={PasswordReset} />
          <Route exact path={`${match.path}/reset/callback/:uid/:token`} component={PasswordResetCallback} />
          <Route exact path={`${match.path}/signup`} component={SignUp} />
          <Route component={NotFound} />
        </Switch>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

Base.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
};

export default Base;
