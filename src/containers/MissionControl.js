import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Header } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import {
  changeExecutionState as actionChangeExecutionState,
  EXECUTION_RUN,
  EXECUTION_STEP,
  EXECUTION_STOP,
  EXECUTION_RESET,
} from '@/actions/code';
import Workspace from '@/components/Workspace';

const mapStateToProps = ({ code }) => ({ code });
const mapDispatchToProps = dispatch => ({
  changeExecutionState: state => dispatch(actionChangeExecutionState(state)),
});

const MissionControl = ({ code, changeExecutionState }) => (
  <Grid columns={16}>
    <Grid.Row>
      <Grid.Column width={8}>
        <Workspace />
      </Grid.Column>
      <Grid.Column width={8}>
        <Grid.Row>
          <Header>
            Javascript
          </Header>
          <pre>
            {code.jsCode}
          </pre>
        </Grid.Row>
        <Grid.Row>
          <Button onClick={() => changeExecutionState(EXECUTION_STEP)}>
            Step
          </Button>
          <Button onClick={() => changeExecutionState(EXECUTION_RUN)}>
            Run
          </Button>
          <Button onClick={() => changeExecutionState(EXECUTION_STOP)}>
            Stop
          </Button>
          <Button onClick={() => changeExecutionState(EXECUTION_RESET)}>
            Reset
          </Button>
        </Grid.Row>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

MissionControl.propTypes = {
  code: PropTypes.shape({
    jsCode: PropTypes.string,
  }).isRequired,
  changeExecutionState: PropTypes.func.isRequired,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(MissionControl));
