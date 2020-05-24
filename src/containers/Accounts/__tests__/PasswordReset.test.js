import React from 'react';
import axios from 'axios';
import { ListItemText, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import MockAdapter from 'axios-mock-adapter';

import PasswordReset from '../PasswordReset';

const mock = new MockAdapter(axios);

test('PasswordReset renders on the page with no errors', () => {
  const wrapper = shallowWithIntl(<PasswordReset />).dive().dive();

  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find(Alert).exists()).toBe(false);
});

test('PasswordReset displays form errors', (done) => {
  mock.reset();
  mock.onPost('/jwt/auth/password/reset/').reply(400, {
    email: [
      'This field may not be blank.',
    ],
  });
  const wrapper = shallowWithIntl(<PasswordReset />).dive().dive();

  wrapper.instance().reset({ preventDefault: jest.fn() }).then(() => {
    wrapper.update();

    expect(wrapper.find(Alert).exists()).toBe(true);
    expect(wrapper.find(ListItemText).length).toBe(1);
    expect(wrapper.find(ListItemText).at(0).prop('children')).toBe('- This field may not be blank.');
    expect(wrapper.find(TextField).at(0).prop('error')).toBeTruthy();
    done();
  });
});

test('PasswordReset displays success', (done) => {
  const email = 'admin@example.com';

  mock.reset();
  mock.onPost('/jwt/auth/password/reset/', {
    email,
  }).reply(200, {
    detail: 'Password reset e-mail has been sent.',
  });
  const wrapper = shallowWithIntl(<PasswordReset />).dive().dive();

  wrapper.find(TextField).at(0).simulate('change', {
    target: {
      value: email,
    },
  });

  wrapper.instance().reset({ preventDefault: jest.fn() }).then(() => {
    wrapper.update();

    expect(wrapper.find(Alert).exists()).toBe(true);
    expect(wrapper.find(Alert).prop('children')).toBe('Password reset e-mail has been sent.');
    expect(wrapper.find(TextField).at(0).prop('error')).toBeFalsy();
    done();
  });
});
