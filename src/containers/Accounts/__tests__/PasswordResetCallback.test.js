import React from 'react';
import { Redirect } from 'react-router';
import { Form, List, Message } from 'semantic-ui-react';
import { shallowWithIntl } from 'enzyme-react-intl';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import PasswordResetCallback from '../PasswordResetCallback';

const mock = new MockAdapter(axios);

const match = {
  params: {
    uid: 'ABC',
    token: '123',
  },
};

test('PasswordResetCallback renders on the page with no errors', () => {
  const wrapper = shallowWithIntl(<PasswordResetCallback match={match} />).dive();

  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find(Message).exists()).toBe(false);
});

test('PasswordResetCallback displays form errors', async () => {
  mock.reset();
  mock.onPost('/jwt/auth/password/reset/confirm/').reply(400, {
    new_password2: [
      'This password is too short. It must contain at least 8 characters.',
      'This password is too common.',
    ],
  });
  const wrapper = shallowWithIntl(<PasswordResetCallback match={match} />).dive();

  await wrapper.instance().confirm();
  wrapper.update();

  expect(wrapper.find(Message).exists()).toBe(true);
  expect(wrapper.find(List.Item).length).toBe(2);
  expect(wrapper.find(List.Item).at(0).prop('children')).toBe('This password is too short. It must contain at least 8 characters.');
  expect(wrapper.find(List.Item).at(1).prop('children')).toBe('This password is too common.');
  expect(wrapper.find(Form.Input).at(0).prop('error')).toBeFalsy();
  expect(wrapper.find(Form.Input).at(1).prop('error')).toBeTruthy();
});

test('SignUp redirects to login after success', async () => {
  const password1 = 'password123';
  const password2 = 'password123';

  mock.reset();
  mock.onPost('/jwt/auth/password/reset/confirm/', {
    uid: match.params.uid,
    token: match.params.token,
    new_password1: password1,
    new_password2: password2,
  }).reply(200, {
    detail: 'Password has been reset with the new password.',
  });
  const wrapper = shallowWithIntl(<PasswordResetCallback match={match} />).dive();

  wrapper.find(Form.Input).at(0).simulate('change', {
    target: {
      value: password1,
    },
  });
  wrapper.find(Form.Input).at(1).simulate('change', {
    target: {
      value: password2,
    },
  });

  await wrapper.instance().confirm();
  wrapper.update();

  expect(wrapper.find(Redirect).exists()).toBe(true);
  expect(wrapper.find(Redirect).prop('to')).toBe('/accounts/login');
});
