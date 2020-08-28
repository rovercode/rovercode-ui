import reducer from '../notification';
import { SHOW_NOTIFICATION, CLEAR_NOTIFICATION } from '../../actions/notification';

describe('The notification reducer', () => {
  test('should handle SHOW_NOTIFICATION', () => {
    expect(
      reducer(undefined, {
        type: SHOW_NOTIFICATION,
        payload: {
          message: 'message',
          duration: 1000,
          severity: 'info',
        },
      }),
    ).toEqual({
      message: 'message',
      duration: 1000,
      severity: 'info',
    });
  });

  test('should handle CLEAR_NOTIFICATION', () => {
    expect(
      reducer({
        message: 'message',
        duration: 1000,
        severity: 'info',
      }, {
        type: CLEAR_NOTIFICATION,
      }),
    ).toEqual({
      message: undefined,
      duration: undefined,
      severity: undefined,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
