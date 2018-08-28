import React from 'react';
import { Form, List, Message } from 'semantic-ui-react';
import { shallow } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import PasswordReset from '../PasswordReset';

const mock = new MockAdapter(axios);

test('PasswordReset renders on the page with no errors', () => {
  const wrapper = shallow(<PasswordReset />);

  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find(Message).exists()).toBe(false);
});

test('PasswordReset displays form errors', async () => {
  mock.reset();
  mock.onPost('/jwt/auth/password/reset/').reply(400, {
    email: [
      'This field may not be blank.',
    ],
  });
  const wrapper = shallow(<PasswordReset />);

  await wrapper.instance().reset();
  wrapper.update();

  expect(wrapper.find(Message).exists()).toBe(true);
  expect(wrapper.find(List.Item).length).toBe(1);
  expect(wrapper.find(List.Item).at(0).prop('children')).toBe('This field may not be blank.');
  expect(wrapper.find(Form.Input).at(0).prop('error')).toBeTruthy();
});

test('PasswordReset displays success', async () => {
  const email = 'admin@example.com';

  mock.reset();
  mock.onPost('/jwt/auth/password/reset/', {
    email,
  }).reply(200, {
    detail: 'Password reset e-mail has been sent.',
  });
  const wrapper = shallow(<PasswordReset />);

  wrapper.find(Form.Input).at(0).simulate('change', {
    target: {
      value: email,
    },
  });

  await wrapper.instance().reset();
  wrapper.update();

  expect(wrapper.find(Message).exists()).toBe(true);
  expect(wrapper.find(Message).prop('children')).toBe('Password reset e-mail has been sent.');
  expect(wrapper.find(Form.Input).at(0).prop('error')).toBeFalsy();
});
