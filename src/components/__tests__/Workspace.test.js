import React from 'react';
import toJson from 'enzyme-to-json';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import { updateValidAuth } from '@/actions/auth';
import { COVERED, NOT_COVERED } from '@/actions/sensor';
import Workspace from '../Workspace'; // eslint-disable-line import/order

jest.mock('node-blockly/browser');
jest.mock('@/actions/code');
jest.mock('@/actions/rover');

import Blockly from 'node-blockly/browser'; // eslint-disable-line import/first, import/order
import { // eslint-disable-line import/first
  changeExecutionState,
  saveProgram,
  EXECUTION_RUN,
  EXECUTION_STEP,
  EXECUTION_STOP,
  EXECUTION_RESET,
} from '@/actions/code'; // eslint-disable-line import/order
import { send } from '@/actions/rover'; // eslint-disable-line import/first, import/order

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The Workspace component', () => {
  const mockStore = configureStore();
  const context = { cookies };
  let store;
  let playground = null;

  beforeEach(() => {
    store = mockStore({
      code: {
        jsCode: '',
        execution: null,
        name: 'test program',
        id: 1,
        lessonId: null,
      },
      sensor: {
        left: NOT_COVERED,
        right: NOT_COVERED,
        leftLightSensorReading: -1,
        rightLightSensorReading: -1,
      },
      rover: {
        transmitChannel: {
          writeValue: jest.fn(),
        },
        rover: {
          name: 'togaz',
        },
      },
    });
    store.dispatch = jest.fn().mockResolvedValue();
    playground = {
      addChangeListener: jest.fn((cb) => { cb(); }),
      highlightBlock: jest.fn(),
      clear: jest.fn(),
    };
    Blockly.svgResize.mockReset();
    Blockly.inject.mockReset();
    Blockly.JavaScript.workspaceToCode.mockReset();
    Blockly.Xml.workspaceToDom.mockReset();
    Blockly.Xml.domToText.mockReset();
    Blockly.inject.mockImplementation(() => playground);
    Blockly.JavaScript.workspaceToCode.mockImplementation(() => 'test-code');
    Blockly.Xml.workspaceToDom.mockImplementation(() => 'test-xml');
    Blockly.Xml.domToText.mockImplementation(() => 'test-dom-text');
    Blockly.Xml.textToDom.mockImplementation(() => 'test-dom');

    document.body.innerHTML = '<div><div id="blocklyDiv"></div></div>';
  });

  test('renders on the page with no errors', () => {
    const wrapper = mountWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    );

    expect(toJson(wrapper.find(Workspace))).toMatchSnapshot();
  });

  test('adds correct code prefix', () => {
    Blockly.JavaScript.workspaceToCode.mockReturnValue('testText');

    const wrapper = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    wrapper.setState({
      workspace: null,
    });
    wrapper.instance().updateJsCode();
    expect(Blockly.JavaScript.STATEMENT_PREFIX).toEqual('highlightBlock(%1);\n');
  });

  test('goes to running state on state change', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().goToRunningState = jest.fn();
    workspace.setProps({
      code: {
        execution: EXECUTION_RUN,
      },
    });
    workspace.update();

    expect(workspace.instance().goToRunningState).toHaveBeenCalled();
  });

  test('steps on state change', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().stepCode = jest.fn();
    workspace.setProps({
      code: {
        execution: EXECUTION_STEP,
      },
    });
    workspace.update();

    expect(workspace.instance().stepCode).toHaveBeenCalled();
  });

  test('goes to stop state on state change', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().goToStopState = jest.fn();
    workspace.setProps({
      code: {
        execution: EXECUTION_STOP,
      },
    });
    workspace.update();

    expect(workspace.instance().goToStopState).toHaveBeenCalled();
  });

  test('resets on state change', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().resetCode = jest.fn();
    workspace.setProps({
      code: {
        execution: EXECUTION_RESET,
      },
    });
    workspace.update();

    expect(workspace.instance().resetCode).toHaveBeenCalled();
  });

  test('runs code when done sending Bluetooth message to rover', () => {
    store.getState().rover.isSending = true;
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().runCode = jest.fn();
    workspace.setProps({
      rover: {
        isSending: false,
      },
    });
    workspace.update();

    expect(workspace.instance().runCode).toHaveBeenCalled();
  });

  test('does nothing on invalid state change', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().goToRunningState = jest.fn();
    workspace.instance().stepCode = jest.fn();
    workspace.instance().goToStopState = jest.fn();
    workspace.instance().resetCode = jest.fn();
    workspace.setProps({
      code: {
        execution: -1,
      },
    });
    workspace.update();

    expect(workspace.instance().goToRunningState).not.toHaveBeenCalled();
    expect(workspace.instance().stepCode).not.toHaveBeenCalled();
    expect(workspace.instance().goToStopState).not.toHaveBeenCalled();
    expect(workspace.instance().resetCode).not.toHaveBeenCalled();
  });

  test('exits sleep after specified time', (done) => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().endSleep = jest.fn(() => done());
    workspace.update();
    workspace.instance().beginSleep(0);
  });

  test('updates javascript code', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store} location={{}}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().updateJsCode = jest.fn();
    workspace.update();
    workspace.instance().updateCode();

    expect(workspace.instance().updateJsCode).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(saveProgram());
  });

  test('recreates workspace when no longer read-only', () => {
    store.getState().code.isReadOnly = true;
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().createWorkspace = jest.fn();
    workspace.setProps({
      code: {
        isReadOnly: false,
      },
    });
    workspace.update();

    expect(workspace.instance().createWorkspace).toHaveBeenCalled();
  });

  test('updates javascript code when read only', () => {
    const localStore = mockStore({
      code: {
        jsCode: '',
        execution: null,
        name: 'test program',
        isReadOnly: true,
      },
      sensor: {
        left: NOT_COVERED,
        right: NOT_COVERED,
        leftLightSensorReading: -1,
        rightLightSensorReading: -1,
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue();
    const workspace = shallowWithIntl(
      <Workspace store={localStore}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().updateJsCode = jest.fn();
    workspace.update();
    workspace.instance().updateCode();

    expect(workspace.instance().updateJsCode).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(saveProgram());
  });

  test('runs code after waking if running', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().runCode = jest.fn();
    workspace.instance().runningEnabled = true;
    workspace.update();
    workspace.instance().endSleep();

    expect(workspace.instance().runCode).toHaveBeenCalled();
  });

  test('doesn\'t run code after waking if not running', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().runCode = jest.fn();
    workspace.instance().runningEnabled = false;
    workspace.update();
    workspace.instance().endSleep();

    expect(workspace.instance().runCode).not.toHaveBeenCalled();
  });

  test('runs code when not at end, running, and not sleeping or sending to rover', () => {
    jest.useFakeTimers();

    store.getState().rover.isSending = false;
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().stepCode = jest.fn(() => true);
    workspace.instance().runningEnabled = true;
    workspace.instance().sleeping = false;
    workspace.update();
    workspace.instance().runCode();

    expect(setTimeout).toHaveBeenCalledTimes(2);
  });

  test('doesn\'t run code when sending to rover', () => {
    jest.useFakeTimers();

    store.getState().rover.isSending = true;
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().stepCode = jest.fn(() => true);
    workspace.instance().runningEnabled = true;
    workspace.instance().sleeping = false;
    workspace.update();
    workspace.instance().runCode();

    expect(setTimeout).toHaveBeenCalledTimes(1);
  });


  test('doesn\'t run code when at the end', () => {
    jest.useFakeTimers();

    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().stepCode = jest.fn(() => false);
    workspace.update();
    workspace.instance().runCode();

    expect(setTimeout).toHaveBeenCalledTimes(1);
  });

  test('doesn\'t run code when not running', () => {
    jest.useFakeTimers();

    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().stepCode = jest.fn(() => true);
    workspace.instance().runningEnabled = false;
    workspace.update();
    workspace.instance().runCode();

    expect(setTimeout).toHaveBeenCalledTimes(1);
  });

  test('doesn\'t run code when sleeping', () => {
    jest.useFakeTimers();

    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().stepCode = jest.fn(() => true);
    workspace.instance().runningEnabled = true;
    workspace.instance().sleeping = true;
    workspace.update();
    workspace.instance().runCode();

    expect(setTimeout).toHaveBeenCalledTimes(1);
  });

  test('stops stepping when at the end', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.setState({
      interpreter: {
        step: jest.fn(() => false),
      },
    });
    const result = workspace.instance().stepCode();

    expect(result).toBe(false);
    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_STOP));
  });

  test('stops stepping when highlighted', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.setState({
      interpreter: {
        step: jest.fn(() => true),
      },
    });
    workspace.instance().goToStopState = jest.fn();
    workspace.instance().highlightPause = true;
    workspace.update();
    const result = workspace.instance().stepCode();

    expect(result).toBe(true);
    expect(workspace.instance().highlightPause).toBe(false);
  });

  test('stops stepping when sleeping', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    const mockInterpreter = {
      step: jest.fn(() => true),
    };
    workspace.setState({
      interpreter: mockInterpreter,
    });
    workspace.update();
    workspace.instance().sleeping = true;
    const result = workspace.instance().stepCode();

    expect(result).toBe(true);
    expect(mockInterpreter.step).not.toHaveBeenCalled();
  });

  test('continues stepping when not at the end', () => {
    const mockStep = jest.fn();
    mockStep.mockReturnValueOnce(true).mockReturnValueOnce(false);
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.setState({
      interpreter: {
        step: mockStep,
      },
    });
    workspace.instance().goToStopState = jest.fn();
    workspace.update();
    const result = workspace.instance().stepCode();

    expect(result).toBe(true);
  });

  test('stops and updates code on reset', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().updateCode = jest.fn();
    workspace.update();
    workspace.instance().resetCode();

    expect(workspace.instance().updateCode).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_STOP));
  });

  test('updates and runs code when going to running state', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().updateCode = jest.fn();
    workspace.instance().runCode = jest.fn();
    workspace.update();
    workspace.instance().goToRunningState();

    expect(workspace.instance().updateCode).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenCalled();
    expect(workspace.instance().runningEnabled).toBe(true);
  });

  test('halts execution when going to stop state', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().api.sendMotorCommand = jest.fn();
    workspace.instance().goToStopState();
    expect(workspace.instance().api.sendMotorCommand).toHaveBeenCalledWith('BOTH', 'FORWARD', 0);
    expect(workspace.instance().runningEnabled).toBe(false);
  });

  test('highlights block', () => {
    playground.getBlockById = jest.fn(() => ({
      getCommentText: () => 'highlightBlock(\'LkcrRd=UT=:*2QSbfwlK\');',
    }));
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().highlightBlock(1);

    expect(workspace.instance().highlightPause).toBe(true);
    expect(playground.highlightBlock).toHaveBeenCalled();
    expect(playground.highlightBlock).toHaveBeenCalledWith(1);
  });

  test('doesn\'t highlight block with PASS', () => {
    playground.getBlockById = jest.fn(() => ({
      getCommentText: () => 'PASS',
    }));
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    playground.highlightBlock.mockReset();
    workspace.instance().highlightBlock(1);

    expect(workspace.instance().highlightPause).toBe(false);
    expect(playground.highlightBlock).not.toHaveBeenCalled();
  });

  test('initializes workspace when program already loaded', () => {
    const localStore = mockStore({
      code: {
        xmlCode: '<xml></xml>',
      },
      sensor: {
        left: NOT_COVERED,
        right: NOT_COVERED,
        leftLightSensorReading: -1,
        rightLightSensorReading: -1,
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue();
    shallowWithIntl(
      <Workspace store={localStore}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    expect(playground.clear).toHaveBeenCalled();
    expect(Blockly.Xml.domToWorkspace).toHaveBeenCalled();
    expect(Blockly.Xml.domToWorkspace).toHaveBeenCalledWith(playground, 'test-dom');
  });

  test('handles authentication error when saving', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn();
    store.dispatch.mockRejectedValueOnce(error);
    store.dispatch.mockResolvedValue();

    const wrapper = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive();
    wrapper.props().saveProgram(1, '<xml></xml>', 'test').then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        saveProgram(1, '<xml></xml>', 'test', {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles other error when saving', (done) => {
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn().mockRejectedValue(error);

    const wrapper = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive();
    wrapper.props().saveProgram(1, '<xml></xml>', 'test').catch(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        saveProgram(1, '<xml></xml>', 'test', {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });

  test('sets sensor cache correctly', () => {
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    expect(workspace.instance().sensorStateCache.A_BUTTON).toBe(false);
    expect(workspace.instance().sensorStateCache.B_BUTTON).toBe(false);

    workspace.setProps({
      sensor: {
        left: COVERED,
        right: NOT_COVERED,
        leftLightSensorReading: -1,
        rightLightSensorReading: -1,
      },
    });

    expect(workspace.instance().sensorStateCache.A_BUTTON).toBe(true);
    expect(workspace.instance().sensorStateCache.B_BUTTON).toBe(false);

    workspace.setProps({
      sensor: {
        left: COVERED,
        right: COVERED,
        leftLightSensorReading: -1,
        rightLightSensorReading: -1,
      },
    });

    expect(workspace.instance().sensorStateCache.A_BUTTON).toBe(true);
    expect(workspace.instance().sensorStateCache.B_BUTTON).toBe(true);

    workspace.setProps({
      sensor: {
        left: NOT_COVERED,
        right: COVERED,
        leftLightSensorReading: -1,
        rightLightSensorReading: -1,
      },
    });

    expect(workspace.instance().sensorStateCache.A_BUTTON).toBe(false);
    expect(workspace.instance().sensorStateCache.B_BUTTON).toBe(true);
  });

  test('dispatches an action when sending to rover', () => {
    const wrapper = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    wrapper.instance().sendToRover('command');

    expect(store.dispatch).toHaveBeenCalledWith(send(store.getState().rover.transmitChannel, 'command'));
  });

  test('dispatches an action when sending to rover with no connected rover', () => {
    const localStore = mockStore({
      code: {
        id: 1,
        name: 'test program',
        xmlCode: '<xml></xml>',
      },
      sensor: {
        left: NOT_COVERED,
        right: NOT_COVERED,
        leftLightSensorReading: -1,
        rightLightSensorReading: -1,
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue();
    const wrapper = shallowWithIntl(
      <Workspace store={localStore}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    wrapper.instance().sendToRover('command');

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  test('Replaces blockly if exists', () => {
    const mockElement = {
      remove: jest.fn(),
    };
    document.getElementsByClassName = jest.fn(() => ([
      mockElement,
      mockElement,
    ]));
    const workspace = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.instance().updateCode = jest.fn();
    workspace.setState({
      workspace: {},
    });
    workspace.instance().createWorkspace();

    expect(document.getElementsByClassName).toHaveBeenCalledTimes(1);
    expect(mockElement.remove).toHaveBeenCalledTimes(2);
  });

  test('debounces save actions', () => {
    jest.useFakeTimers();

    shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    store.dispatch.mockClear();

    expect(store.dispatch).not.toHaveBeenCalledWith(saveProgram());

    jest.advanceTimersByTime(500);

    expect(store.dispatch).not.toHaveBeenCalledWith(saveProgram());

    jest.advanceTimersByTime(500);

    expect(store.dispatch).toHaveBeenCalledWith(saveProgram());
  });

  test('handles unset debounce time', () => {
    jest.useFakeTimers();

    const builtInParseInt = global.parseInt;
    global.parseInt = () => NaN;

    shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    store.dispatch.mockClear();

    expect(store.dispatch).not.toHaveBeenCalledWith(saveProgram());

    jest.advanceTimersByTime(2000);

    expect(store.dispatch).not.toHaveBeenCalledWith(saveProgram());

    jest.advanceTimersByTime(5000);

    expect(store.dispatch).toHaveBeenCalledWith(saveProgram());

    global.parseInt = builtInParseInt;
  });
});
