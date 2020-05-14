import reducer from '../program';
import {
  CLEAR_PROGRAMS,
  FETCH_PROGRAMS_PENDING,
  FETCH_PROGRAMS_FULFILLED,
  FETCH_PROGRAMS_REJECTED,
  REMOVE_PROGRAM_PENDING,
  REMOVE_PROGRAM_FULFILLED,
  REMOVE_PROGRAM_REJECTED,
} from '../../actions/program';

describe('The program reducer', () => {
  test('should handle FETCH_PROGRAMS_PENDING', () => {
    expect(
      reducer(undefined, {
        type: FETCH_PROGRAMS_PENDING,
      }),
    ).toEqual({
      programsIsFetching: true,
      programsError: null,
      programs: null,
      isRemoving: false,
    });

    const programs = [];
    expect(
      reducer({}, {
        type: FETCH_PROGRAMS_FULFILLED,
        payload: programs,
      }),
    ).toEqual({
      programs,
      programsIsFetching: false,
      programsError: null,
    });

    const programsError = 'woops';
    expect(
      reducer({}, {
        type: FETCH_PROGRAMS_REJECTED,
        payload: programsError,
      }),
    ).toEqual({
      programsError,
      programsIsFetching: false,
    });
  });
  test('should handle REMOVE_PROGRAM_PENDING', () => {
    expect(
      reducer(undefined, {
        type: REMOVE_PROGRAM_PENDING,
      }),
    ).toEqual({
      programsIsFetching: false,
      programsError: null,
      programs: null,
      isRemoving: true,
    });

    expect(
      reducer({}, {
        type: REMOVE_PROGRAM_FULFILLED,
        payload: null,
      }),
    ).toEqual({
      isRemoving: false,
      programs: null,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: REMOVE_PROGRAM_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isRemoving: false,
    });
  });

  test('should handle CLEAR_PROGRAMS', () => {
    expect(
      reducer({ programs: [{}, {}] }, {
        type: CLEAR_PROGRAMS,
      }),
    ).toEqual({
      programs: null,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
