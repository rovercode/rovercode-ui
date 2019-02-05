import reducer from '../program';
import {
  FETCH_PROGRAMS,
  FETCH_PROGRAMS_FULFILLED,
  FETCH_PROGRAMS_REJECTED,
} from '../../actions/program';

describe('The program reducer', () => {
  test('should handle FETCH_PROGRAMS', () => {
    expect(
      reducer(undefined, {
        type: FETCH_PROGRAMS,
      }),
    ).toEqual({
      isFetching: true,
      error: null,
      programs: null,
    });

    const programs = [];
    expect(
      reducer({}, {
        type: FETCH_PROGRAMS_FULFILLED,
        payload: programs,
      }),
    ).toEqual({
      programs,
      isFetching: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: FETCH_PROGRAMS_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isFetching: false,
    });
  });
  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
