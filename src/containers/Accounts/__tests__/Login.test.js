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

import { updateValidAuth } from '@/actions/auth';
import { updateUser } from '@/actions/user';

import Login from '../Login';

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

test('Login redirects to social api on button click', async () => {
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

  await wrapper.instance().redirectToSocial(element);

  expect(window.location.assign).toBeCalledWith(
    'https://accounts.google.com/o/oauth2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Faccounts%2Flogin%2Fcallback%2Fgoogle',
  );
});

test('Login shows error message on api error', async () => {
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

  await wrapper.instance().redirectToSocial(element);
  wrapper.update();

  expect(wrapper.find(Alert).exists()).toBe(true);
  expect(wrapper.find(AlertTitle).children().find(FormattedMessage).prop('defaultMessage')).toBe(
    'There was an error initiating social login.',
  );
  expect(window.location.assign).not.toBeCalled();
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

test('Login redirects to root after basic login success', async () => {
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

  await wrapper.instance().basicLogin({ preventDefault: jest.fn() });
  wrapper.update();

  expect(cookies.get('auth_jwt')).toBe(token);
  expect(wrapper.find(Redirect).exists()).toBe(true);
  expect(store.dispatch).toHaveBeenCalledWith(updateUser({ ...jwtDecode(token), isSocial: false }));
  expect(store.dispatch).toHaveBeenCalledWith(updateValidAuth(true));

  cookies.remove('auth_jwt');
});

test('Login shows error message after basic login failure', async () => {
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

  await wrapper.instance().basicLogin({ preventDefault: jest.fn() });
  wrapper.update();

  expect(wrapper.find(Alert).exists()).toBe(true);
  expect(wrapper.find(AlertTitle).children().find(FormattedMessage).prop('defaultMessage')).toBe(
    'Invalid username or password.',
  );
  expect(cookies.get('auth_jwt')).toBeUndefined();
});
