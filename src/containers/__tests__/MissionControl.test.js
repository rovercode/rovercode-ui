import React from 'react';
import { MemoryRouter } from 'react-router';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';
import { Button, Drawer } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import rootReducer from '@/reducers/index';
import configureStore from 'redux-mock-store';
import {
  createProgram,
  fetchProgram,
  saveProgram,
  changeReadOnly,
} from '@/actions/code';
import MissionControl from '../MissionControl';

jest.mock('sumo-logger');
jest.mock('@/components/CodeViewer', () => () => <div />);
jest.mock('@/components/Console', () => () => <div />);
jest.mock('@/components/Control', () => () => <div />);
jest.mock('@/components/Indicator', () => () => <div />);
jest.mock('@/components/ProgramName', () => () => <div />);
jest.mock('@/components/Workspace', () => () => <div />);

import SumoLogger from 'sumo-logger'; // eslint-disable-line import/first, import/order

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The MissionControl container', () => {
  const mockStore = configureStore();
  const context = { cookies };
  let store;
  let wrapper;
  beforeEach(() => {
    store = createStore(rootReducer, {
      code: {
        jsCode: 'testcode',
        isReadOnly: false,
        ownerName: 'phil',
        id: 123,
        name: 'Some Program',
        tags: [],
      },
      rover: {
        isFetching: false,
        rovers: {
          next: null,
          previous: null,
          results: [],
        },
        commands: [],
      },
    });
    store.dispatch = jest.fn().mockResolvedValue();
  });

  test('renders on the page with no errors', () => {
    wrapper = mountWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={store} />
        </MemoryRouter>
      </ReduxProvider>, {
        context,
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    );
    const mcWrapper = wrapper.find(MissionControl);

    expect(mcWrapper).toMatchSnapshot();
  });

  test('maps dispatches correctly', (done) => {
    store.dispatch = jest.fn(() => Promise.resolve());
    wrapper = shallowWithIntl(
      <MissionControl store={store}>
        <div />
      </MissionControl>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    const fetchPromise = wrapper.instance().props.fetchProgram(1);
    const savePromise = wrapper.instance().props.saveProgram(2, '<xml></xml>', 'test program', 50);
    const createPromise = wrapper.instance().props.createProgram('program name');
    const changeReadOnlyPromise = wrapper.instance().props.changeReadOnly(true);
    Promise.all([fetchPromise, savePromise, createPromise, changeReadOnlyPromise]).then(() => {
      expect(store.dispatch).toHaveBeenCalledWith(fetchProgram(1));
      expect(store.dispatch).toHaveBeenCalledWith(saveProgram(2, '<xml></xml>', 'test program', 50));
      expect(store.dispatch).toHaveBeenCalledWith(createProgram('program name'));
      expect(store.dispatch).toHaveBeenCalledWith(changeReadOnly(true));
      done();
    });
  });

  test('hides alert when not read only', () => {
    const localStore = mockStore({
      code: {
        jsCode: '',
        execution: null,
        name: 'test program',
        ownerName: 'phil',
        isReadOnly: false,
      },
    });
    localStore.dispatch = jest.fn(() => Promise.resolve());
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore} />
        </MemoryRouter>
      </ReduxProvider>, {
        context,
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(Alert).exists()).toBe(false);
  });

  test('shows alert when read only', () => {
    const localStore = mockStore({
      code: {
        jsCode: '',
        execution: null,
        name: 'test program',
        ownerName: 'phil',
        isReadOnly: true,
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue();
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore} />
        </MemoryRouter>
      </ReduxProvider>, {
        context,
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(Alert).exists()).toBe(true);
  });

  test('shows and dismisses drawer on edit', () => {
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={store} />
        </MemoryRouter>
      </ReduxProvider>, {
        context,
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(Drawer).prop('open')).toBe(false);

    wrapper.find(Button).simulate('click');
    wrapper.update();

    expect(wrapper.find(Drawer).prop('open')).toBe(true);

    wrapper.find(Drawer).simulate('close');
    wrapper.update();

    expect(wrapper.find(Drawer).prop('open')).toBe(false);
  });

  test('Remixes a lesson reference program', (done) => {
    const localStore = mockStore({
      code: {
        id: 1,
        name: 'test program',
        ownerName: 'phil',
        xmlCode: '<xml></xml>',
        isReadOnly: true,
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue();
    const mockChangeReadOnly = jest.fn();
    const mockCreateProgram = jest.fn(() => Promise.resolve({
      value: {
        id: 2,
        name: 'test program',
        lesson: 50,
      },
    }));
    const mockFetchProgram = jest.fn(() => Promise.resolve({
      value: {
        id: 1,
        name: 'test program',
        content: '<xml></xml>',
        reference_of: 50,
      },
    }));
    const mockSaveProgram = jest.fn(() => Promise.resolve({
      value: {
        name: 'test program',
      },
    }));
    const missionControl = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore}>
            <div />
          </MissionControl>
        </MemoryRouter>
      </ReduxProvider>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();

    missionControl.setProps({
      createProgram: mockCreateProgram,
      fetchProgram: mockFetchProgram,
      saveProgram: mockSaveProgram,
      changeReadOnly: mockChangeReadOnly,
    });

    missionControl.instance().remix().then(() => {
      expect(mockFetchProgram).toHaveBeenCalledWith(1);
      expect(mockCreateProgram).toHaveBeenCalledWith('test program');
      expect(mockSaveProgram).toHaveBeenCalledWith(2, '<xml></xml>', 'test program', 50);
      expect(mockChangeReadOnly).toHaveBeenCalledWith(false);
      expect(SumoLogger.mock.instances[0].log).toHaveBeenCalledWith('{"event":"remix","sourceProgramId":1,"newProgramId":2}');
      done();
    });
  });

  test('Remixes a program', (done) => {
    const localStore = mockStore({
      code: {
        id: 1,
        name: 'test program',
        ownerName: 'phil',
        xmlCode: '<xml></xml>',
        isReadOnly: true,
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue();
    const mockChangeReadOnly = jest.fn();
    const mockCreateProgram = jest.fn(() => Promise.resolve({
      value: {
        id: 2,
        name: 'test program',
        lesson: null,
      },
    }));
    const mockFetchProgram = jest.fn(() => Promise.resolve({
      value: {
        id: 1,
        name: 'test program',
        content: '<xml></xml>',
        reference_of: null,
      },
    }));
    const mockSaveProgram = jest.fn(() => Promise.resolve({
      value: {
        name: 'test program',
      },
    }));

    const missionControl = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore}>
            <div />
          </MissionControl>
        </MemoryRouter>
      </ReduxProvider>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();

    missionControl.setProps({
      createProgram: mockCreateProgram,
      fetchProgram: mockFetchProgram,
      saveProgram: mockSaveProgram,
      changeReadOnly: mockChangeReadOnly,
    });

    missionControl.instance().remix().then(() => {
      expect(mockFetchProgram).toHaveBeenCalledWith(1);
      expect(mockCreateProgram).toHaveBeenCalledWith('test program');
      expect(mockSaveProgram).toHaveBeenCalledWith(2, '<xml></xml>', 'test program', null);
      expect(SumoLogger.mock.instances[0].log).toHaveBeenCalledWith('{"event":"remix","sourceProgramId":1,"newProgramId":2}');
      done();
    });
  });
});
