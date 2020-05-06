import React from 'react';
import {
  Divider,
  Grid,
  Header,
  Segment,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import CodeViewer from '@/components/CodeViewer';
import Console from '@/components/Console';
import Control from '@/components/Control';
import Indicator from '@/components/Indicator';
import ProgramName from '@/components/ProgramName';
import ProgramTags from '@/components/ProgramTags';
import Workspace from '@/components/Workspace';

const MissionControl = ({ location }) => (
  <Grid>
    <Grid.Row>
      <Grid.Column width={3}>
        <Grid.Row>
          <Segment basic compact>
            <ProgramName location={location} />
          </Segment>
        </Grid.Row>
        <Divider />
        <Grid.Row>
          <Header as="h2" textAlign="center">
            <FormattedMessage
              id="app.mission_control.tags"
              description="Header for list of the program's tags"
              defaultMessage="Tags"
            />
          </Header>
          <ProgramTags />
        </Grid.Row>
        <Divider />
        <Grid.Row>
          <Segment basic compact>
            <CodeViewer>
              <FormattedMessage
                id="app.mission_control.show_code"
                description="Button label for displaying user's code"
                defaultMessage="Show Me The Code!"
              />
            </CodeViewer>
          </Segment>
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={10}>
        <Workspace location={location}>
          <Control />
        </Workspace>
      </Grid.Column>
      <Grid.Column width={3}>
        <Grid.Row>
          <Header as="h2" textAlign="center">
            <FormattedMessage
              id="app.mission_control.sensors"
              description="Header for list of the user's sensors"
              defaultMessage="Sensors"
            />
          </Header>
          <Segment raised style={{ margin: '10px' }}>
            <Indicator />
          </Segment>
        </Grid.Row>
        <Divider />
        <Grid.Row>
          <Header as="h2" textAlign="center">
            <FormattedMessage
              id="app.mission_control.console"
              description="Header for debug console"
              defaultMessage="Debug Console"
            />
          </Header>
          <Segment style={{ margin: '10px' }}>
            <Console />
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
