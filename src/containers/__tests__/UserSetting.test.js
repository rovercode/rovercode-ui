import React from 'react';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import { updateValidAuth } from '@/actions/auth';
import UserSetting from '../UserSetting'; // eslint-disable-line import/order

jest.mock('@/actions/user');

import { editUserUsername, editUserPassword } from '@/actions/user'; // eslint-disable-line import/first, import/order
import { fetchSubscription, upgradeSubscription } from '@/actions/subscription'; // eslint-disable-line import/first, import/order

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
    store.dispatch = jest.fn().mockResolvedValue();

    const mockAuthFailStore = configureStore();
    const authError = new Error();
    authError.response = {
      status: 401,
    };
    authFailStore = mockAuthFailStore(defaultState);
    authFailStore.dispatch = jest.fn();
    authFailStore.dispatch.mockRejectedValueOnce(authError);
    authFailStore.dispatch.mockResolvedValue();

    const mockOtherFailStore = configureStore();
    const error = new Error();
    error.response = {
      status: 500,
    };
    otherFailStore = mockOtherFailStore(defaultState);
    otherFailStore.dispatch = jest.fn().mockRejectedValue(error);

    wrapper = shallow(<UserSetting store={store} />, { context }).dive().dive().dive();
  });

  test('dispatches an action to edit user username', () => {
    const username = 'testuser';
    wrapper.dive().props().editUserUsername(username);

    expect(store.dispatch).toHaveBeenCalledWith(
      editUserUsername(username, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );
  });

  test('dispatches an action to edit user password', () => {
    const password = 'password123';
    wrapper.dive().props().editUserPassword(password);

    expect(store.dispatch).toHaveBeenCalledWith(
      editUserPassword(password, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );
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

  test('dispatches an action to fetch subscription', () => {
    const userId = 1;
    wrapper.dive().props().fetchSubscription(userId);

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchSubscription(userId, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );
  });

  test('dispatches an action to upgrade subscription', () => {
    const userId = 1;
    const accessCode = 'abcdefgh';
    wrapper.dive().props().upgradeSubscription(userId, accessCode);

    expect(store.dispatch).toHaveBeenCalledWith(
      upgradeSubscription(userId, accessCode, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );
  });

  test('handles error fetching subscription', (done) => {
    const userId = 1;
    const localWrapper = shallow(
      <UserSetting store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchSubscription(userId).catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
        fetchSubscription(userId, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });

  test('handles error upgrading subscription', (done) => {
    const userId = 1;
    const accessCode = 'abcdefgh';
    const localWrapper = shallow(
      <UserSetting store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().upgradeSubscription(userId, accessCode).catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
        upgradeSubscription(userId, accessCode, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });
});
