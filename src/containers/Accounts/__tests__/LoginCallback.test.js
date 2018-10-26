import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from 'react-router';
import { Loader } from 'semantic-ui-react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureStore from 'redux-mock-store';
import jwtDecode from 'jwt-decode';

import { updateUser } from '@/actions/user';

import LoginCallback from '../LoginCallback';

const mockStore = configureStore();
const store = mockStore();
store.dispatch = jest.fn();

const mock = new MockAdapter(axios);

const location = {
  search: '?state=1234&code=5678',
};
const match = {
  params: {
    service: 'google',
  },
};

test('LoginCallback renders on the page with no errors', () => {
  const cookiesValues = { };
  const cookies = new Cookies(cookiesValues);
  const wrapper = shallow(<LoginCallback location={location} match={match} store={store} />, {
    context: { cookies },
  });

  expect(wrapper).toMatchSnapshot();
});

test('LoginCallback displays loader while loading', () => {
  const cookiesValues = { };
  const cookies = new Cookies(cookiesValues);
  const cookiesWrapper = shallow(
    <LoginCallback location={location} match={match} store={store} />, {
      context: { cookies },
    },
  );

  const wrapper = cookiesWrapper.dive().dive();

  expect(wrapper.find(Loader).exists()).toBe(true);
  expect(wrapper.find(Redirect).exists()).toBe(false);
});

test('LoginCallback redirects to login after failure', async () => {
  mock.reset();
  mock.onPost('/jwt/auth/social/google/login/').timeout();
  const cookiesValues = { };
  const cookies = new Cookies(cookiesValues);
  const cookiesWrapper = shallow(
    <LoginCallback location={location} match={match} store={store} />, {
      context: { cookies },
    },
  );

  const wrapper = cookiesWrapper.dive().dive();

  await wrapper.instance().componentDidMount();
  wrapper.update();

  const redirect = wrapper.find(Redirect);
  expect(redirect.exists()).toBe(true);
  expect(redirect.prop('to')).toBe('/accounts/login');
  expect(wrapper.find(Loader).exists()).toBe(false);
  expect(cookies.get('auth_jwt')).toBeUndefined();
});

test('LoginCallback redirects to root after success', async () => {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTQwMzQzMjIxLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwib3JpZ19pYXQiOjE1NDAzMzk2MjF9.tumcSSAbKeWXc2QDd7KFR9IGh3PCsyHnCe6JLSszWpc';
  mock.reset();
  mock.onPost('/jwt/auth/social/google/login/').reply(200, {
    token,
  });
  const cookiesValues = { };
  const cookies = new Cookies(cookiesValues);
  const cookiesWrapper = shallow(
    <LoginCallback location={location} match={match} store={store} />, {
      context: { cookies },
    },
  );

  const wrapper = cookiesWrapper.dive().dive();

  await wrapper.instance().componentDidMount();
  wrapper.update();

  const redirect = wrapper.find(Redirect);
  expect(redirect.exists()).toBe(true);
  expect(redirect.prop('to')).toBe('/');
  expect(wrapper.find(Loader).exists()).toBe(false);
  expect(cookies.get('auth_jwt')).toBe(token);
  expect(store.dispatch).toHaveBeenCalledWith(updateUser(jwtDecode(token)));
});
