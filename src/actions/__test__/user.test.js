import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  editUserUsername,
  editUserPassword,
  editUserShowGuide,
  updateUser,
} from '../user';


describe('User actions', () => {
  test('updateUser', () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      exp: 1540178211,
    };
    const action = updateUser(user);
    const { type, payload } = action;

    expect(type).toEqual('UPDATE_USER');
    expect(payload).toEqual(user);
  });
  test('editUserUsername', (done) => {
    const mock = new MockAdapter(axios);
    const username = 'test_username';
    const user = {
      pk: 1,
      username,
      email: 'test@example.com',
    };

    mock.onPut('/jwt/auth/user/', {
      username,
    }).reply(200, user);

    const action = editUserUsername(username);
    const { type } = action;
    expect(type).toEqual('EDIT_USER_USERNAME');
    action.payload.then((result) => {
      expect(result).toEqual(user);
      done();
    });
  });
  test('editUserPassword', (done) => {
    const mock = new MockAdapter(axios);
    const password = 'password123';

    mock.onPost('/jwt/auth/password/change/', {
      new_password1: password,
      new_password2: password,
    }).reply(200, 'Password changed');

    const action = editUserPassword(password);
    const { type } = action;
    expect(type).toEqual('EDIT_USER_PASSWORD');
    action.payload.then((result) => {
      expect(result).toEqual('Password changed');
      done();
    });
  });
  test('editUserShowGuide', (done) => {
    const mock = new MockAdapter(axios);
    const data = {
      show_guide: false,
    };

    mock.onPatch('/api/v1/users/1/', data).reply(200, data);

    const action = editUserShowGuide(1, false);
    const { type } = action;
    expect(type).toEqual('EDIT_USER_SHOW_GUIDE');
    action.payload.then((result) => {
      expect(result).toEqual(data);
      done();
    });
  });
});
