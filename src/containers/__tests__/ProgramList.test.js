import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import ProgramList from '../ProgramList';
import { fetchProgram } from '../../actions/code';
import { fetchPrograms, removeProgram } from '../../actions/program';
import { updateValidAuth } from '../../actions/auth';

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The ProgramListContainer', () => {
  const mockStore = configureStore();
  let store;
  let wrapper;
  beforeEach(() => {
    store = mockStore({
      programs: {
        isFetching: false,
        programs: [],
      },
      user: {
        user_id: 1,
      },
    });
    store.dispatch = jest.fn(() => Promise.resolve());
    const context = { cookies };
    wrapper = shallow(<ProgramList store={store} />, { context });
  });
  test('dispatches an action to fetch programs', () => {
    const programs = [{
      id: 33,
      name: 'Unnamed_Design_3',
      content: '<xml><variables></variables></xml>',
      user: 10,
    }];
    const mockAxios = new MockAdapter(axios);

    mockAxios.onGet('/api/v1/block-diagrams/').reply(200, programs);
    wrapper.dive().props().fetchPrograms();

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
    const programs = [{
      id: 33,
      name: 'Unnamed_Design_3',
      content: '<xml><variables></variables></xml>',
      user: 10,
    }];
    const mockAxios = new MockAdapter(axios);

    mockAxios.onGet('/api/v1/block-diagrams/', {
      params: {
        user: 10,
      },
    }).reply(200, programs);
    wrapper.dive().props().fetchPrograms({
      params: {
        user: 10,
      },
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

  test('handles authentication error fetching programs', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().fetchPrograms().then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        fetchPrograms({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles authentication error fetching specific program', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().fetchProgram().then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        fetchProgram({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles authentication error removing a program', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().removeProgram(1).then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        removeProgram(1, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles other error fetching programs', (done) => {
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().fetchPrograms().then(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
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
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().fetchProgram().then(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
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
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    wrapper.dive().props().removeProgram(1).then(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        removeProgram(1, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });
});
