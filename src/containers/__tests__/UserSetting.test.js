import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import UserSetting from '../UserSetting';
import { editUserUsername, editUserPassword } from '../../actions/user';
import { updateValidAuth } from '../../actions/auth';

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The UserSettingContainer', () => {
  const mockStore = configureStore();
  let store;
  let wrapper;
  beforeEach(() => {
    store = mockStore({
      user: {
        user_id: 1,
        username: 'testuser',
        email: 'test@example.com',
      },
    });
    store.dispatch = jest.fn(() => Promise.resolve());
    const context = { cookies };
    wrapper = shallow(<UserSetting store={store} />, { context });
  });
  test('dispatches an action to edit user username', () => {
    const username = 'testuser';
    const user = {
      pk: 1,
      username,
      email: 'test@example.com',
    };
    const mockAxios = new MockAdapter(axios);

    mockAxios.onPut('/jwt/auth/user/', {
      username,
    }).reply(200, user);
    wrapper.dive().props().editUserUsername(username);

    expect(store.dispatch).toHaveBeenCalledWith(
      editUserUsername(username, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );

    mockAxios.restore();
  });

  test('dispatches an action to edit user password', () => {
    const password = 'password123';
    const mockAxios = new MockAdapter(axios);

    mockAxios.onPost('/jwt/auth/password/change/', {
      new_password1: password,
      new_password2: password,
    }).reply(200, 'Password changed');
    wrapper.dive().props().editUserPassword(password);

    expect(store.dispatch).toHaveBeenCalledWith(
      editUserPassword(password, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );

    mockAxios.restore();
  });

  test('handles authentication error editing user username', (done) => {
    const username = 'testuser';
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn();
    store.dispatch.mockReturnValueOnce(Promise.reject(error));
    store.dispatch.mockReturnValueOnce(Promise.resolve({}));

    wrapper.dive().props().editUserUsername(username).then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        editUserUsername(username, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles authentication error editing user password', (done) => {
    const password = 'password123';
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn();
    store.dispatch.mockReturnValueOnce(Promise.reject(error));
    store.dispatch.mockReturnValueOnce(Promise.resolve({}));

    wrapper.dive().props().editUserPassword(password).then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        editUserPassword(password, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles other error editing user username', (done) => {
    const username = 'testuser';
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().editUserUsername(username).catch(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        editUserUsername(username, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });

  test('handles other error editing user password', (done) => {
    const password = 'password123';
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().editUserPassword(password).catch(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        editUserPassword(password, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });
});
