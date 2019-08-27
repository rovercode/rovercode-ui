import React, { Component, Fragment } from 'react';
import { Button, Grid, Message } from 'semantic-ui-react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Blockly from 'node-blockly/browser';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { withCookies } from 'react-cookie';
import Interpreter from 'js-interpreter';

import { checkAuthError, authHeader } from '@/actions/auth';
import {
  updateJsCode as actionUpdateJsCode,
  updateXmlCode as actionUpdateXmlCode,
  changeExecutionState as actionChangeExecutionState,
  saveProgram as actionSaveProgram,
  createProgram as actionCreateProgram,
  changeReadOnly as actionChangeReadOnly,
  fetchProgram as actionFetchProgram,
  EXECUTION_RUN,
  EXECUTION_STEP,
  EXECUTION_STOP,
  EXECUTION_RESET,
} from '@/actions/code';
import { append, clear } from '@/actions/console';
import { pushCommand } from '@/actions/rover';
import { COVERED } from '@/actions/sensor';
import BlocklyApi from '@/utils/blockly-api';

const mapStateToProps = ({ code, sensor }) => ({ code, sensor });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  updateJsCode: jsCode => dispatch(actionUpdateJsCode(jsCode)),
  changeExecutionState: state => dispatch(actionChangeExecutionState(state)),
  writeToConsole: message => dispatch(append(message)),
  clearConsole: () => dispatch(clear()),
  updateXmlCode: xmlCode => dispatch(actionUpdateXmlCode(xmlCode)),
  sendToRover: command => dispatch(pushCommand(command)),
  changeReadOnly: isReadOnly => dispatch(actionChangeReadOnly(isReadOnly)),
  saveProgram: (id, content, name) => dispatch(
    actionSaveProgram(id, content, name, authHeader(cookies)),
  ).catch(checkAuthError(dispatch)),
  createProgram: name => dispatch(actionCreateProgram(name, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  fetchProgram: id => dispatch(actionFetchProgram(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
});

const toolbox = `
    <xml id="toolbox" style="display: none">
      <category name="loops" colour="282">
        <block type="controls_whileUntil"></block>
        <block type="controls_repeat_ext"></block>
        <block type="controls_for"></block>
        <block type="controls_forEach"></block>
      </category>
      <category name="logic" colour="210">
        <block type="controls_if"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
      </category>
      <category name="time" colour="330">
        <block type="continue"></block>
      </category>
      <category name="motors" colour="42">
        <block type="motors_start"></block>
        <block type="motors_stop"></block>
      </category>
      <category name="sensors" colour="160">
        <block type="sensors_get_covered"></block>
      </category>
      <category name="lights" colour="20">
        <block type="chainable_rgb_led_set">
          <value name="LED_ID">
            <block type="math_number">
              <field name="NUM">0</field>
            </block>
          </value>
        </block>
        <block type="colour_picker"></block>
        <block type="colour_random"></block>
        <block type="colour_rgb"></block>
        <block type="colour_blend"></block>
      </category>
      <category name="numbers" colour="230">
        <block type="math_number"></block>
        <block type="math_arithmetic"></block>
        <block type="math_single"></block>
        <block type="math_trig"></block>
        <block type="math_constant"></block>
        <block type="math_number_property"></block>
        <block type="math_change"></block>
        <block type="math_round"></block>
        <block type="math_on_list"></block>
        <block type="math_modulo"></block>
        <block type="math_constrain"></block>
        <block type="math_random_int"></block>
        <block type="math_random_float"></block>
      </category>
      <category name="text" colour="160">
        <block type="text"></block>
        <block type="text_print"></block>
        <block type="text_append"></block>
        <block type="text_length"></block>
        <block type="text_isEmpty"></block>
        <block type="text_indexOf"></block>
        <block type="text_charAt"></block>
        <block type="text_getSubstring"></block>
        <block type="text_changeCase"></block>
        <block type="text_trim"></block>
        <block type="text_join"></block>
      </category>
      <category name="advanced" colour="200">
        <category name="events" colour="230">
          <block type="pop_event_queue"></block>
        </category>
        <category name="lists" colour="260">
          <block type="lists_create_empty"></block>
          <block type="lists_create_with"></block>
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
      <sep></sep>
      <category name="variables" colour="20" custom="VARIABLE">
      </category>
      <category name="functions" colour="80" custom="PROCEDURE">
      </category>
    </xml>`;

class Workspace extends Component {
  constructor(props) {
    super(props);
    const { sendToRover, writeToConsole } = this.props;

    this.sensorStateCache = [];
    this.sensorStateCache.SENSORS_leftIr = false;
    this.sensorStateCache.SENSORS_rightIr = false;
    this.sleeping = false;
    this.runningEnabled = false;
    this.highlightPause = false;

    this.api = new BlocklyApi(this.highlightBlock, this.beginSleep,
      this.sensorStateCache, writeToConsole, sendToRover);

    this.state = {
      workspace: null,
      interpreter: null,
    };
  }

  componentDidMount() {
    const { clearConsole, intl, writeToConsole } = this.props;

    const consoleStart = intl.formatMessage({
      id: 'app.workspace.console',
      description: 'Indicates that the console has started',
      defaultMessage: 'console started',
    });

    Blockly.HSV_SATURATION = 0.85;
    Blockly.HSV_VALUE = 0.9;
    Blockly.Flyout.prototype.CORNER_RADIUS = 0;
    Blockly.BlockSvg.START_HAT = true;

    this.createWorkspace();

    clearConsole();
    writeToConsole(`Rovercode ${consoleStart}`);
  }

  componentWillUpdate(nextProps) {
    const { code: currentCode } = this.props;
    const { code: nextCode } = nextProps;

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

  componentDidUpdate() {
    const { sensor } = this.props;

    this.updateSensorStateCache(sensor.left, sensor.right);
  }

  updateSensorStateCache = (leftState, rightState) => {
    this.sensorStateCache.SENSORS_leftIr = leftState === COVERED;
    this.sensorStateCache.SENSORS_rightIr = rightState === COVERED;
  }

  onWorkspaceAvailable = (code) => {
    this.loadDesign(code);
    this.onResize();
  }

  onResize = () => {
    // https://developers.google.com/blockly/guides/configure/web/resizable
    const { workspace } = this.state;

    // Compute the absolute coordinates and dimensions of blocklyArea.
    const blocklyArea = document.getElementById('blocklyDiv').parentNode;
    let element = blocklyArea;
    let x = 0;
    let y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.parentNode;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    if (this.editorDiv) {
      this.editorDiv.style.left = `${x}px`;
      this.editorDiv.style.top = `${y}px`;
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
      [...oldElements].forEach(element => element.remove());
    }

    const workspace = Blockly.inject(this.editorDiv, {
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

    workspace.addChangeListener(this.updateCode);

    this.updateSensorStateCache(sensor.left, sensor.right);

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

    this.setState({
      interpreter: new Interpreter(code, this.api.initApi),
    });

    return code;
  }

  updateCode = () => {
    const { code, saveProgram } = this.props;

    this.updateJsCode();
    const xmlCode = this.updateXmlCode();

    if (!code.isReadOnly) {
      saveProgram(code.id, xmlCode, code.name);
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
    if (this.stepCode() && this.runningEnabled && !this.sleeping) {
      setTimeout(this.runCode, 10);
    }
  }

  stepCode = () => {
    const { changeExecutionState } = this.props;
    const { interpreter, workspace } = this.state;

    const ok = interpreter.step();
    if (!ok) {
      // Program complete, no more code to execute.
      workspace.highlightBlock(null);
      changeExecutionState(EXECUTION_STOP);
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

    this.api.sendMotorCommand('LEFT', 'FORWARD', 0);
    this.api.sendMotorCommand('LEFT', 'BACKWARD', 0);
    this.api.sendMotorCommand('RIGHT', 'FORWARD', 0);
    this.api.sendMotorCommand('RIGHT', 'BACKWARD', 0);
    this.runningEnabled = false;
    changeExecutionState(EXECUTION_STOP);
  }

  highlightBlock = (id) => {
    const { workspace } = this.state;

    if (workspace.getBlockById(id).getCommentText().indexOf('PASS') > -1) {
      this.highlightPause = false;
    } else {
      this.highlightPause = true;
      workspace.highlightBlock(id);
    }
  }

  loadDesign = (xmlCode) => {
    const { createProgram } = this.props;

    if (!xmlCode) {
      // No program already loaded, create a new one
      const number = (Math.floor(Math.random() * 1000));
      createProgram(`Unnamed_Design_${number}`);
      return;
    }

    const { workspace } = this.state;

    workspace.clear();

    const xmlDom = Blockly.Xml.textToDom(xmlCode);
    Blockly.Xml.domToWorkspace(workspace, xmlDom);

    this.updateCode();
  }

  remix = () => {
    const {
      code,
      changeReadOnly,
      createProgram,
      fetchProgram,
      saveProgram,
    } = this.props;

    // Need to fetch the program again since the current code has editable="false" tags
    return Promise.all([fetchProgram(code.id), createProgram(code.name)])
      .then(([fetchData, createData]) => saveProgram(
        createData.value.id, fetchData.value.content, createData.value.name,
      ))
      .then(() => {
        changeReadOnly(false);
        this.createWorkspace();
      });
  }

  render() {
    const { children, code } = this.props;

    return (
      <Fragment>
        {
          code.isReadOnly ? (
            <Grid verticalAlign="middle">
              <Grid.Column width={12}>
                <Message info>
                  <Message.Header>
                    <FormattedMessage
                      id="app.workspace.read_only_header"
                      description="Header to indicate viewing in read only mode"
                      defaultMessage="Read Only View"
                    />
                  </Message.Header>
                  <FormattedMessage
                    id="app.workspace.read_only_content"
                    description="Informs the user that this program is another user's and cannot be edited"
                    defaultMessage="You are viewing another user's program in a read-only view."
                  />
                </Message>
              </Grid.Column>
              <Grid.Column width={4}>
                <Button primary size="huge" onClick={this.remix}>
                  <FormattedMessage
                    id="app.workspace.remix"
                    description="Button label to copy other user's program for this user to edit"
                    defaultMessage="Remix"
                  />
                </Button>
              </Grid.Column>
            </Grid>
          ) : (null)
        }
        <div ref={(editorDiv) => { this.editorDiv = editorDiv; }} style={{ position: 'absolute' }} id="blocklyDiv">
          <div style={{ position: 'absolute', bottom: 30, right: 100 }}>
            { children }
          </div>
        </div>
      </Fragment>
    );
  }
}

Workspace.propTypes = {
  code: PropTypes.shape({
    jsCode: PropTypes.string,
    isReadOnly: PropTypes.bool,
  }).isRequired,
  sensor: PropTypes.shape({
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
  }).isRequired,
  updateJsCode: PropTypes.func.isRequired,
  updateXmlCode: PropTypes.func.isRequired,
  changeExecutionState: PropTypes.func.isRequired,
  writeToConsole: PropTypes.func.isRequired,
  clearConsole: PropTypes.func.isRequired,
  saveProgram: PropTypes.func.isRequired,
  createProgram: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  sendToRover: PropTypes.func.isRequired,
  changeReadOnly: PropTypes.func.isRequired,
  fetchProgram: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default hot(module)(
  withCookies(injectIntl(connect(mapStateToProps, mapDispatchToProps)(Workspace))),
);
