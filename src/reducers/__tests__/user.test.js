import reducer from '../user';
import {
  UPDATE_USER,
  EDIT_USER_USERNAME,
  EDIT_USER_USERNAME_FULFILLED,
  EDIT_USER_USERNAME_REJECTED,
  EDIT_USER_PASSWORD,
  EDIT_USER_PASSWORD_FULFILLED,
  EDIT_USER_PASSWORD_REJECTED,
} from '../../actions/user';

describe('The user reducer', () => {
  test('should handle UPDATE_USER', () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      exp: 1540178211,
      isSocial: false,
    };
    expect(
      reducer({}, {
        type: UPDATE_USER,
        payload: user,
      }),
    ).toEqual({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      exp: user.exp,
      isSocial: user.isSocial,
    });
  });

  test('should handle EDIT_USER_USERNAME', () => {
    expect(
      reducer(undefined, {
        type: EDIT_USER_USERNAME,
      }),
    ).toEqual({
      user_id: null,
      username: null,
      email: null,
      exp: null,
      isSocial: false,
      isEditingUsername: true,
      isEditingPassword: false,
      editUsernameError: null,
      editPasswordError: null,
    });
  });

  test('should handle EDIT_USER_USERNAME_FULFILLED', () => {
    const user = {
      pk: 1,
      username: 'testuser',
      email: 'testuser@example.com',
    };
    expect(
      reducer({}, {
        type: EDIT_USER_USERNAME_FULFILLED,
        payload: user,
      }),
    ).toEqual({
      username: user.username,
      email: user.email,
      isEditingUsername: false,
    });
  });

  test('should handle EDIT_USER_USERNAME_REJECTED', () => {
    const error = 'woops';
    expect(
      reducer({}, {
        type: EDIT_USER_USERNAME_REJECTED,
        payload: error,
      }),
    ).toEqual({
      isEditingUsername: false,
      editUsernameError: error,
    });
  });

  test('should handle EDIT_USER_PASSWORD', () => {
    expect(
      reducer(undefined, {
        type: EDIT_USER_PASSWORD,
      }),
    ).toEqual({
      user_id: null,
      username: null,
      email: null,
      exp: null,
      isSocial: false,
      isEditingUsername: false,
      isEditingPassword: true,
      editUsernameError: null,
      editPasswordError: null,
    });
  });

  test('should handle EDIT_USER_PASSWORD_FULFILLED', () => {
    const user = {
      pk: 1,
      username: 'testuser',
      email: 'testuser@example.com',
    };
    expect(
      reducer({}, {
        type: EDIT_USER_PASSWORD_FULFILLED,
        payload: user,
      }),
    ).toEqual({
      isEditingPassword: false,
    });
  });

  test('should handle EDIT_USER_PASSWORD_REJECTED', () => {
    const error = 'woops';
    expect(
      reducer({}, {
        type: EDIT_USER_PASSWORD_REJECTED,
        payload: error,
      }),
    ).toEqual({
      isEditingPassword: false,
      editPasswordError: error,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
