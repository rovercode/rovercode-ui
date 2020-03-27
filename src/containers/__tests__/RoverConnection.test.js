import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import RoverConnection from '../RoverConnection';
import { changeLeftSensorState, changeRightSensorState } from '@/actions/sensor';

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
    });
    store.dispatch = jest.fn(() => Promise.resolve());
    wrapper = shallow(<RoverConnection store={store} />);
  });

  test('dispatches an action to change left sensor state', () => {
    wrapper.props().changeLeftSensorState(true);

    expect(store.dispatch).toHaveBeenCalledWith(changeLeftSensorState(true));
  });

  test('dispatches an action to change right sensor state', () => {
    wrapper.props().changeRightSensorState(true);

    expect(store.dispatch).toHaveBeenCalledWith(changeRightSensorState(true));
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
});
