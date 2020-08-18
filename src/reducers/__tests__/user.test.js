import reducer from '../user';
import {
  UPDATE_USER,
  EDIT_USER_USERNAME_PENDING,
  EDIT_USER_USERNAME_FULFILLED,
  EDIT_USER_USERNAME_REJECTED,
  EDIT_USER_PASSWORD_PENDING,
  EDIT_USER_PASSWORD_FULFILLED,
  EDIT_USER_PASSWORD_REJECTED,
  EDIT_USER_SHOW_GUIDE_PENDING,
  EDIT_USER_SHOW_GUIDE_FULFILLED,
  EDIT_USER_SHOW_GUIDE_REJECTED,
  FETCH_USER_STATS_PENDING,
  FETCH_USER_STATS_FULFILLED,
  FETCH_USER_STATS_REJECTED,
} from '../../actions/user';

describe('The user reducer', () => {
  test('should handle UPDATE_USER', () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      exp: 1540178211,
      isSocial: false,
      tier: 2,
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
      tier: user.tier,
    });
  });

  test('should handle EDIT_USER_USERNAME_PENDING', () => {
    expect(
      reducer(undefined, {
        type: EDIT_USER_USERNAME_PENDING,
      }),
    ).toEqual({
      user_id: null,
      username: null,
      email: null,
      exp: null,
      showGuide: true,
      isSocial: false,
      tier: 1,
      stats: null,
      isEditingUsername: true,
      isEditingPassword: false,
      isEditingShowGuide: false,
      isFetchingStats: false,
      editUsernameError: null,
      editPasswordError: null,
      editShowGuideError: null,
      fetchStatsError: null,
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

  test('should handle EDIT_USER_PASSWORD_PENDING', () => {
    expect(
      reducer(undefined, {
        type: EDIT_USER_PASSWORD_PENDING,
      }),
    ).toEqual({
      user_id: null,
      username: null,
      email: null,
      exp: null,
      showGuide: true,
      isSocial: false,
      tier: 1,
      stats: null,
      isEditingUsername: false,
      isEditingPassword: true,
      isEditingShowGuide: false,
      isFetchingStats: false,
      editUsernameError: null,
      editPasswordError: null,
      editShowGuideError: null,
      fetchStatsError: null,
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

  test('should handle EDIT_USER_SHOW_GUIDE_PENDING', () => {
    expect(
      reducer(undefined, {
        type: EDIT_USER_SHOW_GUIDE_PENDING,
      }),
    ).toEqual({
      user_id: null,
      username: null,
      email: null,
      exp: null,
      showGuide: true,
      isSocial: false,
      tier: 1,
      stats: null,
      isEditingUsername: false,
      isEditingPassword: false,
      isEditingShowGuide: true,
      isFetchingStats: false,
      editUsernameError: null,
      editPasswordError: null,
      editShowGuideError: null,
      fetchStatsError: null,
    });
  });

  test('should handle EDIT_USER_SHOW_GUIDE_FULFILLED', () => {
    const payload = {
      show_guide: false,
    };
    expect(
      reducer({}, {
        type: EDIT_USER_SHOW_GUIDE_FULFILLED,
        payload,
      }),
    ).toEqual({
      showGuide: false,
      isEditingShowGuide: false,
    });
  });

  test('should handle EDIT_USER_SHOW_GUIDE_REJECTED', () => {
    const error = 'woops';
    expect(
      reducer({}, {
        type: EDIT_USER_SHOW_GUIDE_REJECTED,
        payload: error,
      }),
    ).toEqual({
      isEditingShowGuide: false,
      editShowGuideError: error,
    });
  });

  test('should handle FETCH_USER_STATS_PENDING', () => {
    expect(
      reducer(undefined, {
        type: FETCH_USER_STATS_PENDING,
      }),
    ).toEqual({
      user_id: null,
      username: null,
      email: null,
      exp: null,
      showGuide: true,
      isSocial: false,
      tier: 1,
      stats: null,
      isEditingUsername: false,
      isEditingPassword: false,
      isEditingShowGuide: false,
      isFetchingStats: true,
      editUsernameError: null,
      editPasswordError: null,
      editShowGuideError: null,
      fetchStatsError: null,
    });
  });

  test('should handle FETCH_USER_STATS_FULFILLED', () => {
    const payload = {
      block_diagrams: {
        count: 3,
        allowed: 5,
      },
    };
    expect(
      reducer({}, {
        type: FETCH_USER_STATS_FULFILLED,
        payload,
      }),
    ).toEqual({
      stats: payload,
      isFetchingStats: false,
    });
  });

  test('should handle FETCH_USER_STATS_REJECTED', () => {
    const error = 'woops';
    expect(
      reducer({}, {
        type: FETCH_USER_STATS_REJECTED,
        payload: error,
      }),
    ).toEqual({
      isFetchingStats: false,
      fetchStatsError: error,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
