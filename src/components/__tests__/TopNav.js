import React from 'react';
import { Redirect } from 'react-router-dom';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import TopNav from '../TopNav';

const cookies = new Cookies();

describe('The TopNav component', () => {
  beforeEach(() => {
    cookies.set('auth_jwt', '1234', { path: '/' });
  });

  test('should render on the page with no errors', () => {
    const topNav = shallow(<TopNav userName="Dale Gribble" />, {
      context: { cookies },
    });
    const wrapper = topNav.dive();

    expect(wrapper).toMatchSnapshot();
  });

  test('should sign out', () => {
    const topNav = shallow(<TopNav userName="Dale Gribble" />, {
      context: { cookies },
    });
    const wrapper = topNav.dive();

    expect(wrapper.find(Redirect).exists()).toBe(false);
    expect(cookies.get('auth_jwt', { path: '/' })).toBe('1234');

    wrapper.instance().signout();
    wrapper.update();

    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).prop('to')).toBe('/accounts/login');
    expect(cookies.get('auth_jwt', { path: '/' })).toBeUndefined();
  });
});
