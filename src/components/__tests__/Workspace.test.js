import React from 'react';
import { Message } from 'semantic-ui-react';
import toJson from 'enzyme-to-json';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import { updateValidAuth } from '@/actions/auth';
import {
  changeExecutionState,
  createProgram,
  fetchProgram,
  saveProgram,
  EXECUTION_RUN,
  EXECUTION_STEP,
  EXECUTION_STOP,
  EXECUTION_RESET,
} from '@/actions/code';
import { COVERED, NOT_COVERED } from '@/actions/sensor';
import { send } from '@/actions/rover';

jest.mock('node-blockly/browser');
jest.mock('sumo-logger');

import Blockly from 'node-blockly/browser'; // eslint-disable-line import/first, import/order
import SumoLogger from 'sumo-logger'; // eslint-disable-line import/first, import/order
import Workspace from '../Workspace'; // eslint-disable-line import/first, import/order


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
      },
      sensor: {
        left: NOT_COVERED,
        right: NOT_COVERED,
      },
      rover: {
        transmitChannel: {
          writeValue: jest.fn(),
        },
      },
    });
    store.dispatch = jest.fn(() => Promise.resolve());
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

    wrapper.instance().updateJsCode();
    expect(Blockly.JavaScript.STATEMENT_PREFIX).toEqual('highlightBlock(%1);\n');
    expect(wrapper.find(Message).exists()).toBe(false);
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
      },
    });
    localStore.dispatch = jest.fn(() => Promise.resolve());
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
    expect(workspace.find(Message).exists()).toBe(true);
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

  test('runs code when not at end, running, and not sleeping', () => {
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
    workspace.instance().sleeping = false;
    workspace.update();
    workspace.instance().runCode();

    expect(setTimeout).toHaveBeenCalled();
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

    expect(setTimeout).not.toHaveBeenCalled();
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

    expect(setTimeout).not.toHaveBeenCalled();
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

    expect(setTimeout).not.toHaveBeenCalled();
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
    expect(workspace.instance().runCode).toHaveBeenCalled();
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
      },
    });
    localStore.dispatch = jest.fn(() => Promise.resolve());
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
    store.dispatch.mockReturnValueOnce(Promise.reject(error));
    store.dispatch.mockReturnValue(Promise.resolve());

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
    store.dispatch = jest.fn(() => Promise.reject(error));

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

  test('handles authentication error when creating', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn();
    store.dispatch.mockReturnValueOnce(Promise.reject(error));
    store.dispatch.mockReturnValue(Promise.resolve());

    const wrapper = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive();
    wrapper.props().createProgram('test').then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        createProgram('test', {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles other error when creating', (done) => {
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    const wrapper = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive();
    wrapper.props().createProgram('test').catch(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        createProgram('test', {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });

  test('handles authentication error when fetching', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn();
    store.dispatch.mockReturnValueOnce(Promise.reject(error));
    store.dispatch.mockReturnValue(Promise.resolve());

    const wrapper = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive();
    wrapper.props().fetchProgram(1).then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        fetchProgram(1, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles other error when fetching', (done) => {
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    const wrapper = shallowWithIntl(
      <Workspace store={store}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive();
    wrapper.props().fetchProgram(1).catch(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        fetchProgram(1, {
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

    expect(workspace.instance().sensorStateCache.SENSORS_leftIr).toBe(false);
    expect(workspace.instance().sensorStateCache.SENSORS_rightIr).toBe(false);

    workspace.setProps({
      sensor: {
        left: COVERED,
        right: NOT_COVERED,
      },
    });

    expect(workspace.instance().sensorStateCache.SENSORS_leftIr).toBe(true);
    expect(workspace.instance().sensorStateCache.SENSORS_rightIr).toBe(false);

    workspace.setProps({
      sensor: {
        left: COVERED,
        right: COVERED,
      },
    });

    expect(workspace.instance().sensorStateCache.SENSORS_leftIr).toBe(true);
    expect(workspace.instance().sensorStateCache.SENSORS_rightIr).toBe(true);

    workspace.setProps({
      sensor: {
        left: NOT_COVERED,
        right: COVERED,
      },
    });

    expect(workspace.instance().sensorStateCache.SENSORS_leftIr).toBe(false);
    expect(workspace.instance().sensorStateCache.SENSORS_rightIr).toBe(true);
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
      },
    });
    localStore.dispatch = jest.fn(() => Promise.resolve());
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

  test('Remixes a program', (done) => {
    const localStore = mockStore({
      code: {
        id: 1,
        name: 'test program',
        xmlCode: '<xml></xml>',
      },
      sensor: {
        left: NOT_COVERED,
        right: NOT_COVERED,
      },
    });
    localStore.dispatch = jest.fn(() => Promise.resolve());
    const mockCreateProgram = jest.fn(() => Promise.resolve({
      value: {
        id: 1,
        name: 'test program',
      },
    }));
    const mockFetchProgram = jest.fn(() => Promise.resolve({
      value: {
        id: 1,
        name: 'test program',
        content: '<xml></xml>',
      },
    }));
    const mockSaveProgram = jest.fn(() => Promise.resolve({
      value: {
        name: 'test program',
      },
    }));
    const workspace = shallowWithIntl(
      <Workspace store={localStore}>
        <div />
      </Workspace>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    workspace.setProps({
      createProgram: mockCreateProgram,
      fetchProgram: mockFetchProgram,
      saveProgram: mockSaveProgram,
    });

    workspace.instance().remix().then(() => {
      expect(mockCreateProgram).toHaveBeenCalledWith('test program');
      expect(mockFetchProgram).toHaveBeenCalledWith(1);
      expect(mockSaveProgram).toHaveBeenCalledWith(1, '<xml></xml>', 'test program');
      expect(SumoLogger.mock.instances[0].log).toHaveBeenCalledWith('{"event":"remix","sourceProgramId":1,"newProgramId":1}');
      done();
    });
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
});
