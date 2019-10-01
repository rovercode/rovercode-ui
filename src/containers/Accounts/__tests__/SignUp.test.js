import React from 'react';
import { Redirect } from 'react-router';
import { Form, List, Message } from 'semantic-ui-react';
import { shallowWithIntl } from 'enzyme-react-intl';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureStore from 'redux-mock-store';
import jwtDecode from 'jwt-decode';

import { updateUser } from '@/actions/user';

import SignUp from '../SignUp';

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

  const wrapper = cookiesWrapper.dive().dive().dive();

  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find(Message).exists()).toBe(false);
});

test('SignUp displays form errors', async () => {
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

  const wrapper = cookiesWrapper.dive().dive().dive();
  await wrapper.instance().signUp();
  wrapper.update();

  expect(wrapper.find(Message).exists()).toBe(true);
  expect(wrapper.find(List.Item).length).toBe(5);
  expect(wrapper.find(List.Item).at(0).prop('children')).toBe('A user with that username already exists.');
  expect(wrapper.find(List.Item).at(1).prop('children')).toBe('Enter a valid email address.');
  expect(wrapper.find(List.Item).at(2).prop('children')).toBe('This password is too short. It must contain at least 8 characters.');
  expect(wrapper.find(List.Item).at(3).prop('children')).toBe('This password is too common.');
  expect(wrapper.find(List.Item).at(4).prop('children')).toBe('This password is entirely numeric.');
  expect(wrapper.find(Form.Input).at(0).prop('error')).toBeTruthy();
  expect(wrapper.find(Form.Input).at(1).prop('error')).toBeTruthy();
  expect(wrapper.find(Form.Input).at(2).prop('error')).toBeTruthy();
  expect(wrapper.find(Form.Input).at(3).prop('error')).toBeFalsy();
});

test('SignUp redirects to root after success', async () => {
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
    token,
  });
  const cookiesWrapper = shallowWithIntl(<SignUp store={store} />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive().dive().dive();

  wrapper.find(Form.Input).at(0).simulate('change', {
    target: {
      value: username,
    },
  });
  wrapper.find(Form.Input).at(1).simulate('change', {
    target: {
      value: email,
    },
  });
  wrapper.find(Form.Input).at(2).simulate('change', {
    target: {
      value: password1,
    },
  });
  wrapper.find(Form.Input).at(3).simulate('change', {
    target: {
      value: password2,
    },
  });

  await wrapper.instance().signUp();
  wrapper.update();

  expect(cookies.get('auth_jwt')).toBe(token);
  expect(wrapper.find(Redirect).exists()).toBe(true);
  expect(wrapper.find(Redirect).prop('to')).toBe('/');
  expect(store.dispatch).toHaveBeenCalledWith(updateUser({ ...jwtDecode(token), isSocial: false }));

  cookies.remove('auth_jwt');
});
