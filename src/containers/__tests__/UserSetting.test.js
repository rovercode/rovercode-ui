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
  const context = { cookies };
  let store;
  let authFailStore;
  let otherFailStore;
  let wrapper;
  beforeEach(() => {
    const defaultState = {
      user: {
        user_id: 1,
        username: 'testuser',
        email: 'test@example.com',
      },
    };

    const mockStore = configureStore();
    store = mockStore(defaultState);
    store.dispatch = jest.fn(() => Promise.resolve());

    const mockAuthFailStore = configureStore();
    const authError = new Error();
    authError.response = {
      status: 401,
    };
    authFailStore = mockAuthFailStore(defaultState);
    authFailStore.dispatch = jest.fn();
    authFailStore.dispatch.mockReturnValueOnce(Promise.reject(authError));
    authFailStore.dispatch.mockReturnValue(Promise.resolve());

    const mockOtherFailStore = configureStore();
    const error = new Error();
    error.response = {
      status: 500,
    };
    otherFailStore = mockOtherFailStore(defaultState);
    otherFailStore.dispatch = jest.fn(() => Promise.reject(error));

    wrapper = shallow(<UserSetting store={store} />, { context }).dive().dive().dive();
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
    const localWrapper = shallow(
      <UserSetting store={authFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().editUserUsername(username).then(() => {
      expect(authFailStore.dispatch.mock.calls.length).toBe(2);
      expect(authFailStore.dispatch).toHaveBeenCalledWith(
        editUserUsername(username, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(authFailStore.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles authentication error editing user password', (done) => {
    const password = 'password123';
    const localWrapper = shallow(
      <UserSetting store={authFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().editUserPassword(password).then(() => {
      expect(authFailStore.dispatch.mock.calls.length).toBe(2);
      expect(authFailStore.dispatch).toHaveBeenCalledWith(
        editUserPassword(password, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(authFailStore.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles other error editing user username', (done) => {
    const username = 'testuser';
    const localWrapper = shallow(
      <UserSetting store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().editUserUsername(username).catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
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
    const localWrapper = shallow(
      <UserSetting store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().editUserPassword(password).catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
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
