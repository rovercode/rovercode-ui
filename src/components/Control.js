import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import { FormattedMessage } from 'react-intl';
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

const Control = ({ code, changeExecutionState, isConnected }) => (
  <>
    {
      code.execution === EXECUTION_RUN ? (
        <Button color="red" onMouseDown={(e) => e.preventDefault()} onClick={() => changeExecutionState(EXECUTION_STOP)} animated="vertical">
          <Button.Content hidden>
            <FormattedMessage
              id="app.control.stop"
              description="Button label to stop execution of the code"
              defaultMessage="Stop"
            />
          </Button.Content>
          <Button.Content visible>
            <Icon name="stop" />
          </Button.Content>
        </Button>
      ) : (
        <>
          <Button color="green" size="huge" onMouseDown={(e) => e.preventDefault()} onClick={() => changeExecutionState(EXECUTION_RUN)} animated="vertical" disabled={!isConnected}>
            <Button.Content hidden>
              <FormattedMessage
                id="app.control.run"
                description="Button label to start execution of the code"
                defaultMessage="Run"
              />
            </Button.Content>
            <Button.Content visible>
              <Icon name="play" />
            </Button.Content>
          </Button>
          <Button color="yellow" onMouseDown={(e) => e.preventDefault()} onClick={() => changeExecutionState(EXECUTION_STEP)} animated="vertical" style={{ verticalAlign: 'bottom' }} disabled={!isConnected}>
            <Button.Content hidden>
              <FormattedMessage
                id="app.control.step"
                description="Button label to step one place forward in the code"
                defaultMessage="Step"
              />
            </Button.Content>
            <Button.Content visible>
              <Icon name="step forward" />
            </Button.Content>
          </Button>
          <Button color="blue" onMouseDown={(e) => e.preventDefault()} onClick={() => changeExecutionState(EXECUTION_RESET)} animated="vertical" style={{ verticalAlign: 'bottom' }} disabled={!isConnected}>
            <Button.Content hidden>
              <FormattedMessage
                id="app.control.reset"
                description="Button label to reset to the beginning of the code"
                defaultMessage="Reset"
              />
            </Button.Content>
            <Button.Content visible>
              <Icon name="repeat" />
            </Button.Content>
          </Button>
        </>
      )
    }
  </>
);

Control.defaultProps = {
  isConnected: false,
};

Control.propTypes = {
  code: PropTypes.shape({
    execution: PropTypes.number,
  }).isRequired,
  isConnected: PropTypes.bool,
  changeExecutionState: PropTypes.func.isRequired,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Control));
