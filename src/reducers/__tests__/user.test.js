import reducer from '../user';
import { UPDATE_USER } from '../../actions/user';

describe('The user reducer', () => {
  test('should handle UPDATE_USER', () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      exp: 1540178211,
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
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
