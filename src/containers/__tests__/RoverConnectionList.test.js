import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import RoverConnectionList from '../RoverConnectionList';
import { changeActiveRover, fetchRovers } from '../../actions/rover';
import { changeLeftSensorState, changeRightSensorState } from '../../actions/sensor';
import { updateValidAuth } from '../../actions/auth';

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The RoverListConnectionContainer', () => {
  const mockStore = configureStore();
  let store;
  let wrapper;
  beforeEach(() => {
    store = mockStore({
      rover: {
        isFetching: false,
        rovers: [],
      },
    });
    store.dispatch = jest.fn(() => Promise.resolve());
    const context = { cookies };
    wrapper = shallow(<RoverConnectionList store={store} />, { context });
  });
  test('dispatches an action to fetch rovers', () => {
    const rovers = [{
      id: 1,
      name: 'Mars',
    }];
    const mockAxios = new MockAdapter(axios);

    mockAxios.onGet('/api/v1/rovers/').reply(200, rovers);
    wrapper.dive().props().fetchRovers();

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchRovers({
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );

    mockAxios.restore();
  });

  test('dispatches an action to change left sensor state', () => {
    wrapper.dive().props().changeLeftSensorState(true);

    expect(store.dispatch).toHaveBeenCalledWith(changeLeftSensorState(true));
  });

  test('dispatches an action to change right sensor state', () => {
    wrapper.dive().props().changeRightSensorState(true);

    expect(store.dispatch).toHaveBeenCalledWith(changeRightSensorState(true));
  });

  test('dispatches an action to change active rover', () => {
    wrapper.dive().props().changeActiveRover('1234');

    expect(store.dispatch).toHaveBeenCalledWith(changeActiveRover('1234'));
  });

  test('handles authentication error fetching rovers', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().fetchRovers().then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        fetchRovers({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles other error fetching rovers', (done) => {
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().fetchRovers().then(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        fetchRovers({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });
});
