import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Message } from 'semantic-ui-react';
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

    wrapper.find(Form.Input).first().simulate('change', null, {
      name: 'username',
      value: 'newuser',
    });
    wrapper.update();
    await wrapper.instance().saveUserUsername();

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

    wrapper.find(Form.Input).at(1).simulate('change', null, {
      name: 'password1',
      value: 'password',
    });
    wrapper.find(Form.Input).at(2).simulate('change', null, {
      name: 'password2',
      value: 'password',
    });
    wrapper.update();
    await wrapper.instance().saveUserPassword();

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

    wrapper.find(Form.Input).at(1).simulate('change', null, {
      name: 'password1',
      value: '1234',
    });
    wrapper.find(Form.Input).at(2).simulate('change', null, {
      name: 'password2',
      value: '5678',
    });
    wrapper.update();
    await wrapper.instance().saveUserPassword();

    expect(wrapper.state('saveSuccess')).toBe(false);
    expect(wrapper.state('password1Error')).toEqual(['Passwords must match']);
    expect(wrapper.state('password2Error')).toEqual(['Passwords must match']);
    expect(wrapper.find(Message).exists()).toBe(true);
    expect(wrapper.find(Message).last().prop('negative')).toBe(true);
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

    await wrapper.instance().saveUserUsername();

    expect(wrapper.state('saveSuccess')).toBe(false);
    expect(wrapper.state('usernameError')).toEqual(['Username taken']);
    expect(wrapper.find(Message).exists()).toBe(true);
    expect(wrapper.find(Message).last().prop('negative')).toBe(true);
    expect(wrapper.find(Form.Input).first().prop('error')).not.toBeNull();
    expect(wrapper.find(Form.Input).at(1).prop('error')).toBeNull();
    expect(wrapper.find(Form.Input).at(2).prop('error')).toBeNull();
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

    await wrapper.instance().saveUserPassword();

    expect(wrapper.state('saveSuccess')).toBe(false);
    expect(wrapper.state('password1Error')).toEqual(['Too short']);
    expect(wrapper.state('password2Error')).toEqual(['Too short']);
    expect(wrapper.find(Message).exists()).toBe(true);
    expect(wrapper.find(Message).last().prop('negative')).toBe(true);
    expect(wrapper.find(Form.Input).first().prop('error')).toBeNull();
    expect(wrapper.find(Form.Input).at(1).prop('error')).not.toBeNull();
    expect(wrapper.find(Form.Input).at(2).prop('error')).not.toBeNull();
  });
});
