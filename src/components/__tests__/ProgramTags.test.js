import React from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import { mountWithIntl, shallowWithIntl } from 'enzyme-react-intl';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import { Cookies } from 'react-cookie';

import { updateValidAuth } from '@/actions/auth';
import { changeProgramTags } from '@/actions/code';
import ProgramTags from '../ProgramTags';

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
    store.dispatch = jest.fn(() => Promise.resolve());
  });

  test('renders on the page with no errors', () => {
    const wrapper = mountWithIntl(<ProgramTags store={store} />, { context });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('displays tags', () => {
    const wrapper = shallowWithIntl(
      <ProgramTags store={store} />, { context },
    ).dive().dive().dive();

    expect(wrapper.find(Dropdown).props().value).toStrictEqual(['tag1', 'tag2']);
    expect(wrapper.find(Dropdown).props().disabled).toBe(false);
  });

  test('disabled when read only', () => {
    const localStore = mockStore({
      code: {
        name: 'test name',
        isReadOnly: true,
      },
    });
    localStore.dispatch = jest.fn(() => Promise.resolve());
    const wrapper = shallowWithIntl(
      <ProgramTags store={localStore} />,
      { context },
    ).dive().dive().dive();

    expect(wrapper.find(Button).props().disabled).toBe(true);
    expect(wrapper.find(Dropdown).props().disabled).toBe(true);
  });

  test('adds new options', () => {
    const wrapper = shallowWithIntl(
      <ProgramTags store={store} />, { context },
    ).dive().dive().dive();

    expect(wrapper.find(Dropdown).props().options.length).toBe(3);
    wrapper.instance().addItem({}, {
      value: 'new_option',
    });
    wrapper.update();
    expect(wrapper.find(Dropdown).props().options.length).toBe(4);
  });

  test('handles change', () => {
    const wrapper = shallowWithIntl(
      <ProgramTags store={store} />, { context },
    ).dive().dive().dive();

    expect(wrapper.find(Button).props().disabled).toBe(true);
    wrapper.find(Dropdown).simulate('change', {}, {
      value: [
        'tag3',
      ],
    });
    wrapper.update();

    expect(wrapper.find(Dropdown).props().value).toStrictEqual(['tag3']);
    expect(wrapper.find(Button).props().disabled).toBe(false);
  });

  test('handles save', () => {
    const wrapper = shallowWithIntl(
      <ProgramTags store={store} />, { context },
    ).dive().dive().dive();

    wrapper.find(Button).simulate('click');
    wrapper.update();

    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(changeProgramTags(1, ['tag1', 'tag2']));
    expect(wrapper.find(Button).props().disabled).toBe(true);
  });

  test('handles authentication error', (done) => {
    const error = new Error();
    error.response = {
      status: 401,
    };
    store.dispatch = jest.fn();
    store.dispatch.mockReturnValueOnce(Promise.reject(error));
    store.dispatch.mockReturnValue(Promise.resolve());

    const wrapper = shallowWithIntl(<ProgramTags store={store} />, { context }).dive();
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
    store.dispatch = jest.fn(() => Promise.reject(error));

    const wrapper = shallowWithIntl(<ProgramTags store={store} />, { context }).dive();
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
