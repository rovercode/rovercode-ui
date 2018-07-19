import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import Login from './Login';
import PasswordReset from './PasswordReset';
import SignUp from './SignUp';

import logoImage from '../../assets/images/rovercode_logo.png';

const Base = ({ match }) => (
  <Grid centered columns={16}>
    <Grid.Row>
      <Image src={logoImage} />
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={16}>
        <Switch>
          <Route exact path={`${match.path}/login`} component={Login} />
          <Route exact path={`${match.path}/reset`} component={PasswordReset} />
          <Route exact path={`${match.path}/signup`} component={SignUp} />
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
