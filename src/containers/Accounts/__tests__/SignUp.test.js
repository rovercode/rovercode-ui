import React from 'react';
import { Redirect } from 'react-router';
import { ListItemText, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureStore from 'redux-mock-store';
import jwtDecode from 'jwt-decode';

import SignUp from '../SignUp';

jest.mock('@/actions/user');

import { updateUser } from '@/actions/user'; // eslint-disable-line import/first, import/order

const mockStore = configureStore();
const store = mockStore();
store.dispatch = jest.fn();

const mock = new MockAdapter(axios);

const cookiesValues = { };
const cookies = new Cookies(cookiesValues);

test('SignUp renders on the page with no errors', () => {
  const cookiesWrapper = shallowWithIntl(<SignUp store={store} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive().dive()
    .dive()
    .dive();

  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find(Alert).exists()).toBe(false);
});

test('SignUp displays form errors', (done) => {
  mock.reset();
  mock.onPost('/jwt/auth/registration/').reply(400, {
    username: ['A user with that username already exists.'],
    email: ['Enter a valid email address.'],
    password1: [
      'This password is too short. It must contain at least 8 characters.',
      'This password is too common.',
      'This password is entirely numeric.',
    ],
  });
  const cookiesWrapper = shallowWithIntl(<SignUp store={store} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive().dive()
    .dive()
    .dive();
  wrapper.instance().signUp({ preventDefault: jest.fn() }).then(() => {
    wrapper.update();

    expect(wrapper.find(Alert).exists()).toBe(true);
    expect(wrapper.find(ListItemText).length).toBe(5);
    expect(wrapper.find(ListItemText).at(0).prop('children')).toBe('- A user with that username already exists.');
    expect(wrapper.find(ListItemText).at(1).prop('children')).toBe('- Enter a valid email address.');
    expect(wrapper.find(ListItemText).at(2).prop('children')).toBe('- This password is too short. It must contain at least 8 characters.');
    expect(wrapper.find(ListItemText).at(3).prop('children')).toBe('- This password is too common.');
    expect(wrapper.find(ListItemText).at(4).prop('children')).toBe('- This password is entirely numeric.');
    expect(wrapper.find(TextField).at(0).prop('error')).toBeTruthy();
    expect(wrapper.find(TextField).at(1).prop('error')).toBeTruthy();
    expect(wrapper.find(TextField).at(2).prop('error')).toBeTruthy();
    expect(wrapper.find(TextField).at(3).prop('error')).toBeFalsy();
    done();
  });
});

test('SignUp redirects to root after success', (done) => {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTQwMzQzMjIxLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwib3JpZ19pYXQiOjE1NDAzMzk2MjF9.tumcSSAbKeWXc2QDd7KFR9IGh3PCsyHnCe6JLSszWpc';
  const username = 'admin';
  const email = 'admin@example.com';
  const password1 = 'password123';
  const password2 = 'password123';

  mock.reset();
  mock.onPost('/jwt/auth/registration/', {
    username,
    email,
    password1,
    password2,
  }).reply(200, {
    access_token: token,
  });
  const cookiesWrapper = shallowWithIntl(<SignUp store={store} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive().dive()
    .dive()
    .dive();

  wrapper.find(TextField).at(0).simulate('change', {
    target: {
      value: username,
    },
  });
  wrapper.find(TextField).at(1).simulate('change', {
    target: {
      value: email,
    },
  });
  wrapper.find(TextField).at(2).simulate('change', {
    target: {
      value: password1,
    },
  });
  wrapper.find(TextField).at(3).simulate('change', {
    target: {
      value: password2,
    },
  });

  wrapper.instance().signUp({ preventDefault: jest.fn() }).then(() => {
    wrapper.update();

    expect(cookies.get('auth_jwt')).toBe(token);
    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).prop('to')).toEqual({
      pathname: '/',
    });
    expect(store.dispatch).toHaveBeenCalledWith(
      updateUser({ ...jwtDecode(token), isSocial: false }),
    );

    cookies.remove('auth_jwt');
    done();
  });
});

test('SignUp redirects to next after success', (done) => {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTQwMzQzMjIxLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwib3JpZ19pYXQiOjE1NDAzMzk2MjF9.tumcSSAbKeWXc2QDd7KFR9IGh3PCsyHnCe6JLSszWpc';
  const username = 'admin';
  const email = 'admin@example.com';
  const password1 = 'password123';
  const password2 = 'password123';

  mock.reset();
  mock.onPost('/jwt/auth/registration/', {
    username,
    email,
    password1,
    password2,
  }).reply(200, {
    access_token: token,
  });
  const cookiesWrapper = shallowWithIntl(<SignUp store={store} location={{ state: { next: '/courses' } }} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive().dive()
    .dive()
    .dive();

  wrapper.find(TextField).at(0).simulate('change', {
    target: {
      value: username,
    },
  });
  wrapper.find(TextField).at(1).simulate('change', {
    target: {
      value: email,
    },
  });
  wrapper.find(TextField).at(2).simulate('change', {
    target: {
      value: password1,
    },
  });
  wrapper.find(TextField).at(3).simulate('change', {
    target: {
      value: password2,
    },
  });

  wrapper.instance().signUp({ preventDefault: jest.fn() }).then(() => {
    wrapper.update();

    expect(cookies.get('auth_jwt')).toBe(token);
    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).prop('to')).toEqual({
      pathname: '/courses',
    });
    expect(store.dispatch).toHaveBeenCalledWith(
      updateUser({ ...jwtDecode(token), isSocial: false }),
    );

    cookies.remove('auth_jwt');
    done();
  });
});
