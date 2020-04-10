import React from 'react';
import { Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import { logout } from '@/actions/auth';
import TopNav from '../TopNav';

const cookies = new Cookies();
const mockStore = configureStore();
const store = mockStore();
store.dispatch = jest.fn();

describe('The TopNav component', () => {
  beforeEach(() => {
    cookies.set('auth_jwt', '1234', { path: '/' });
  });

  test('should render on the page with no errors', () => {
    const topNav = shallow(<TopNav userName="Dale Gribble" store={store} />, {
      context: { cookies },
    });
    const wrapper = topNav.dive().dive().dive().dive();

    expect(wrapper).toMatchSnapshot();
  });

  test('should sign out', () => {
    const topNav = shallow(<TopNav userName="Dale Gribble" store={store} />, {
      context: { cookies },
    });
    const wrapper = topNav.dive().dive().dive().dive();

    expect(wrapper.find(Redirect).exists()).toBe(false);
    expect(cookies.get('auth_jwt', { path: '/' })).toBe('1234');

    wrapper.instance().signout();
    wrapper.update();

    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).prop('to')).toBe('/accounts/login');
    expect(cookies.get('auth_jwt', { path: '/' })).toBeUndefined();
    expect(store.dispatch).toHaveBeenCalledWith(logout());
  });
});
