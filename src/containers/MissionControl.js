import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import { Link } from 'react-router-dom';

import CodeViewer from '@/components/CodeViewer';
import Console from '@/components/Console';
import Control from '@/components/Control';
import Indicator from '@/components/Indicator';
import Workspace from '@/components/Workspace';

const MissionControl = () => (
  <Grid columns={16} divided>
    <Grid.Row>
      <Grid.Column width={6}>
        <Grid.Row>
          <Workspace />
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={6}>
        <Grid.Row>
          <CodeViewer>
            Show Me The Code!
          </CodeViewer>
        </Grid.Row>
        <hr />
        <Grid.Row>
          <Control />
        </Grid.Row>
        <hr />
        <Grid.Row>
          <Link to="/">
            <Button>
              Home
            </Button>
          </Link>
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

export default hot(module)(MissionControl);
