import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import {
  changeExecutionState as actionChangeExecutionState,
  EXECUTION_RUN,
  EXECUTION_STEP,
  EXECUTION_STOP,
  EXECUTION_RESET,
} from '@/actions/code';

const mapStateToProps = ({ code }) => ({ code });
const mapDispatchToProps = dispatch => ({
  changeExecutionState: state => dispatch(actionChangeExecutionState(state)),
});

const Control = ({ code, changeExecutionState }) => (
  <Fragment>
    {
      code.execution === EXECUTION_RUN ? (
        <Button onClick={() => changeExecutionState(EXECUTION_STOP)} animated="vertical">
          <Button.Content hidden>
            Stop
          </Button.Content>
          <Button.Content visible>
            <Icon name="stop" />
          </Button.Content>
        </Button>
      ) : (
        <Fragment>
          <Button onClick={() => changeExecutionState(EXECUTION_STEP)} animated="vertical">
            <Button.Content hidden>
              Step
            </Button.Content>
            <Button.Content visible>
              <Icon name="step forward" />
            </Button.Content>
          </Button>
          <Button onClick={() => changeExecutionState(EXECUTION_RUN)} animated="vertical">
            <Button.Content hidden>
              Run
            </Button.Content>
            <Button.Content visible>
              <Icon name="play" />
            </Button.Content>
          </Button>
          <Button onClick={() => changeExecutionState(EXECUTION_RESET)} animated="vertical">
            <Button.Content hidden>
              Reset
            </Button.Content>
            <Button.Content visible>
              <Icon name="repeat" />
            </Button.Content>
          </Button>
        </Fragment>
      )
    }
  </Fragment>
);

Control.propTypes = {
  code: PropTypes.shape({
    execution: PropTypes.number,
  }).isRequired,
  changeExecutionState: PropTypes.func.isRequired,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Control));
