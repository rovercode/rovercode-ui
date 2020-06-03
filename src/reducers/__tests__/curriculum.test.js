import reducer from '../curriculum';
import {
  FETCH_COURSES_PENDING,
  FETCH_COURSES_FULFILLED,
  FETCH_COURSES_REJECTED,
} from '../../actions/curriculum';

describe('The curriculum reducer', () => {
  test('should handle FETCH_COURSES_PENDING', () => {
    expect(
      reducer(undefined, {
        type: FETCH_COURSES_PENDING,
      }),
    ).toEqual({
      isFetching: true,
      error: null,
      courses: null,
    });

    const courses = [];
    expect(
      reducer({}, {
        type: FETCH_COURSES_FULFILLED,
        payload: courses,
      }),
    ).toEqual({
      courses,
      isFetching: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: FETCH_COURSES_REJECTED,
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
