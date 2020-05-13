import React from 'react';
import { Redirect } from 'react-router-dom';
import { TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import UserSetting from '../UserSetting';

let editUserPassword;
let editUserUsername;

describe('The UserSetting component', () => {
  beforeEach(() => {
    editUserPassword = jest.fn(() => Promise.resolve({}));
    editUserUsername = jest.fn(() => Promise.resolve({}));
  });

  test('renders on the page with no errors', () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isSocial: false,
    };
    const wrapper = shallowWithIntl(
      <UserSetting
        user={user}
        editUserPassword={editUserPassword}
        editUserUsername={editUserUsername}
      />,
    ).dive().dive();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find({ type: 'password' }).length).toBe(2);
  });

  test('hides password edit when social user', () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isSocial: true,
    };
    const wrapper = shallowWithIntl(
      <UserSetting
        user={user}
        editUserPassword={editUserPassword}
        editUserUsername={editUserUsername}
      />,
    ).dive().dive();
    expect(wrapper.find({ type: 'password' }).exists()).toBe(false);
  });

  test('saves user username', async () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isSocial: false,
    };
    const wrapper = shallowWithIntl(
      <UserSetting
        user={user}
        editUserPassword={editUserPassword}
        editUserUsername={editUserUsername}
      />,
    ).dive().dive();

    wrapper.find(TextField).first().simulate('change', {
      target: {
        name: 'username',
        value: 'newuser',
      },
    });
    wrapper.update();
    await wrapper.instance().saveUserUsername({ preventDefault: jest.fn() });

    expect(wrapper.state('saveSuccess')).toBe(true);
    expect(wrapper.state('usernameError')).toBeNull();
    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).prop('to')).toBe('/accounts/login');
    expect(editUserPassword).not.toHaveBeenCalled();
    expect(editUserUsername).toHaveBeenCalledWith('newuser');
  });

  test('saves user password', async () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isSocial: false,
    };
    const wrapper = shallowWithIntl(
      <UserSetting
        user={user}
        editUserPassword={editUserPassword}
        editUserUsername={editUserUsername}
      />,
    ).dive().dive();

    wrapper.find(TextField).at(1).simulate('change', {
      target: {
        name: 'password1',
        value: 'password',
      },
    });
    wrapper.find(TextField).at(2).simulate('change', {
      target: {
        name: 'password2',
        value: 'password',
      },
    });
    wrapper.update();
    await wrapper.instance().saveUserPassword({ preventDefault: jest.fn() });

    expect(wrapper.state('saveSuccess')).toBe(true);
    expect(wrapper.state('password1Error')).toBeNull();
    expect(wrapper.state('password2Error')).toBeNull();
    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).prop('to')).toBe('/accounts/login');
    expect(editUserUsername).not.toHaveBeenCalled();
    expect(editUserPassword).toHaveBeenCalledWith('password');
  });

  test('errors on password mismatch', async () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isSocial: false,
    };
    const wrapper = shallowWithIntl(
      <UserSetting
        user={user}
        editUserPassword={editUserPassword}
        editUserUsername={editUserUsername}
      />,
    ).dive().dive();

    wrapper.find(TextField).at(1).simulate('change', {
      target: {
        name: 'password1',
        value: '1234',
      },
    });
    wrapper.find(TextField).at(2).simulate('change', {
      target: {
        name: 'password2',
        value: '5678',
      },
    });
    wrapper.update();
    await wrapper.instance().saveUserPassword({ preventDefault: jest.fn() });

    expect(wrapper.state('saveSuccess')).toBe(false);
    expect(wrapper.state('password1Error')).toEqual(['Passwords must match']);
    expect(wrapper.state('password2Error')).toEqual(['Passwords must match']);
    expect(wrapper.find(Alert).exists()).toBe(true);
    expect(wrapper.find(Alert).last().prop('severity')).toBe('error');
    expect(editUserUsername).not.toHaveBeenCalled();
    expect(editUserPassword).not.toHaveBeenCalled();
  });

  test('displays error on username save error', async () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isSocial: false,
    };
    const error = new Error();
    error.response = {
      status: 400,
      data: {
        username: ['Username taken'],
      },
    };
    editUserUsername = jest.fn(() => Promise.reject(error));
    const wrapper = shallowWithIntl(
      <UserSetting
        user={user}
        editUserPassword={editUserPassword}
        editUserUsername={editUserUsername}
      />,
    ).dive().dive();

    await wrapper.instance().saveUserUsername({ preventDefault: jest.fn() });

    expect(wrapper.state('saveSuccess')).toBe(false);
    expect(wrapper.state('usernameError')).toEqual(['Username taken']);
    expect(wrapper.find(Alert).exists()).toBe(true);
    expect(wrapper.find(Alert).last().prop('severity')).toBe('error');
    expect(wrapper.find(TextField).first().prop('error')).toBe(true);
    expect(wrapper.find(TextField).at(1).prop('error')).toBe(false);
    expect(wrapper.find(TextField).at(2).prop('error')).toBe(false);
  });

  test('displays error on password save error', async () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isSocial: false,
    };
    const error = new Error();
    error.response = {
      status: 400,
      data: {
        new_password1: ['Too short'],
        new_password2: ['Too short'],
      },
    };
    editUserPassword = jest.fn(() => Promise.reject(error));
    const wrapper = shallowWithIntl(
      <UserSetting
        user={user}
        editUserPassword={editUserPassword}
        editUserUsername={editUserUsername}
      />,
    ).dive().dive();

    await wrapper.instance().saveUserPassword({ preventDefault: jest.fn() });

    expect(wrapper.state('saveSuccess')).toBe(false);
    expect(wrapper.state('password1Error')).toEqual(['Too short']);
    expect(wrapper.state('password2Error')).toEqual(['Too short']);
    expect(wrapper.find(Alert).exists()).toBe(true);
    expect(wrapper.find(Alert).last().prop('severity')).toBe('error');
    expect(wrapper.find(TextField).first().prop('error')).toBe(false);
    expect(wrapper.find(TextField).at(1).prop('error')).toBe(true);
    expect(wrapper.find(TextField).at(2).prop('error')).toBe(true);
  });
});
