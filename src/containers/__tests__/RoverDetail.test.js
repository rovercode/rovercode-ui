import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import RoverDetail from '../RoverDetail';
import { editRover, fetchRover } from '../../actions/rover';
import { updateValidAuth } from '../../actions/auth';

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The RoverDetailContainer', () => {
  const mockStore = configureStore();
  let match;
  let store;
  let wrapper;
  beforeEach(() => {
    match = {
      params: {
        id: '1',
      },
    };
    store = mockStore({
      rover: {
        isFetchingSingle: false,
        rovers: [],
      },
    });
    store.dispatch = jest.fn(() => Promise.resolve());
    const context = { cookies };
    wrapper = shallow(<RoverDetail store={store} match={match} />, { context });
  });
  test('dispatches an action to fetch rovers', () => {
    const rover = {
      id: 1,
      name: 'Mars',
    };
    const mockAxios = new MockAdapter(axios);

    mockAxios.onGet('/api/v1/rovers/1/').reply(200, rover);
    wrapper.dive().props().fetchRover(1);

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchRover({
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );

    mockAxios.restore();
  });

  test('dispatches an action to edit a rover', () => {
    const rover = {
      id: 1,
      name: 'Mars',
    };
    const mockAxios = new MockAdapter(axios);

    mockAxios.onDelete('/api/v1/rovers/1/').reply(200, rover);
    wrapper.dive().props().editRover(1, rover);

    expect(store.dispatch).toHaveBeenCalledWith(
      editRover(1, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );

    mockAxios.restore();
  });

  test('handles authentication error fetching rover', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().fetchRover().then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        fetchRover({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles authentication error editing a rover', (done) => {
    const rover = {
      id: 1,
      name: 'Mars',
    };
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().editRover(1, rover).then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        editRover(1, rover, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles other error fetching rover', (done) => {
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().fetchRover().then(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        fetchRover({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });

  test('handles other error editing a rover', (done) => {
    const rover = {
      id: 1,
      name: 'Mars',
    };
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().editRover(1, rover).then(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        editRover(1, rover, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });
});
