import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  editUserUsername,
  editUserPassword,
  editUserShowGuide,
  fetchUserStats,
  refreshSession,
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
  test('fetchUserStats', (done) => {
    const mock = new MockAdapter(axios);
    const data = {
      block_diagrams: {
        count: 3,
        allowed: 5,
      },
    };

    mock.onGet('/api/v1/users/1/stats/').reply(200, data);

    const action = fetchUserStats(1);
    const { type } = action;
    expect(type).toEqual('FETCH_USER_STATS');
    action.payload.then((result) => {
      expect(result).toEqual(data);
      done();
    });
  });
  test('refreshSession', (done) => {
    const mock = new MockAdapter(axios);
    const mockCookies = {
      get: jest.fn(() => 'eyey0'),
    };
    const user = {
      username: 'testuser',
      email: 'testuser@example.com',
      exp: 1629483380,
    };
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1OTc5NDczODAsImV4cCI6MTYyOTQ4MzM4MCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsInVzZXJfaWQiOiIxIiwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJ0aWVyIjoiMiJ9.w2oj_k6rD0VnsKgzOEHxKEPOkA137xkA4mRBaIjesCs';
    mock.onPost('/api/api-token-refresh/', { token: 'eyey0' }).reply(200, { token });
    const action = refreshSession(mockCookies);
    const { type } = action;

    expect(type).toEqual('REFRESH_SESSION');
    action.payload.then((result) => {
      expect(result.username).toEqual(user.username);
      expect(result.email).toEqual(user.email);
      expect(result.exp).toEqual(user.exp);
      done();
    });
  });
});
