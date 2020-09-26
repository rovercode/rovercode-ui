import React from 'react';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import { updateValidAuth } from '@/actions/auth';
import ProgramList from '../ProgramList'; // eslint-disable-line import/order

jest.mock('@/actions/code');
jest.mock('@/actions/program');
jest.mock('@/actions/tag');
jest.mock('@/actions/user');

import { changeReadOnly, clearProgram } from '@/actions/code'; // eslint-disable-line import/first, import/order
import { clearPrograms, fetchPrograms, removeProgram } from '@/actions/program'; // eslint-disable-line import/first, import/order
import { fetchTags } from '@/actions/tag'; // eslint-disable-line import/first, import/order
import { fetchUserStats } from '@/actions/user'; // eslint-disable-line import/first, import/order

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The ProgramListContainer', () => {
  const context = { cookies };
  let store;
  let authFailStore;
  let otherFailStore;
  let wrapper;
  beforeEach(() => {
    const defaultState = {
      program: {
        isFetching: false,
        programs: {
          total_pages: 1,
          results: [],
        },
        userPrograms: {
          total_pages: 1,
          results: [],
        },
      },
      user: {
        user_id: 1,
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

    wrapper = shallow(<ProgramList store={store} />, { context }).dive().dive().dive();
  });

  test('dispatches an action to fetch programs for a user', () => {
    wrapper.dive().props().fetchPrograms({
      user: 10,
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchPrograms({
        params: {
          user: 10,
        },
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );
  });

  test('dispatches an action to remove a program', () => {
    wrapper.dive().props().removeProgram(1);

    expect(store.dispatch).toHaveBeenCalledWith(
      removeProgram(1, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );
  });

  test('dispatches an action to fetch tags', () => {
    wrapper.dive().props().fetchTags();

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchTags({
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );
  });

  test('dispatches an action to fetch user stats', () => {
    wrapper.dive().props().fetchUserStats(1);

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchUserStats(1, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );
  });

  test('handles authentication error fetching programs', (done) => {
    const localWrapper = shallow(
      <ProgramList store={authFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchPrograms().then(() => {
      expect(authFailStore.dispatch.mock.calls.length).toBe(2);
      expect(authFailStore.dispatch).toHaveBeenCalledWith(
        fetchPrograms({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(authFailStore.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles authentication error removing a program', (done) => {
    const localWrapper = shallow(
      <ProgramList store={authFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().removeProgram(1).then(() => {
      expect(authFailStore.dispatch.mock.calls.length).toBe(2);
      expect(authFailStore.dispatch).toHaveBeenCalledWith(
        removeProgram(1, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(authFailStore.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles authentication error fetching tags', (done) => {
    const localWrapper = shallow(
      <ProgramList store={authFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchTags().then(() => {
      expect(authFailStore.dispatch.mock.calls.length).toBe(2);
      expect(authFailStore.dispatch).toHaveBeenCalledWith(
        fetchTags({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(authFailStore.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles authentication error fetching user stats', (done) => {
    const localWrapper = shallow(
      <ProgramList store={authFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchUserStats(1).then(() => {
      expect(authFailStore.dispatch.mock.calls.length).toBe(2);
      expect(authFailStore.dispatch).toHaveBeenCalledWith(
        fetchUserStats(1, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(authFailStore.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles other error fetching programs', (done) => {
    const localWrapper = shallow(
      <ProgramList store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchPrograms().catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
        fetchPrograms({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });

  test('handles other error removing a program', (done) => {
    const localWrapper = shallow(
      <ProgramList store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().removeProgram(1).catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
        removeProgram(1, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });

  test('handles other error fetching tags', (done) => {
    const localWrapper = shallow(
      <ProgramList store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchTags().catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
        fetchTags({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });

  test('handles other error fetching user stats', (done) => {
    const localWrapper = shallow(
      <ProgramList store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchUserStats(1).catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
        fetchUserStats(1, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });

  test('dispatches an action to change read only', () => {
    wrapper.dive().props().changeReadOnly(true);

    expect(store.dispatch).toHaveBeenCalledWith(
      changeReadOnly(true),
    );
  });

  test('dispatches an action to clear program', () => {
    wrapper.dive().props().clearProgram();

    expect(store.dispatch).toHaveBeenCalledWith(
      clearProgram(),
    );
  });

  test('dispatches an action to clear program list', () => {
    wrapper.dive().props().clearProgramList();

    expect(store.dispatch).toHaveBeenCalledWith(
      clearPrograms(),
    );
  });
});
