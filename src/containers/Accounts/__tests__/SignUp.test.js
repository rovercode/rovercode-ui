import React from 'react';
import { Redirect } from 'react-router';
import { Form, List, Message } from 'semantic-ui-react';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import SignUp from '../SignUp';

const mock = new MockAdapter(axios);

const cookiesValues = { };
const cookies = new Cookies(cookiesValues);

test('SignUp renders on the page with no errors', () => {
  const cookiesWrapper = shallow(<SignUp />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive();

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
  const cookiesWrapper = shallow(<SignUp />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive();
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
    token: '1234',
  });
  const cookiesWrapper = shallow(<SignUp />, {
    context: { cookies },
  });

  const wrapper = cookiesWrapper.dive();

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

  expect(cookies.get('auth_jwt')).toBe('1234');
  expect(wrapper.find(Redirect).exists()).toBe(true);
  expect(wrapper.find(Redirect).prop('to')).toBe('/');

  cookies.remove('auth_jwt');
});
