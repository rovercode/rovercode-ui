import React from 'react';
import { Input } from 'semantic-ui-react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import { Cookies } from 'react-cookie';

import { changeName } from '@/actions/code';
import ProgramName from '../ProgramName';

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The Console component', () => {
  const mockStore = configureStore();
  const context = { cookies };
  let store;

  beforeEach(() => {
    store = mockStore({
      code: {
        name: 'test name',
      },
    });
    store.dispatch = jest.fn();
  });

  test('renders on the page with no errors', () => {
    const wrapper = mount(<ProgramName store={store} />, { context });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('displays name', () => {
    const wrapper = shallow(<ProgramName store={store} />, { context }).dive().dive();

    expect(wrapper.find(Input).length).toBe(1);
    expect(wrapper.find(Input).props().defaultValue).toBe('test name');
  });

  test('handles change', () => {
    const wrapper = shallow(<ProgramName store={store} />, { context }).dive().dive();

    wrapper.find(Input).simulate('change', { target: { value: 'new name' } });
    wrapper.update();

    expect(wrapper.find(Input).props().defaultValue).toBe('new name');
  });

  test('handles save', () => {
    const wrapper = shallow(<ProgramName store={store} />, { context }).dive().dive();

    wrapper.find(Input).props().action.onClick();
    wrapper.update();

    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(changeName('test name'));
  });
});
