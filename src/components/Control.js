import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Tooltip } from '@material-ui/core';
import {
  PlayArrow,
  Replay,
  SkipNext,
  Stop,
} from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  changeExecutionState as actionChangeExecutionState,
  EXECUTION_RUN,
  EXECUTION_STEP,
  EXECUTION_STOP,
  EXECUTION_RESET,
} from '@/actions/code';

const mapStateToProps = ({ code }) => ({ code });
const mapDispatchToProps = (dispatch) => ({
  changeExecutionState: (state) => dispatch(actionChangeExecutionState(state)),
});

const Control = ({
  code,
  changeExecutionState,
  isConnected,
  intl,
}) => {
  const stopTitle = intl.formatMessage({
    id: 'app.control.stop',
    description: 'Button label to stop execution of the code',
    defaultMessage: 'Stop',
  });

  const runTitle = intl.formatMessage({
    id: 'app.control.run',
    description: 'Button label to start execution of the code',
    defaultMessage: 'Run',
  });

  const stepTitle = intl.formatMessage({
    id: 'app.control.step',
    description: 'Button label to step one place forward in the code',
    defaultMessage: 'Step',
  });

  const resetTitle = intl.formatMessage({
    id: 'app.control.reset',
    description: 'Button label to reset to the beginning of the code',
    defaultMessage: 'Reset',
  });

  const RunButton = withStyles(() => ({
    root: {
      color: '#FFFFFF',
      backgroundColor: '#114BFD',
      '&:hover': {
        backgroundColor: '#114BFD',
      },
      width: '42px',
      height: '42px',
      minWidth: '0px',
      boxShadow: '0px 3px 3px #00000029',
      borderRadius: '4px',
      opacity: 1,
    },
  }))(Button);

  const StepButton = withStyles(() => ({
    root: {
      color: '#FFFFFF',
      backgroundColor: '#FFAD11',
      '&:hover': {
        backgroundColor: '#FFAD11',
      },
      width: '24px',
      height: '24px',
      minWidth: '0px',
      boxShadow: '0px 1px 3px #00000057',
      borderRadius: '4px',
      opacity: 1,
    },
  }))(Button);

  const ResetButton = withStyles(() => ({
    root: {
      color: '#FFFFFF',
      backgroundColor: '#FF0459',
      '&:hover': {
        backgroundColor: '#FF0459',
      },
      width: '24px',
      height: '24px',
      minWidth: '0px',
      boxShadow: '0px 1px 3px #00000057',
      borderRadius: '4px',
      opacity: 1,
    },
  }))(Button);

  const StopButton = withStyles(() => ({
    root: {
      color: '#FFFFFF',
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[500],
      },
      width: '42px',
      height: '42px',
      minWidth: '0px',
      boxShadow: '0px 3px 3px #00000029',
      borderRadius: '4px',
      opacity: 1,
    },
  }))(Button);

  return (
    <>
      <Grid container direction="row" justify="center" alignItems="center" spacing={1} style={{ minWidth: '150px' }}>
        {
        code.execution === EXECUTION_RUN ? (
          <Grid item>
            <Tooltip title={stopTitle}>
              <StopButton
                variant="contained"
                onClick={() => changeExecutionState(EXECUTION_STOP)}
              >
                <Stop />
              </StopButton>
            </Tooltip>
          </Grid>
        ) : (
          <>
            <Grid item>
              <Tooltip title={resetTitle}>
                <ResetButton
                  variant="contained"
                  onClick={() => changeExecutionState(EXECUTION_RESET)}
                  style={{ verticalAlign: 'bottom' }}
                  disabled={!isConnected}
                >
                  <Replay />
                </ResetButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={runTitle}>
                <RunButton
                  variant="contained"
                  onClick={() => changeExecutionState(EXECUTION_RUN)}
                  disabled={!isConnected}
                >
                  <PlayArrow />
                </RunButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={stepTitle}>
                <StepButton
                  variant="contained"
                  onClick={() => changeExecutionState(EXECUTION_STEP)}
                  style={{ verticalAlign: 'bottom' }}
                  disabled={!isConnected}
                >
                  <SkipNext />
                </StepButton>
              </Tooltip>
            </Grid>
          </>
        )
      }
      </Grid>
    </>
  );
};

Control.defaultProps = {
  isConnected: false,
};

Control.propTypes = {
  code: PropTypes.shape({
    execution: PropTypes.number,
  }).isRequired,
  isConnected: PropTypes.bool,
  changeExecutionState: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default hot(module)(injectIntl(connect(mapStateToProps, mapDispatchToProps)(Control)));
