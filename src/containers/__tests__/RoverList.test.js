import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import RoverList from '../RoverList';
import { fetchRovers, removeRover } from '../../actions/rover';
import { updateValidAuth } from '../../actions/auth';

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The RoverListContainer', () => {
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
    wrapper = shallow(<RoverList store={store} />, { context });
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

  test('dispatches an action to remove a rover', () => {
    const mockAxios = new MockAdapter(axios);

    mockAxios.onDelete('/api/v1/rovers/1/').reply(204);
    wrapper.dive().props().removeRover(1);

    expect(store.dispatch).toHaveBeenCalledWith(
      removeRover(1, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );

    mockAxios.restore();
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

  test('handles authentication error removing a rover', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().removeRover(1).then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        removeRover(1, {
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

  test('handles other error removing a rover', (done) => {
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().removeRover(1).then(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        removeRover(1, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });
});
