import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import {
  changeLeftSensorState,
  changeRightSensorState,
  changeLightSensorReadings,
  changeLineSensorReadings,
  changeDistanceSensorReading,
  changeBatteryVoltageReading,
  COVERED,
  NOT_COVERED,
} from '@/actions/sensor';
import { changeExecutionState, EXECUTION_STOP } from '@/actions/code';
import { append } from '@/actions/console';
import RoverConnection from '../RoverConnection';

jest.mock('@/actions/rover');

import { scan, connect, disconnect } from '@/actions/rover'; // eslint-disable-line import/first, import/order

describe('The RoverConnectionContainer', () => {
  const mockStore = configureStore();
  let store;
  let wrapper;
  beforeEach(() => {
    store = mockStore({
      rover: {
        name: 'Sparky',
      },
      sensor: {
        left: COVERED,
        right: NOT_COVERED,
      },
    });
    store.dispatch = jest.fn().mockResolvedValue();
    wrapper = shallow(<RoverConnection store={store} />).dive();
  });

  test('dispatches an action to change execution state', () => {
    wrapper.props().changeExecutionState(EXECUTION_STOP);

    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_STOP));
  });

  test('dispatches an action to change left sensor state', () => {
    wrapper.props().changeLeftSensorState(true);

    expect(store.dispatch).toHaveBeenCalledWith(changeLeftSensorState(true));
  });

  test('dispatches an action to change right sensor state', () => {
    wrapper.props().changeRightSensorState(true);

    expect(store.dispatch).toHaveBeenCalledWith(changeRightSensorState(true));
  });

  test('dispatches an action to change light sensor readings', () => {
    wrapper.props().changeLightSensorReadings(1, 2);

    expect(store.dispatch).toHaveBeenCalledWith(changeLightSensorReadings(1, 2));
  });

  test('dispatches an action to change line sensor readings', () => {
    wrapper.props().changeLineSensorReadings(1, 2);

    expect(store.dispatch).toHaveBeenCalledWith(changeLineSensorReadings(1, 2));
  });

  test('dispatches an action to change the distance sensor reading', () => {
    wrapper.props().changeDistanceSensorReading(1);

    expect(store.dispatch).toHaveBeenCalledWith(changeDistanceSensorReading(1));
  });

  test('dispatches an action to change battery voltage reading', () => {
    wrapper.props().changeBatteryVoltageReading(42);

    expect(store.dispatch).toHaveBeenCalledWith(changeBatteryVoltageReading(42));
  });

  test('dispatches an action to connect', () => {
    const mockOnMessage = jest.fn();
    const mockRover = {};
    wrapper.props().connectToRover(mockRover, mockOnMessage);

    expect(store.dispatch).toHaveBeenCalledWith(connect(mockRover, mockOnMessage));
  });

  test('dispatches an action to disconnect', () => {
    const mockRover = {};
    wrapper.props().disconnectFromRover(mockRover);

    expect(store.dispatch).toHaveBeenCalledWith(disconnect(mockRover));
  });

  test('dispatches an action to scan', () => {
    wrapper.props().scanForRover();

    expect(store.dispatch).toHaveBeenCalledWith(scan());
  });

  test('dispatches an action to write', () => {
    wrapper.props().write('Test message');

    expect(store.dispatch).toHaveBeenCalledWith(append('Test message'));
  });
});
