import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Cookies } from 'react-cookie';
import { TextField } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { FormattedMessage } from 'react-intl';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureStore from 'redux-mock-store';
import jwtDecode from 'jwt-decode';

import Login from '../Login'; // eslint-disable-line import/order

jest.mock('@/actions/auth');
jest.mock('@/actions/user');

import { updateValidAuth } from '@/actions/auth'; // eslint-disable-line import/first, import/order
import { updateUser } from '@/actions/user'; // eslint-disable-line import/first, import/order

const mockStore = configureStore();
const store = mockStore();
store.dispatch = jest.fn();

const mock = new MockAdapter(axios);

const cookiesValues = { };
const cookies = new Cookies(cookiesValues);
const location = {
  pathname: '/login',
};

test('Login renders on the page with no errors', () => {
  const cookiesWrapper = shallowWithIntl(<Login location={location} store={store} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive().dive()
    .dive()
    .dive();

  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find(Alert).exists()).toBe(false);
});

test('Login mounts on the page with no errors', () => {
  const wrapper = mountWithIntl(<Router><Login location={location} store={store} /></Router>, {
    context: { cookies },
  });
  expect(wrapper).toMatchSnapshot();

  expect(wrapper.find(Alert).exists()).toBe(false);
});

test('Login redirects to social api on button click', (done) => {
  const url = 'https://accounts.google.com/o/oauth2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fsocial%2Fgoogle%2Fcallback';
  mock.reset();
  mock.onPost('/jwt/auth/social/google/auth-server/').reply(200, { url });
  Object.defineProperty(window, 'location', {
    value: {},
    writable: true,
  });

  window.location.assign = jest.fn();

  const element = {
    target: {
      parentNode: {
        id: undefined,
      },
      id: 'google',
    },
  };

  const cookiesWrapper = shallowWithIntl(<Login location={location} store={store} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive().dive()
    .dive()
    .dive();

  wrapper.instance().redirectToSocial(element).then(() => {
    expect(window.location.assign).toBeCalledWith(
      'https://accounts.google.com/o/oauth2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Faccounts%2Flogin%2Fcallback%2Fgoogle',
    );
    done();
  });
});

test('Login shows error message on api error', (done) => {
  mock.reset();
  mock.onPost('/jwt/auth/social/google/auth-server/').timeout();
  Object.defineProperty(window, 'location', {
    value: {},
    writable: true,
  });
  window.location.assign = jest.fn();

  const element = {
    target: {
      parentNode: {
        id: undefined,
      },
      id: 'google',
    },
  };

  const cookiesWrapper = shallowWithIntl(<Login location={location} store={store} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive().dive()
    .dive()
    .dive();

  wrapper.instance().redirectToSocial(element).then(() => {
    wrapper.update();

    expect(wrapper.find(Alert).exists()).toBe(true);
    expect(wrapper.find(AlertTitle).children().find(FormattedMessage).prop('defaultMessage')).toBe(
      'There was an error initiating social login.',
    );
    expect(window.location.assign).not.toBeCalled();
    done();
  });
});

test('Login shows error message on callback error', () => {
  const localLocation = {
    pathname: '/login',
    state: {
      callbackError: ['User is already registered with this e-mail address'],
    },
  };

  const cookiesWrapper = shallowWithIntl(<Login location={localLocation} store={store} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive().dive()
    .dive()
    .dive();

  expect(wrapper.find(Alert).exists()).toBe(true);
  expect(wrapper.find(AlertTitle).children().find(FormattedMessage).prop('defaultMessage')).toBe(
    'There was an error creating an account using social provider.',
  );
  expect(wrapper.find(Alert).find('WithStyles(ForwardRef(Typography))').text()).toBe(localLocation.state.callbackError[0]);
});

test('Login redirects to root after basic login success', (done) => {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTQwMzQzMjIxLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwib3JpZ19pYXQiOjE1NDAzMzk2MjF9.tumcSSAbKeWXc2QDd7KFR9IGh3PCsyHnCe6JLSszWpc';
  const username = 'admin';
  const password = 'password';

  mock.reset();
  mock.onPost('/api/api-token-auth/', {
    username,
    password,
  }).reply(200, {
    token,
  });

  const cookiesWrapper = shallowWithIntl(<Login location={location} store={store} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive().dive()
    .dive()
    .dive();

  wrapper.find(TextField).first().simulate('change', {
    target: {
      value: username,
    },
  });
  wrapper.find(TextField).last().simulate('change', {
    target: {
      value: password,
    },
  });

  wrapper.instance().basicLogin({ preventDefault: jest.fn() }).then(() => {
    wrapper.update();

    expect(cookies.get('auth_jwt')).toBe(token);
    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).prop('to')).toEqual({
      pathname: '/',
    });
    expect(store.dispatch).toHaveBeenCalledWith(
      updateUser({ ...jwtDecode(token), isSocial: false }),
    );
    expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(true));

    cookies.remove('auth_jwt');
    done();
  });
});

test('Login redirects to requested route after basic login success', (done) => {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTQwMzQzMjIxLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwib3JpZ19pYXQiOjE1NDAzMzk2MjF9.tumcSSAbKeWXc2QDd7KFR9IGh3PCsyHnCe6JLSszWpc';
  const username = 'admin';
  const password = 'password';
  const localLocation = {
    pathname: location.pathname,
    state: {
      next: '/courses',
    },
  };

  mock.reset();
  mock.onPost('/api/api-token-auth/', {
    username,
    password,
  }).reply(200, {
    token,
  });

  const cookiesWrapper = shallowWithIntl(<Login location={localLocation} store={store} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive().dive()
    .dive()
    .dive();

  wrapper.find(TextField).first().simulate('change', {
    target: {
      value: username,
    },
  });
  wrapper.find(TextField).last().simulate('change', {
    target: {
      value: password,
    },
  });

  wrapper.instance().basicLogin({ preventDefault: jest.fn() }).then(() => {
    wrapper.update();

    expect(cookies.get('auth_jwt')).toBe(token);
    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).prop('to')).toEqual({
      pathname: '/courses',
    });
    expect(store.dispatch).toHaveBeenCalledWith(
      updateUser({ ...jwtDecode(token), isSocial: false }),
    );
    expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(true));

    cookies.remove('auth_jwt');
    done();
  });
});

test('Login shows error message after basic login failure', (done) => {
  const username = 'admin';
  const password = 'password';

  mock.reset();
  mock.onPost('/api/api-token-auth/', {
    username,
    password,
  }).reply(400);

  const cookiesWrapper = shallowWithIntl(<Login location={location} store={store} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive().dive()
    .dive()
    .dive();

  wrapper.find(TextField).first().simulate('change', {
    target: {
      value: username,
    },
  });
  wrapper.find(TextField).last().simulate('change', {
    target: {
      value: password,
    },
  });

  wrapper.instance().basicLogin({ preventDefault: jest.fn() }).then(() => {
    wrapper.update();

    expect(wrapper.find(Alert).exists()).toBe(true);
    expect(wrapper.find(AlertTitle).children().find(FormattedMessage).prop('defaultMessage')).toBe(
      'Invalid username or password.',
    );
    expect(cookies.get('auth_jwt')).toBeUndefined();
    done();
  });
});
