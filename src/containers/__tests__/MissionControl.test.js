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
import MissionControl from '../MissionControl'; // eslint-disable-line import/order

jest.mock('@/components/CodeViewer', () => () => <div />);
jest.mock('@/components/Console', () => () => <div />);
jest.mock('@/components/Control', () => () => <div />);
jest.mock('@/components/Indicator', () => () => <div />);
jest.mock('@/components/NumericSensorReadout', () => () => <div />);
jest.mock('@/components/ProgramName', () => () => <div />);
jest.mock('@/components/Workspace', () => () => <div />);
jest.mock('@/actions/code');

import { changeReadOnly, remixProgram } from '@/actions/code'; // eslint-disable-line import/first, import/order

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
      sensor: {
        leftLightSensorReading: -1,
        rightLIghtSensorReading: -2,
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
    store.dispatch = jest.fn().mockResolvedValue();
    wrapper = shallowWithIntl(
      <MissionControl store={store}>
        <div />
      </MissionControl>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    const remixPromise = wrapper.instance().props.remixProgram(1);
    const changeReadOnlyPromise = wrapper.instance().props.changeReadOnly(true);
    Promise.all([remixPromise, changeReadOnlyPromise]).then(() => {
      expect(store.dispatch).toHaveBeenCalledWith(remixProgram(1));
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
      sensor: {
        leftLightSensorReading: -1,
        rightLIghtSensorReading: -2,
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
      sensor: {
        leftLightSensorReading: -1,
        rightLIghtSensorReading: -2,
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
      sensor: {
        leftLightSensorReading: -1,
        rightLIghtSensorReading: -2,
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue();
    const mockChangeReadOnly = jest.fn();
    const mockRemixProgram = jest.fn().mockResolvedValue({
      value: {
        id: 2,
        name: 'test program',
        lesson: 50,
      },
    });
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
      remixProgram: mockRemixProgram,
      changeReadOnly: mockChangeReadOnly,
    });

    missionControl.instance().remix().then(() => {
      expect(mockRemixProgram).toHaveBeenCalledWith(1);
      expect(mockChangeReadOnly).toHaveBeenCalledWith(false);
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
      sensor: {
        leftLightSensorReading: -1,
        rightLIghtSensorReading: -2,
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue();
    const mockChangeReadOnly = jest.fn();
    const mockRemixProgram = jest.fn().mockResolvedValue({
      value: {
        id: 1,
        name: 'test program',
        content: '<xml></xml>',
        reference_of: null,
      },
    });

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
      remixProgram: mockRemixProgram,
      changeReadOnly: mockChangeReadOnly,
    });

    missionControl.instance().remix().then(() => {
      expect(mockRemixProgram).toHaveBeenCalledWith(1);
      done();
    });
  });
});
