import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
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
        <Button onClick={() => changeExecutionState(EXECUTION_STOP)}>
          Stop
        </Button>
      ) : (
        <Fragment>
          <Button onClick={() => changeExecutionState(EXECUTION_STEP)}>
            Step
          </Button>
          <Button onClick={() => changeExecutionState(EXECUTION_RUN)}>
            Run
          </Button>
          <Button onClick={() => changeExecutionState(EXECUTION_RESET)}>
            Reset
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
