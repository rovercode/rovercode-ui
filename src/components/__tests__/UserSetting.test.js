import React from 'react';
import { Redirect } from 'react-router-dom';
import { TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import PlanClass from '../PlanClass';
import PlanItem from '../PlanItem';
import UserSetting from '../UserSetting';

let editUserPassword;
let editUserUsername;
let fetchSubscription;
let refreshSession;
let upgradeSubscription;

describe('The UserSetting component', () => {
  beforeEach(() => {
    editUserPassword = jest.fn().mockResolvedValue();
    editUserUsername = jest.fn().mockResolvedValue();
    fetchSubscription = jest.fn().mockResolvedValue();
    refreshSession = jest.fn().mockResolvedValue();
    upgradeSubscription = jest.fn().mockResolvedValue();
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
        fetchSubscription={fetchSubscription}
        refreshSession={refreshSession}
        upgradeSubscription={upgradeSubscription}
        isFetching
      />,
    ).dive().dive().dive();
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
        fetchSubscription={fetchSubscription}
        refreshSession={refreshSession}
        upgradeSubscription={upgradeSubscription}
        isFetching
      />,
    ).dive().dive().dive();
    expect(wrapper.find({ type: 'password' }).exists()).toBe(false);
  });

  test('saves user username', (done) => {
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
        fetchSubscription={fetchSubscription}
        refreshSession={refreshSession}
        upgradeSubscription={upgradeSubscription}
        isFetching
      />,
    ).dive().dive().dive();

    wrapper.find(TextField).first().simulate('change', {
      target: {
        name: 'username',
        value: 'newuser',
      },
    });
    wrapper.update();
    wrapper.instance().saveUserUsername({ preventDefault: jest.fn() }).then(() => {
      expect(wrapper.state('saveSuccess')).toBe(true);
      expect(wrapper.state('usernameError')).toBeNull();
      expect(wrapper.find(Redirect).exists()).toBe(true);
      expect(wrapper.find(Redirect).prop('to')).toBe('/accounts/login');
      expect(editUserPassword).not.toHaveBeenCalled();
      expect(editUserUsername).toHaveBeenCalledWith('newuser');
      done();
    });
  });

  test('saves user password', (done) => {
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
        fetchSubscription={fetchSubscription}
        refreshSession={refreshSession}
        upgradeSubscription={upgradeSubscription}
        isFetching
      />,
    ).dive().dive().dive();

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
    wrapper.instance().saveUserPassword({ preventDefault: jest.fn() }).then(() => {
      expect(wrapper.state('saveSuccess')).toBe(true);
      expect(wrapper.state('password1Error')).toBeNull();
      expect(wrapper.state('password2Error')).toBeNull();
      expect(wrapper.find(Redirect).exists()).toBe(true);
      expect(wrapper.find(Redirect).prop('to')).toBe('/accounts/login');
      expect(editUserUsername).not.toHaveBeenCalled();
      expect(editUserPassword).toHaveBeenCalledWith('password');
      done();
    });
  });

  test('errors on password mismatch', () => {
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
        fetchSubscription={fetchSubscription}
        refreshSession={refreshSession}
        upgradeSubscription={upgradeSubscription}
        isFetching
      />,
    ).dive().dive().dive();

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
    wrapper.instance().saveUserPassword({ preventDefault: jest.fn() });

    expect(wrapper.state('saveSuccess')).toBe(false);
    expect(wrapper.state('password1Error')).toEqual(['Passwords must match']);
    expect(wrapper.state('password2Error')).toEqual(['Passwords must match']);
    expect(wrapper.find(Alert).exists()).toBe(true);
    expect(wrapper.find(Alert).last().prop('severity')).toBe('error');
    expect(editUserUsername).not.toHaveBeenCalled();
    expect(editUserPassword).not.toHaveBeenCalled();
  });

  test('displays error on username save error', (done) => {
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
    editUserUsername = jest.fn().mockRejectedValue(error);
    const wrapper = shallowWithIntl(
      <UserSetting
        user={user}
        editUserPassword={editUserPassword}
        editUserUsername={editUserUsername}
        fetchSubscription={fetchSubscription}
        refreshSession={refreshSession}
        upgradeSubscription={upgradeSubscription}
        isFetching
      />,
    ).dive().dive().dive();

    wrapper.instance().saveUserUsername({ preventDefault: jest.fn() }).then(() => {
      expect(wrapper.state('saveSuccess')).toBe(false);
      expect(wrapper.state('usernameError')).toEqual(['Username taken']);
      expect(wrapper.find(Alert).exists()).toBe(true);
      expect(wrapper.find(Alert).last().prop('severity')).toBe('error');
      expect(wrapper.find(TextField).first().prop('error')).toBe(true);
      expect(wrapper.find(TextField).at(1).prop('error')).toBe(false);
      expect(wrapper.find(TextField).at(2).prop('error')).toBe(false);
      done();
    });
  });

  test('displays error on password save error', (done) => {
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
    editUserPassword = jest.fn().mockRejectedValue(error);
    const wrapper = shallowWithIntl(
      <UserSetting
        user={user}
        editUserPassword={editUserPassword}
        editUserUsername={editUserUsername}
        fetchSubscription={fetchSubscription}
        refreshSession={refreshSession}
        upgradeSubscription={upgradeSubscription}
        isFetching
      />,
    ).dive().dive().dive();

    wrapper.instance().saveUserPassword({ preventDefault: jest.fn() }).then(() => {
      expect(wrapper.state('saveSuccess')).toBe(false);
      expect(wrapper.state('password1Error')).toEqual(['Too short']);
      expect(wrapper.state('password2Error')).toEqual(['Too short']);
      expect(wrapper.find(Alert).exists()).toBe(true);
      expect(wrapper.find(Alert).last().prop('severity')).toBe('error');
      expect(wrapper.find(TextField).first().prop('error')).toBe(false);
      expect(wrapper.find(TextField).at(1).prop('error')).toBe(true);
      expect(wrapper.find(TextField).at(2).prop('error')).toBe(true);
      done();
    });
  });

  test('displays plans', () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isSocial: false,
    };
    const subscription = {
      plan: '2',
      price: 0,
      interval: '',
      start: 0,
    };
    const wrapper = shallowWithIntl(
      <UserSetting
        user={user}
        subscription={subscription}
        editUserPassword={editUserPassword}
        editUserUsername={editUserUsername}
        fetchSubscription={fetchSubscription}
        refreshSession={refreshSession}
        upgradeSubscription={upgradeSubscription}
        isFetching={false}
      />,
    ).dive().dive().dive();
    expect(wrapper.find(PlanItem).length).toBe(3);
    expect(wrapper.find(PlanItem).at(0).prop('active')).toBe(false);
    expect(wrapper.find(PlanItem).at(1).prop('active')).toBe(false);
    expect(wrapper.find(PlanItem).at(2).prop('active')).toBe(true);
  });

  test('handles upgrade error', () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'test@example.com',
      isSocial: false,
    };
    const subscription = {
      plan: '1',
      price: 0,
      interval: '',
      start: 0,
    };
    const wrapper = shallowWithIntl(
      <UserSetting
        user={user}
        subscription={subscription}
        editUserPassword={editUserPassword}
        editUserUsername={editUserUsername}
        fetchSubscription={fetchSubscription}
        refreshSession={refreshSession}
        upgradeSubscription={upgradeSubscription}
        isFetching={false}
        upgradeError={{
          response: {
            data: {
              accessCode: ['This code is not valid.'],
            },
          },
        }}
      />,
    ).dive().dive().dive();
    expect(wrapper.find(PlanItem).length).toBe(3);
    expect(wrapper.find(PlanItem).at(0).prop('active')).toBe(true);
    expect(wrapper.find(PlanItem).at(1).prop('active')).toBe(false);
    expect(wrapper.find(PlanItem).at(2).prop('active')).toBe(false);
    expect(wrapper.find(PlanClass).prop('error')).toBe('This code is not valid.');
  });
});
