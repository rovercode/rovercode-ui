import React from 'react';
import { Input } from '@material-ui/core';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import { Cookies } from 'react-cookie';

import { updateValidAuth } from '@/actions/auth';
import { changeName } from '@/actions/code';
import ProgramName from '../ProgramName';

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The ProgramName component', () => {
  const mockStore = configureStore();
  const context = { cookies };
  let store;

  beforeEach(() => {
    store = mockStore({
      code: {
        name: 'test name',
        isReadOnly: false,
      },
    });
    store.dispatch = jest.fn(() => Promise.resolve());
  });

  test('renders on the page with no errors', () => {
    const wrapper = mountWithIntl(<ProgramName store={store} />, { context });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('displays name', () => {
    const wrapper = shallowWithIntl(
      <ProgramName store={store} />, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(Input).length).toBe(1);
    expect(wrapper.find(Input).props().value).toBe('test name');
    expect(wrapper.find(Input).props().disabled).toBe(false);
  });

  test('disabled when read only', () => {
    const localStore = mockStore({
      code: {
        name: 'test name',
        isReadOnly: true,
      },
    });
    const wrapper = shallowWithIntl(
      <ProgramName store={localStore} />,
      { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(Input).props().disabled).toBe(true);
    expect(wrapper.find(Input).props().endAdornment).toBeNull();
  });

  test('handles change', () => {
    const wrapper = shallowWithIntl(
      <ProgramName store={store} />, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    wrapper.find(Input).simulate('change', { target: { value: 'new name' } });
    wrapper.update();

    expect(wrapper.find(Input).props().value).toBe('new name');
    expect(wrapper.find(Input).props().endAdornment).toBeDefined();
  });

  test('handles save', () => {
    const wrapper = shallowWithIntl(
      <ProgramName store={store} />, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    wrapper.find(Input).simulate('change', { target: { value: 'new name' } });
    wrapper.update();

    wrapper.instance().handleSave();

    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(changeName('test name'));
  });

  test('handles authentication error', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn();
    store.dispatch.mockReturnValueOnce(Promise.reject(error));
    store.dispatch.mockReturnValue(Promise.resolve());

    const wrapper = shallowWithIntl(<ProgramName store={store} />, { context }).dive();
    wrapper.dive().dive().dive().dive()
      .dive()
      .props()
      .changeName(1, 'testname')
      .then(() => {
        expect(store.dispatch.mock.calls.length).toBe(2);
        expect(store.dispatch).toHaveBeenCalledWith(
          changeName(1, 'testname', {
            headers: {
              Authorization: `JWT ${cookiesValues.auth_jwt}`,
            },
          }),
        );
        expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
        done();
      });
  });

  test('handles other error', (done) => {
    const error = new Error();
    error.response = {
      status: 500,
    };
    store.dispatch = jest.fn(() => Promise.reject(error));

    const wrapper = shallowWithIntl(<ProgramName store={store} />, { context }).dive();
    wrapper.dive().dive().dive().dive()
      .dive()
      .props()
      .changeName(1, 'testname')
      .catch(() => {
        expect(store.dispatch.mock.calls.length).toBe(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          changeName(1, 'testname', {
            headers: {
              Authorization: `JWT ${cookiesValues.auth_jwt}`,
            },
          }),
        );
        done();
      });
  });
});
