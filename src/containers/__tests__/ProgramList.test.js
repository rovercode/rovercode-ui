import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import ProgramList from '../ProgramList';
import { changeReadOnly, clearProgram, fetchProgram } from '../../actions/code';
import { clearPrograms, fetchPrograms, removeProgram } from '../../actions/program';
import { fetchTags } from '../../actions/tag';
import { updateValidAuth } from '../../actions/auth';

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

    wrapper = shallow(<ProgramList store={store} />, { context }).dive().dive().dive();
  });
  test('dispatches an action to fetch programs', () => {
    const programs = {
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: 10,
      }],
    };
    const mockAxios = new MockAdapter(axios);

    mockAxios.onGet('/api/v1/block-diagrams/').reply(200, programs);
    wrapper.dive().props().fetchPrograms({
      user__not: 10,
    }, 2);

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchPrograms({
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );

    mockAxios.restore();
  });

  test('dispatches an action to fetch programs for a user', () => {
    const programs = {
      total_pages: 1,
      results: [{
        id: 33,
        name: 'Unnamed_Design_3',
        content: '<xml><variables></variables></xml>',
        user: 10,
      }],
    };
    const mockAxios = new MockAdapter(axios);

    mockAxios.onGet('/api/v1/block-diagrams/', {
      params: {
        user: 10,
      },
    }).reply(200, programs);
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

    mockAxios.restore();
  });

  test('dispatches an action to fetch specific program', () => {
    const program = {
      id: 33,
      name: 'Unnamed_Design_3',
      content: '<xml><variables></variables></xml>',
      user: 10,
    };
    const mockAxios = new MockAdapter(axios);

    mockAxios.onGet('/api/v1/block-diagrams/1/').reply(200, program);
    wrapper.dive().props().fetchProgram(1);

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchProgram(1, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );

    mockAxios.restore();
  });

  test('dispatches an action to remove a program', () => {
    const mockAxios = new MockAdapter(axios);

    mockAxios.onDelete('/api/v1/block-diagrams/1/').reply(204);
    wrapper.dive().props().removeProgram(1);

    expect(store.dispatch).toHaveBeenCalledWith(
      removeProgram(1, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );

    mockAxios.restore();
  });

  test('dispatches an action to fetch tags', () => {
    const mockAxios = new MockAdapter(axios);

    mockAxios.onGet('/api/v1/tags/').reply(200);
    wrapper.dive().props().fetchTags();

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchTags({
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );

    mockAxios.restore();
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

  test('handles authentication error fetching specific program', (done) => {
    const localWrapper = shallow(
      <ProgramList store={authFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchProgram().then(() => {
      expect(authFailStore.dispatch.mock.calls.length).toBe(2);
      expect(authFailStore.dispatch).toHaveBeenCalledWith(
        fetchProgram({
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

  test('handles other error fetching specific program', (done) => {
    const localWrapper = shallow(
      <ProgramList store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchProgram().catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
        fetchProgram({
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
