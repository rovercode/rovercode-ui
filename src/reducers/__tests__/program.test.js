import reducer from '../program';
import {
  FETCH_PROGRAMS,
  FETCH_PROGRAMS_FULFILLED,
  FETCH_PROGRAMS_REJECTED,
  FETCH_USER_PROGRAMS,
  FETCH_USER_PROGRAMS_FULFILLED,
  FETCH_USER_PROGRAMS_REJECTED,
  REMOVE_PROGRAM,
  REMOVE_PROGRAM_FULFILLED,
  REMOVE_PROGRAM_REJECTED,
} from '../../actions/program';

describe('The program reducer', () => {
  test('should handle FETCH_PROGRAMS', () => {
    expect(
      reducer(undefined, {
        type: FETCH_PROGRAMS,
      }),
    ).toEqual({
      programsIsFetching: true,
      programsError: null,
      programs: null,
      userProgramsIsFetching: false,
      userProgramsError: null,
      userPrograms: null,
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
  test('should handle FETCH_USER_PROGRAMS', () => {
    expect(
      reducer(undefined, {
        type: FETCH_USER_PROGRAMS,
      }),
    ).toEqual({
      programsIsFetching: false,
      programsError: null,
      programs: null,
      userProgramsIsFetching: true,
      userProgramsError: null,
      userPrograms: null,
      isRemoving: false,
    });

    const userPrograms = [];
    expect(
      reducer({}, {
        type: FETCH_USER_PROGRAMS_FULFILLED,
        payload: userPrograms,
      }),
    ).toEqual({
      userPrograms,
      userProgramsIsFetching: false,
      userProgramsError: null,
    });

    const userProgramsError = 'woops';
    expect(
      reducer({}, {
        type: FETCH_USER_PROGRAMS_REJECTED,
        payload: userProgramsError,
      }),
    ).toEqual({
      userProgramsError,
      userProgramsIsFetching: false,
    });
  });
  test('should handle REMOVE_PROGRAM', () => {
    expect(
      reducer(undefined, {
        type: REMOVE_PROGRAM,
      }),
    ).toEqual({
      programsIsFetching: false,
      programsError: null,
      programs: null,
      userProgramsIsFetching: false,
      userProgramsError: null,
      userPrograms: null,
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
  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
