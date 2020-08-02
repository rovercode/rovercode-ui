import React from 'react';
import { Redirect } from 'react-router-dom';
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
jest.mock('@/components/ProblemReporter', () => () => <div />);
jest.mock('@/components/Workspace', () => () => <div />);
jest.mock('@/actions/code');

import { // eslint-disable-line import/first, import/order
  changeReadOnly,
  createProgram,
  fetchLesson,
  clearLesson,
  fetchProgram,
  remixProgram,
} from '@/actions/code';

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);
const match = {
  params: {
    id: '1',
  },
};
const fetchResult = {
  value: {
    user: {
      username: 'testuser',
    },
  },
};

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
        lessonId: 42,
        lessonGoals: 'To code stuff',
        lessonTutorialLink: 'youtu.be/foobar',
      },
      sensor: {
        leftLightSensorReading: -1,
        rightLightSensorReading: -2,
        leftLineSensorReading: -3,
        rightLineSensorReading: -4,
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
      user: {
        username: 'testuser',
      },
    });
    store.dispatch = jest.fn().mockResolvedValue(fetchResult);
    jest.spyOn(global.Math, 'random').mockReturnValue(0.005);
  });

  afterEach(() => global.Math.random.mockRestore());

  test('renders on the page with no errors', () => {
    wrapper = mountWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={store} match={match} />
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
    wrapper = shallowWithIntl(
      <MissionControl store={store} match={match}>
        <div />
      </MissionControl>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    const remixPromise = wrapper.instance().props.remixProgram(1);
    const fetchLessonPromise = wrapper.instance().props.fetchLesson(2);
    const changeReadOnlyPromise = wrapper.instance().props.changeReadOnly(true);
    Promise.all([remixPromise, fetchLessonPromise, changeReadOnlyPromise]).then(() => {
      expect(store.dispatch).toHaveBeenCalledWith(remixProgram(1));
      expect(store.dispatch).toHaveBeenCalledWith(fetchLesson(2));
      expect(store.dispatch).toHaveBeenCalledWith(changeReadOnly(true));
      done();
    });
  });

  test('fetches program', () => {
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={store} match={match} />
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

    expect(store.dispatch).toHaveBeenCalledWith(fetchProgram(1));
  });

  test('creates program', () => {
    const localMatch = {
      params: null,
    };
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={store} match={localMatch} />
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

    expect(store.dispatch).toHaveBeenCalledWith(createProgram('Unnamed_Design_5'));
    expect(store.dispatch).toHaveBeenCalledWith(clearLesson());
  });

  test('redirects after creating program', () => {
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={store} match={match} />
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

    wrapper.setState({
      programCreated: 5,
    });
    wrapper.update();

    expect(wrapper.find(Redirect).exists()).toBe(true);
  });

  test('clears lesson when not present on fetched program', () => {
    const localStore = mockStore({
      code: {
        jsCode: '',
        execution: null,
        name: 'test program',
        ownerName: 'phil',
        isReadOnly: false,
        lessonId: null,
      },
      sensor: {
        leftLightSensorReading: -1,
        rightLightSensorReading: -2,
        leftLineSensorReading: -3,
        rightLineSensorReading: -4,
      },
      user: {
        username: 'testuser',
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue(fetchResult);
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore} match={match} />
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

    expect(localStore.dispatch).toHaveBeenCalledWith(clearLesson());
  });


  test('fetches lesson when present on fetched program', () => {
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
        rightLightSensorReading: -2,
        leftLineSensorReading: -3,
        rightLineSensorReading: -4,
      },
      user: {
        username: 'testuser',
      },
    });
    const localFetchResult = {
      value: {
        user: {
          username: 'testuser',
        },
        lesson: 50,
      },
    };
    localStore.dispatch = jest.fn().mockResolvedValue(localFetchResult);
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore} match={match} />
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

    expect(localStore.dispatch).toHaveBeenCalledWith(fetchLesson(50));
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
        rightLightSensorReading: -2,
        leftLineSensorReading: -3,
        rightLineSensorReading: -4,
      },
      user: {
        username: 'testuser',
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue(fetchResult);
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore} match={match} />
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
        rightLightSensorReading: -2,
        leftLineSensorReading: -3,
        rightLineSensorReading: -4,
      },
      user: {
        username: 'testuser',
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue(fetchResult);
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore} match={match} />
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
          <MissionControl store={store} match={match} />
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

    wrapper.find(Button).at(1).simulate('click');
    wrapper.update();

    expect(wrapper.find(Drawer).prop('open')).toBe(true);

    wrapper.find(Drawer).simulate('close');
    wrapper.update();

    expect(wrapper.find(Drawer).prop('open')).toBe(false);
  });

  test('shows tutorial link when available', () => {
    const localStore = mockStore({
      code: {
        jsCode: '',
        execution: null,
        name: 'test program',
        ownerName: 'phil',
        isReadOnly: false,
        lessonTutorialLink: 'youtu.be/asdf',
      },
      sensor: {
        leftLightSensorReading: -1,
        rightLightSensorReading: -2,
        leftLineSensorReading: -3,
        rightLineSensorReading: -4,
      },
      user: {
        username: 'testuser',
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue(fetchResult);
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore} match={match} />
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

    const button = wrapper.find('WithStyles(ForwardRef(Button))').first();
    expect(button.text()).toBe('Tutorial');
    expect(button.prop('href')).toBe('youtu.be/asdf');
  });

  test('hides tutorial link when not available', () => {
    const localStore = mockStore({
      code: {
        jsCode: '',
        execution: null,
        name: 'test program',
        ownerName: 'phil',
        isReadOnly: false,
        lessonTutorialLink: null,
      },
      sensor: {
        leftLightSensorReading: -1,
        rightLightSensorReading: -2,
        leftLineSensorReading: -3,
        rightLineSensorReading: -4,
      },
      user: {
        username: 'testuser',
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue(fetchResult);
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore} match={match} />
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

    expect(wrapper.find('WithStyles(ForwardRef(Button))').length).toBe(1);
    expect(wrapper.find('WithStyles(ForwardRef(Button))').first().text()).not.toBe('Tutorial');
  });

  test('shows goal when available', () => {
    const localStore = mockStore({
      code: {
        jsCode: '',
        execution: null,
        name: 'test program',
        ownerName: 'phil',
        isReadOnly: false,
        lessonGoals: 'to do a thing',
      },
      sensor: {
        leftLightSensorReading: -1,
        rightLightSensorReading: -2,
        leftLineSensorReading: -3,
        rightLineSensorReading: -4,
      },
      user: {
        username: 'testuser',
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue(fetchResult);
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore} match={match} />
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

    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Typography)))').at(0).text()).toBe('Goal: to do a thing');
  });

  test('hides goals when not available', () => {
    const localStore = mockStore({
      code: {
        jsCode: '',
        execution: null,
        name: 'test program',
        ownerName: 'phil',
        isReadOnly: false,
        lessonGoals: null,
      },
      sensor: {
        leftLightSensorReading: -1,
        rightLightSensorReading: -2,
        leftLineSensorReading: -3,
        rightLineSensorReading: -4,
      },
      user: {
        username: 'testuser',
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue(fetchResult);
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={localStore} match={match} />
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

    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Typography)))').exists()).toBe(false);
  });


  test('Remixes a lesson reference program', (done) => {
    const localStore = mockStore({
      code: {
        id: 1,
        name: 'test program',
        ownerName: 'phil',
        xmlCode: '<xml></xml>',
        isReadOnly: true,
        lessonId: 50,
      },
      sensor: {
        leftLightSensorReading: -1,
        rightLightSensorReading: -2,
        leftLineSensorReading: -3,
        rightLineSensorReading: -4,
      },
      user: {
        username: 'testuser',
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue(fetchResult);
    const mockChangeReadOnly = jest.fn();
    const mockFetchLesson = jest.fn();
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
          <MissionControl store={localStore} match={match}>
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
      fetchLesson: mockFetchLesson,
    });

    missionControl.instance().remix().then(() => {
      expect(mockRemixProgram).toHaveBeenCalledWith(1);
      expect(mockChangeReadOnly).toHaveBeenCalledWith(false);
      expect(mockFetchLesson).toHaveBeenCalledWith(50);
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
        rightLightSensorReading: -2,
        leftLineSensorReading: -3,
        rightLineSensorReading: -4,
      },
      user: {
        username: 'testuser',
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue(fetchResult);
    const mockChangeReadOnly = jest.fn();
    const mockFetchLesson = jest.fn();
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
          <MissionControl store={localStore} match={match}>
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
      fetchLesson: mockFetchLesson,
    });

    missionControl.instance().remix().then(() => {
      expect(mockRemixProgram).toHaveBeenCalledWith(1);
      expect(mockFetchLesson).not.toHaveBeenCalled();
      done();
    });
  });
});
