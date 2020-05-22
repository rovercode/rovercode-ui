import React from 'react';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import { Cookies } from 'react-cookie';

import { updateValidAuth } from '@/actions/auth';
import ProgramTags from '../ProgramTags';

jest.mock('@/actions/code');
jest.mock('@/actions/tag');

import { changeProgramTags } from '@/actions/code'; // eslint-disable-line import/first, import/order

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The ProgramTags component', () => {
  const mockStore = configureStore();
  const context = { cookies };
  let store;

  beforeEach(() => {
    store = mockStore({
      code: {
        tags: ['tag1', 'tag2'],
        isReadOnly: false,
      },
      tag: {
        tags: [{
          name: 'tag1',
        }, {
          name: 'tag2',
        }, {
          name: 'tag3',
        }],
      },
    });
    store.dispatch = jest.fn().mockResolvedValue();
  });

  test('renders on the page with no errors', () => {
    const wrapper = mountWithIntl(<ProgramTags store={store} />, { context });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('displays tags', () => {
    const wrapper = shallowWithIntl(
      <ProgramTags store={store} />, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Autocomplete)))').props().value).toStrictEqual(['tag1', 'tag2']);
    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Autocomplete)))').props().disabled).toBe(false);
  });

  test('disabled when read only', () => {
    const localStore = mockStore({
      code: {
        name: 'test name',
        isReadOnly: true,
        tags: [],
      },
    });
    localStore.dispatch = jest.fn().mockResolvedValue();
    const wrapper = shallowWithIntl(
      <ProgramTags store={localStore} />,
      { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Autocomplete)))').props().disabled).toBe(true);
  });

  test('handles change', () => {
    const wrapper = shallowWithIntl(
      <ProgramTags store={store} />, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    wrapper.find('WithStyles(WithStyles(ForwardRef(Autocomplete)))').simulate('change', {}, ['tag3']);
    wrapper.update();

    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Autocomplete)))').props().value).toStrictEqual(['tag3']);
    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(changeProgramTags(1, ['tag3']));
  });

  test('handles authentication error', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn();
    store.dispatch.mockRejectedValueOnce(error);
    store.dispatch.mockResolvedValue();

    const wrapper = shallowWithIntl(<ProgramTags store={store} />, { context }).dive().dive().dive()
      .dive()
      .dive();
    wrapper.dive().props().changeProgramTags(1, ['tag1', 'tag2']).then(() => {
      expect(store.dispatch.mock.calls.length).toBe(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        changeProgramTags(1, ['tag1', 'tag2'], {
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
    store.dispatch = jest.fn().mockRejectedValue(error);

    const wrapper = shallowWithIntl(<ProgramTags store={store} />, { context }).dive().dive().dive()
      .dive()
      .dive();
    wrapper.dive().props().changeProgramTags(1, ['tag1', 'tag2']).catch(() => {
      expect(store.dispatch.mock.calls.length).toBe(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        changeProgramTags(1, ['tag1', 'tag2'], {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });
});
