import reducer from '../code';
import {
  CHANGE_EXECUTION_STATE,
  EXECUTION_RUN,
  UPDATE_JSCODE,
} from '../../actions/code';

describe('The code reducer', () => {
  test('should handle UPDATE_JSCODE', () => {
    expect(
      reducer({}, {
        type: UPDATE_JSCODE,
        payload: 'testcode',
      }),
    ).toEqual({
      jsCode: 'testcode',
    });
  });

  test('should handle CHANGE_EXECUTION_STATE', () => {
    expect(
      reducer({}, {
        type: CHANGE_EXECUTION_STATE,
        payload: EXECUTION_RUN,
      }),
    ).toEqual({
      execution: EXECUTION_RUN,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
