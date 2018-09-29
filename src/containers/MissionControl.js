import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import Console from '@/components/Console';
import Control from '@/components/Control';
import Indicator from '@/components/Indicator';
import Workspace from '@/components/Workspace';

const mapStateToProps = ({ code }) => ({ code });

const MissionControl = ({ code }) => (
  <Grid columns={16} divided>
    <Grid.Row>
      <Grid.Column width={6}>
        <Grid.Row>
          <Workspace />
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={6}>
        <Grid.Row>
          <Header>
            Javascript
          </Header>
          <pre>
            {code.jsCode}
          </pre>
        </Grid.Row>
        <Grid.Row>
          <Control />
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={4}>
        <Grid.Row>
          <Console />
        </Grid.Row>
        <Grid.Row>
          <Indicator />
        </Grid.Row>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

MissionControl.propTypes = {
  code: PropTypes.shape({
    jsCode: PropTypes.string,
  }).isRequired,
};

export default hot(module)(connect(mapStateToProps)(MissionControl));
