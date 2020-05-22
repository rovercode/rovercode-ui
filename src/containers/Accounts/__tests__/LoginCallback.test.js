import React from 'react';
import { Redirect } from 'react-router';
import { CircularProgress } from '@material-ui/core';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureStore from 'redux-mock-store';
import jwtDecode from 'jwt-decode';

import LoginCallback from '../LoginCallback'; // eslint-disable-line import/order

jest.mock('@/actions/auth');
jest.mock('@/actions/user');

import { updateValidAuth } from '@/actions/auth'; // eslint-disable-line import/first, import/order
import { updateUser } from '@/actions/user'; // eslint-disable-line import/first, import/order

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
  const wrapper = shallowWithIntl(
    <LoginCallback location={location} match={match} store={store} />, {
      context: { cookies },
    },
  ).dive().dive().dive();

  expect(wrapper).toMatchSnapshot();
});

test('LoginCallback displays loader while loading', () => {
  const cookiesValues = { };
  const cookies = new Cookies(cookiesValues);
  const cookiesWrapper = shallowWithIntl(
    <LoginCallback location={location} match={match} store={store} />, {
      context: { cookies },
    },
  );

  const wrapper = cookiesWrapper.dive().dive().dive()
    .dive();

  expect(wrapper.find(CircularProgress).exists()).toBe(true);
  expect(wrapper.find(Redirect).exists()).toBe(false);
});

test('LoginCallback redirects to login after failure', (done) => {
  mock.reset();
  mock.onPost('/jwt/auth/social/google/login/').reply(503, {
    non_field_errors: 'Service Unavailable',
  });
  const cookiesValues = { };
  const cookies = new Cookies(cookiesValues);
  const cookiesWrapper = shallowWithIntl(
    <LoginCallback location={location} match={match} store={store} />, {
      context: { cookies },
    },
  );

  const wrapper = cookiesWrapper.dive().dive().dive()
    .dive();

  wrapper.instance().componentDidMount().then(() => {
    wrapper.update();

    const redirect = wrapper.find(Redirect);
    expect(redirect.exists()).toBe(true);
    expect(redirect.prop('to')).toStrictEqual({
      pathname: '/accounts/login',
      state: { callbackError: 'Service Unavailable' },
    });
    expect(wrapper.find(CircularProgress).exists()).toBe(false);
    expect(cookies.get('auth_jwt')).toBeUndefined();
    done();
  });
});

test('LoginCallback redirects to root after success', (done) => {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTQwMzQzMjIxLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwib3JpZ19pYXQiOjE1NDAzMzk2MjF9.tumcSSAbKeWXc2QDd7KFR9IGh3PCsyHnCe6JLSszWpc';
  mock.reset();
  mock.onPost('/jwt/auth/social/google/login/').reply(200, {
    token,
  });
  const cookiesValues = { };
  const cookies = new Cookies(cookiesValues);
  const cookiesWrapper = shallowWithIntl(
    <LoginCallback location={location} match={match} store={store} />, {
      context: { cookies },
    },
  );

  const wrapper = cookiesWrapper.dive().dive().dive().dive();

  wrapper.instance().componentDidMount().then(() => {
    wrapper.update();

    const redirect = wrapper.find(Redirect);
    expect(redirect.exists()).toBe(true);
    expect(redirect.prop('to')).toBe('/');
    expect(wrapper.find(CircularProgress).exists()).toBe(false);
    expect(cookies.get('auth_jwt')).toBe(token);
    expect(store.dispatch).toHaveBeenCalledWith(
      updateUser({ ...jwtDecode(token), isSocial: true }),
    );
    expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(true));
    done();
  });
});
