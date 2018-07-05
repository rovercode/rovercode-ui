import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from 'react-router';
import { Loader } from 'semantic-ui-react';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import LoginCallback from '../LoginCallback';

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
  const wrapper = shallow(<LoginCallback location={location} match={match} />, {
    context: { cookies },
  });

  expect(wrapper).toMatchSnapshot();
});

test('LoginCallback displays loader while loading', () => {
  const cookiesValues = { };
  const cookies = new Cookies(cookiesValues);
  const cookiesWrapper = shallow(<LoginCallback location={location} match={match} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive();

  expect(wrapper.find(Loader).exists()).toBe(true);
  expect(wrapper.find(Redirect).exists()).toBe(false);
});

test('LoginCallback redirects to login after failure', async () => {
  mock.reset();
  mock.onPost('/jwt/auth/social/google/login/').timeout();
  const cookiesValues = { };
  const cookies = new Cookies(cookiesValues);
  const cookiesWrapper = shallow(<LoginCallback location={location} match={match} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive();

  await wrapper.instance().componentDidMount();
  wrapper.update();

  const redirect = wrapper.find(Redirect);
  expect(redirect.exists()).toBe(true);
  expect(redirect.prop('to')).toBe('/login');
  expect(wrapper.find(Loader).exists()).toBe(false);
  expect(cookies.get('auth_jwt')).toBeUndefined();
});

test('LoginCallback redirects to root after success', async () => {
  mock.reset();
  mock.onPost('/jwt/auth/social/google/login/').reply(200, {
    token: '1234',
  });
  const cookiesValues = { };
  const cookies = new Cookies(cookiesValues);
  const cookiesWrapper = shallow(<LoginCallback location={location} match={match} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive();

  await wrapper.instance().componentDidMount();
  wrapper.update();

  const redirect = wrapper.find(Redirect);
  expect(redirect.exists()).toBe(true);
  expect(redirect.prop('to')).toBe('/');
  expect(wrapper.find(Loader).exists()).toBe(false);
  expect(cookies.get('auth_jwt')).toBe('1234');
});
