import React from 'react';
import {
  Divider,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import RoverConnectionList from '@/containers/RoverConnectionList';

import CodeViewer from '@/components/CodeViewer';
import Console from '@/components/Console';
import Control from '@/components/Control';
import Indicator from '@/components/Indicator';
import ProgramName from '@/components/ProgramName';
import Workspace from '@/components/Workspace';

const MissionControl = ({ location }) => (
  <Grid style={{ height: '100vh' }}>
    <Grid.Row>
      <Grid.Column width={13}>
        <Workspace location={location}>
          <Control />
        </Workspace>
      </Grid.Column>
      <Grid.Column width={3}>
        <Grid.Row>
          <Segment basic compact>
            <ProgramName location={location} />
          </Segment>
        </Grid.Row>
        <Divider />
        <Grid.Row>
          <Header as="h2" textAlign="center">
            Rovers
          </Header>
          <Segment raised style={{ overflow: 'auto', maxHeight: 200, margin: '10px' }}>
            <RoverConnectionList />
          </Segment>
        </Grid.Row>
        <Divider />
        <Grid.Row>
          <Header as="h2" textAlign="center">
            Sensors
          </Header>
          <Segment raised style={{ margin: '10px' }}>
            <Indicator />
          </Segment>
        </Grid.Row>
        <Divider />
        <Grid.Row>
          <Header as="h2" textAlign="center">
            Debug Console
          </Header>
          <Segment style={{ margin: '10px' }}>
            <Console />
          </Segment>
        </Grid.Row>
        <Divider />
        <Grid.Row>
          <Segment basic compact>
            <CodeViewer>
              Show Me The Code!
            </CodeViewer>
          </Segment>
        </Grid.Row>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

MissionControl.defaultProps = {
  location: {
    state: {
      readOnly: false,
    },
  },
};

MissionControl.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      readOnly: PropTypes.bool,
    }),
  }),
};

export default hot(module)(MissionControl);
