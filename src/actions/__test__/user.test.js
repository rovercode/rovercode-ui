import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { editUserUsername, editUserPassword, updateUser } from '../user';


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
  test('editUserUsername', async () => {
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
    const payload = await action.payload;

    expect(type).toEqual('EDIT_USER_USERNAME');
    expect(payload).toEqual(user);
  });
  test('editUserPassword', async () => {
    const mock = new MockAdapter(axios);
    const password = 'password123';

    mock.onPost('/jwt/auth/password/change/', {
      new_password1: password,
      new_password2: password,
    }).reply(200, 'Password changed');

    const action = editUserPassword(password);
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('EDIT_USER_PASSWORD');
    expect(payload).toEqual('Password changed');
  });
});
