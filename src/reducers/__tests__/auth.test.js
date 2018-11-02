import reducer from '../auth';
import { UPDATE_VALID_AUTH } from '../../actions/auth';

describe('The auth reducer', () => {
  test('should handle UPDATE_VALID_AUTH', () => {
    expect(
      reducer({}, {
        type: UPDATE_VALID_AUTH,
        payload: false,
      }),
    ).toEqual({
      isValidAuth: false,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
