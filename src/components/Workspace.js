import React, { Component } from 'react';
import { Box, Grid } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Blockly from 'blockly';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { withCookies } from 'react-cookie';
import Interpreter from 'js-interpreter';
import { debounce } from 'throttle-debounce';

import { checkAuthError, authHeader } from '@/actions/auth';
import {
  updateJsCode as actionUpdateJsCode,
  updateXmlCode as actionUpdateXmlCode,
  changeExecutionState as actionChangeExecutionState,
  saveProgram as actionSaveProgram,
  EXECUTION_RUN,
  EXECUTION_STEP,
  EXECUTION_STOP,
  EXECUTION_RESET,
} from '@/actions/code';
import { append, clear } from '@/actions/console';
import { showNotification } from '@/actions/notification';
import { send } from '@/actions/rover';
import { COVERED } from '@/actions/sensor';
import {
  ButtonPress,
  Continue,
  DisplayMessage,
  LightSensorValue,
  LineSensorValue,
  MotorsStart,
  MotorsStop,
  SensorsGetCovered,
} from '@/blocks';
import BlocklyApi from '@/utils/blockly-api';
import { blocklyTheme } from '@/themes/light';

const mapStateToProps = ({ code, rover, sensor }) => ({ code, rover, sensor });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  updateJsCode: (jsCode) => dispatch(actionUpdateJsCode(jsCode)),
  changeExecutionState: (state) => dispatch(actionChangeExecutionState(state)),
  writeToConsole: (message) => dispatch(append(message)),
  clearConsole: () => dispatch(clear()),
  updateXmlCode: (xmlCode) => dispatch(actionUpdateXmlCode(xmlCode)),
  sendToRover: (channel, message) => dispatch(send(channel, message)),
  saveProgram: (id, content, name, lessonId, errorMessage) => dispatch(
    actionSaveProgram(id, content, name, lessonId, authHeader(cookies)),
  ).catch(checkAuthError(dispatch)).catch((error) => {
    const serverError = error.response && [502, 503, 504].includes(error.response.status);
    if (error.message === 'Network Error' || serverError) {
      // There was an error contacting the API
      dispatch(showNotification(errorMessage, 4000, 'error'));
    } else {
      throw error;
    }
  }),
});

Blockly.Blocks.button_press = ButtonPress.definition;
Blockly.JavaScript.button_press = ButtonPress.generator;
Blockly.Blocks.continue = Continue.definition;
Blockly.JavaScript.continue = Continue.generator;
Blockly.Blocks.display_message = DisplayMessage.definition;
Blockly.JavaScript.display_message = DisplayMessage.generator;
Blockly.Blocks.light_sensor_value = LightSensorValue.definition;
Blockly.JavaScript.light_sensor_value = LightSensorValue.generator;
Blockly.Blocks.line_sensor_value = LineSensorValue.definition;
Blockly.JavaScript.line_sensor_value = LineSensorValue.generator;
Blockly.Blocks.motors_start = MotorsStart.definition;
Blockly.JavaScript.motors_start = MotorsStart.generator;
Blockly.Blocks.motors_stop = MotorsStop.definition;
Blockly.JavaScript.motors_stop = MotorsStop.generator;
Blockly.Blocks.sensors_get_covered = SensorsGetCovered.definition;
Blockly.JavaScript.sensors_get_covered = SensorsGetCovered.generator;

const toolbox = `
    <xml id="toolbox" style="display: none">
      <category name="motors" colour="42">
        <block type="motors_start">
          <value name="SPEED">
            <block type="math_number">
              <field name="NUM">50</field>
            </block>
          </value>
        </block>
        <block type="motors_stop"></block>
      </category>
      <category name="sensors and buttons" colour="160">
        <block type="light_sensor_value"></block>
        <block type="line_sensor_value"></block>
        <block type="button_press"></block>
      </category>
      <category name="display" colour="230">
        <block type="display_message">
          <value name="MESSAGE">
            <block type="text">
              <field name="TEXT">Hi!</field>
            </block>
          </value>
        </block>
        <block type="text_print">
          <value name="TEXT">
            <block type="text">
              <field name="TEXT">Hi!</field>
            </block>
          </value>
        </block>
      </category>
      <category name="loops" colour="120">
        <block type="controls_whileUntil">
          <value name="BOOL">
            <block type="logic_boolean">
              <field name="BOOL">TRUE</field>
            </block>
          </value>
        </block>
        <block type="controls_repeat_ext">
          <value name="TIMES">
            <block type="math_number">
              <field name="NUM">4</field>
            </block>
          </value>
        </block>
        <block type="controls_for">
          <value name="FROM">
            <block type="math_number">
              <field name="NUM">1</field>
            </block>
          </value>
          <value name="TO">
            <block type="math_number">
              <field name="NUM">10</field>
            </block>
          </value>
          <value name="BY">
            <block type="math_number">
              <field name="NUM">2</field>
            </block>
          </value>
        </block>
      </category>
      <category name="logic" colour="210">
        <block type="controls_if"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
      </category>
      <category name="time" colour="330">
        <block type="continue">
          <value name="LENGTH">
            <block type="math_number">
              <field name="NUM">3</field>
            </block>
          </value>
        </block>
      </category>
      <category name="numbers" colour="230">
        <block type="math_number"></block>
        <block type="math_arithmetic"></block>
        <block type="math_single"></block>
        <block type="math_constant"></block>
        <block type="math_number_property"></block>
        <category name="more" colour="230">
          <block type="math_trig"></block>
          <block type="math_change"></block>
          <block type="math_round"></block>
          <block type="math_on_list"></block>
          <block type="math_modulo"></block>
          <block type="math_random_int"></block>
          <block type="math_random_float"></block>
        </category>
      </category>
      <category name="text" colour="160">
        <block type="text"></block>
        <block type="text_print"></block>
        <block type="text_join"></block>
        <category name="more" colour="160">
          <block type="text_append"></block>
          <block type="text_length"></block>
          <block type="text_isEmpty"></block>
          <block type="text_indexOf"></block>
          <block type="text_charAt"></block>
          <block type="text_getSubstring"></block>
          <block type="text_changeCase"></block>
          <block type="text_trim"></block>
        </category>
      </category>
      <sep></sep>
      <category name="variables" colour="20" custom="VARIABLE">
      </category>
      <category name="functions" colour="80" custom="PROCEDURE">
      </category>
      <sep></sep>
      <category name="advanced" colour="200">
        <category name="lists" colour="260">
          <block type="lists_create_empty"></block>
          <block type="lists_create_with"></block>
          <block type="controls_forEach"></block>
          <block type="lists_repeat"></block>
          <block type="lists_length"></block>
          <block type="lists_isEmpty"></block>
          <block type="lists_indexOf"></block>
          <block type="lists_getIndex"></block>
          <block type="lists_setIndex"></block>
          <block type="lists_getSublist"></block>
          <block type="lists_split"></block>
        </category>
      </category>
    </xml>`;

class Workspace extends Component {
  constructor(props) {
    super(props);
    const { intl, writeToConsole } = this.props;

    this.sensorStateCache = [];
    this.sensorStateCache.A_BUTTON = false;
    this.sensorStateCache.B_BUTTON = false;
    this.sensorStateCache.LEFT_LIGHT = -1;
    this.sensorStateCache.RIGHT_LIGHT = -1;
    this.sensorStateCache.LEFT_LINE = -1;
    this.sensorStateCache.RIGHT_LINE = -1;
    this.sleeping = false;
    this.runningEnabled = false;
    this.highlightPause = false;
    this.interpreter = null;
    this.saveErrorMessage = intl.formatMessage({
      id: 'app.workspace.save_error',
      description: 'Indicates that saving the program has failed',
      defaultMessage: 'Error saving program',
    });

    this.api = new BlocklyApi(this.highlightBlock, this.beginSleep,
      this.sensorStateCache, writeToConsole, this.sendToRover);

    this.state = {
      workspace: null,
      unsupportedProgram: false,
    };
  }

  componentDidMount() {
    const { clearConsole, intl, writeToConsole } = this.props;

    const consoleStart = intl.formatMessage({
      id: 'app.workspace.console',
      description: 'Indicates that the console has started',
      defaultMessage: 'console started',
    });

    Blockly.HSV_SATURATION = 1.00;
    Blockly.HSV_VALUE = 1.00;
    Blockly.Flyout.prototype.CORNER_RADIUS = 0;

    this.createWorkspace();

    clearConsole();
    writeToConsole(`Rovercode ${consoleStart}`);
  }

  componentDidUpdate(prevProps) {
    const { code: currentCode, rover: currentRover } = prevProps;
    const { code: nextCode, sensor, rover: nextRover } = this.props;

    this.updateSensorStateCache(sensor.left, sensor.right,
      sensor.leftLightSensorReading, sensor.rightLightSensorReading,
      sensor.leftLineSensorReading, sensor.rightLineSensorReading);

    if (currentCode && currentCode.isReadOnly && nextCode && !nextCode.isReadOnly) {
      this.createWorkspace();
    }

    if (currentRover && currentRover.isSending && nextRover && !nextRover.isSending) {
      this.runCode();
    }

    // Ignore if execution state has not changed unless stepping
    if (nextCode.execution === currentCode.execution && nextCode.execution !== EXECUTION_STEP) {
      return;
    }

    switch (nextCode.execution) {
      case EXECUTION_RUN:
        this.goToRunningState();
        break;
      case EXECUTION_STEP:
        this.stepCode();
        break;
      case EXECUTION_STOP:
        this.goToStopState();
        break;
      case EXECUTION_RESET:
        this.resetCode();
        break;
      default:
        break;
    }
  }

  sendToRover = (command) => {
    const { rover, sendToRover } = this.props;

    if (rover.rover) {
      const encoder = new TextEncoder();
      sendToRover(rover.transmitChannel, encoder.encode(command));
    }
  }

  updateSensorStateCache = (
    leftState,
    rightState,
    leftLightSensorReading,
    rightLightSensorReading,
    leftLineSensorReading,
    rightLineSensorReading,
  ) => {
    this.sensorStateCache.A_BUTTON = leftState === COVERED;
    this.sensorStateCache.B_BUTTON = rightState === COVERED;
    this.sensorStateCache.LEFT_LIGHT = leftLightSensorReading;
    this.sensorStateCache.RIGHT_LIGHT = rightLightSensorReading;
    this.sensorStateCache.LEFT_LINE = leftLineSensorReading;
    this.sensorStateCache.RIGHT_LINE = rightLineSensorReading;
  }

  onWorkspaceAvailable = (code) => {
    this.loadDesign(code);
    this.onResize();
  }

  onResize = () => {
    // https://developers.google.com/blockly/guides/configure/web/resizable
    const { workspace } = this.state;

    const blocklyArea = document.getElementById('blocklyDiv').parentNode.parentNode;

    // Position blocklyDiv over blocklyArea.
    if (this.editorDiv) {
      this.editorDiv.style.left = '0px';
      this.editorDiv.style.top = '0px';
      this.editorDiv.style.width = `${blocklyArea.offsetWidth}px`;
      this.editorDiv.style.height = `${blocklyArea.offsetHeight}px`;
    }
    Blockly.svgResize(workspace);
  }

  createWorkspace = () => {
    const { code, sensor } = this.props;
    const { workspace: oldWorkspace } = this.state;

    // Clear any prior Blockly workspaces since `readOnly` cannot be changed
    // https://groups.google.com/forum/#!topic/blockly/NCukwTKMR0U
    if (oldWorkspace) {
      const oldElements = document.getElementsByClassName('injectionDiv');
      [...oldElements].forEach((element) => element.remove());
    }

    const workspace = Blockly.inject(this.editorDiv, {
      theme: blocklyTheme,
      toolbox,
      zoom: {
        controls: true,
        wheel: false,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: true,
      readOnly: code.isReadOnly,
      scrollbars: true,
    });

    workspace.addChangeListener(
      debounce(
        parseInt(SAVE_DEBOUNCE_TIME, 10) || 5000, this.updateCode, // eslint-disable-line no-undef
      ),
    );

    this.updateSensorStateCache(sensor.left, sensor.right,
      sensor.leftLightSensorReading, sensor.rightLightSensorReading,
      sensor.leftLineSensorReading, sensor.rightLineSensorReading);

    this.setState({
      workspace,
    }, () => this.onWorkspaceAvailable(code.xmlCode));

    window.addEventListener('resize', this.onResize, false);
  }

  updateXmlCode = () => {
    const { updateXmlCode } = this.props;
    const { workspace } = this.state;

    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xmlCode = Blockly.Xml.domToText(xml);

    updateXmlCode(xmlCode);

    return xmlCode;
  }

  updateJsCode = () => {
    const { updateJsCode } = this.props;
    const { workspace } = this.state;

    const code = Blockly.JavaScript.workspaceToCode(workspace);
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    if (workspace) {
      workspace.highlightBlock(null);
    }

    updateJsCode(code);

    this.interpreter = new Interpreter(code, this.api.initApi);

    return code;
  }

  updateCode = () => {
    const { code, saveProgram } = this.props;

    this.updateJsCode();
    const xmlCode = this.updateXmlCode();

    if (!code.isReadOnly && code.id) {
      saveProgram(code.id, xmlCode, code.name, code.lesson, this.saveErrorMessage);
    }
  }

  beginSleep = (sleepTimeInMs) => {
    this.sleeping = true;

    setTimeout(this.endSleep, sleepTimeInMs);
  }

  endSleep = () => {
    this.sleeping = false;

    if (this.runningEnabled) {
      this.runCode();
    }
  }

  runCode = () => {
    const { rover } = this.props;

    if (this.stepCode() && this.runningEnabled && !this.sleeping && !rover.isSending) {
      setTimeout(this.runCode, 20);
    }
  }

  stepCode = () => {
    const { workspace } = this.state;
    const { rover } = this.props;

    if (this.sleeping || rover.isSending) {
      return true;
    }

    const ok = this.interpreter.step();
    if (!ok) {
      // Program complete, no more code to execute.
      workspace.highlightBlock(null);
      this.resetCode();
      return false;
    }

    if (this.highlightPause) {
      // A block has been highlighted.  Pause execution here.
      this.highlightPause = false;
    } else {
      // Keep executing until a highlight statement is reached.
      this.stepCode();
    }

    return true;
  }

  resetCode = () => {
    const { changeExecutionState } = this.props;

    changeExecutionState(EXECUTION_STOP);
    this.updateCode();
  }

  goToRunningState = () => {
    this.updateCode();
    this.runningEnabled = true;
    this.runCode();
  }

  goToStopState = () => {
    const { changeExecutionState } = this.props;

    this.api.sendMotorCommand('BOTH', 'FORWARD', 0);
    this.runningEnabled = false;
    changeExecutionState(EXECUTION_STOP);
  }

  highlightBlock = (id) => {
    const { workspace } = this.state;

    const comment = workspace.getBlockById(id).getCommentText();
    if (comment && comment.indexOf('PASS') > -1) {
      this.highlightPause = false;
    } else {
      this.highlightPause = true;
      workspace.highlightBlock(id);
    }
  }

  loadDesign = (xmlCode) => {
    const { workspace } = this.state;

    workspace.clear();

    const xmlDom = Blockly.Xml.textToDom(xmlCode);
    try {
      Blockly.Xml.domToWorkspace(xmlDom, workspace);
      this.setState({
        unsupportedProgram: false,
      }, this.updateCode);
    } catch (err) {
      this.setState({
        unsupportedProgram: true,
      });
    }
  }


  render() {
    const { children, code, rover } = this.props;
    const { unsupportedProgram } = this.state;

    return (
      <Box>
        <Grid container direction="column" justify="center" alignItems="center">
          {
            unsupportedProgram ? (
              <Grid item>
                <Alert variant="outlined" severity="error">
                  <AlertTitle>
                    <FormattedMessage
                      id="app.workspace.program_error_title"
                      description="Notifies the user of an error loading a program"
                      defaultMessage="Error loading program"
                    />
                  </AlertTitle>
                  <FormattedMessage
                    id="app.workspace.program_error_description"
                    description="Notifies the user of an error loading a program"
                    defaultMessage="This program is no longer supported."
                  />
                </Alert>
              </Grid>
            ) : (
              <Grid item container direction="column" alignItems="stretch">
                <Grid item style={{ minHeight: code.isReadOnly ? '76vh' : '80vh', maxHeight: '1080px' }}>
                  <div ref={(editorDiv) => { this.editorDiv = editorDiv; }} id="blocklyDiv">
                    <Box
                      zIndex="modal"
                      style={{ position: 'absolute', bottom: '15%', left: code.isReadOnly ? '5%' : '15%' }}
                    >
                      {
                        React.Children.map(children, (child) => React.cloneElement(child, {
                          isConnected: !!rover.rover,
                        }))
                      }
                    </Box>
                  </div>
                </Grid>
              </Grid>
            )
          }
        </Grid>
      </Box>
    );
  }
}

Workspace.defaultProps = {
  rover: {
    rover: null,
  },
};

Workspace.propTypes = {
  code: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    jsCode: PropTypes.string,
    xmlCode: PropTypes.string,
    isReadOnly: PropTypes.bool,
    lesson: PropTypes.number,
  }).isRequired,
  sensor: PropTypes.shape({
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    leftLightSensorReading: PropTypes.number.isRequired,
    rightLightSensorReading: PropTypes.number.isRequired,
    leftLineSensorReading: PropTypes.number.isRequired,
    rightLineSensorReading: PropTypes.number.isRequired,
  }).isRequired,
  rover: PropTypes.shape({
    transmitChannel: PropTypes.object,
    isSending: PropTypes.bool,
    rover: PropTypes.object,
  }),
  updateJsCode: PropTypes.func.isRequired,
  updateXmlCode: PropTypes.func.isRequired,
  changeExecutionState: PropTypes.func.isRequired,
  writeToConsole: PropTypes.func.isRequired,
  clearConsole: PropTypes.func.isRequired,
  saveProgram: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  sendToRover: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default hot(module)(
  withCookies(injectIntl(connect(mapStateToProps, mapDispatchToProps)(Workspace))),
);
