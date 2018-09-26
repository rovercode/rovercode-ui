import reducer from '../console';
import {
  APPEND,
  CLEAR,
} from '../../actions/console';

describe('The console reducer', () => {
  test('should handle APPEND', () => {
    expect(
      reducer({ messages: ['first'] }, {
        type: APPEND,
        payload: 'second',
      }),
    ).toEqual({
      messages: ['first', 'second'],
    });
  });

  test('should handle CLEAR', () => {
    expect(
      reducer({ messages: ['first'] }, {
        type: CLEAR,
      }),
    ).toEqual({
      messages: [],
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
