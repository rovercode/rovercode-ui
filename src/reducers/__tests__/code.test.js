import reducer from '../code';
import {
  CHANGE_EXECUTION_STATE,
  EXECUTION_RUN,
  UPDATE_JSCODE,
  UPDATE_XMLCODE,
  CHANGE_NAME,
  CHANGE_ID,
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

  test('should handle UPDATE_XMLCODE', () => {
    expect(
      reducer({}, {
        type: UPDATE_XMLCODE,
        payload: 'testcode',
      }),
    ).toEqual({
      xmlCode: 'testcode',
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

  test('should handle CHANGE_NAME', () => {
    expect(
      reducer({}, {
        type: CHANGE_NAME,
        payload: 'test name',
      }),
    ).toEqual({
      name: 'test name',
    });
  });

  test('should handle CHANGE_ID', () => {
    expect(
      reducer({}, {
        type: CHANGE_ID,
        payload: 123,
      }),
    ).toEqual({
      id: 123,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
