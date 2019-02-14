import reducer from '../rover';
import {
  FETCH_ROVERS,
  FETCH_ROVERS_FULFILLED,
  FETCH_ROVERS_REJECTED,
  REMOVE_ROVER,
  REMOVE_ROVER_FULFILLED,
  REMOVE_ROVER_REJECTED,
} from '../../actions/rover';

describe('The rover reducer', () => {
  test('should handle FETCH_ROVERS', () => {
    expect(
      reducer(undefined, {
        type: FETCH_ROVERS,
      }),
    ).toEqual({
      isFetching: true,
      isRemoving: false,
      error: null,
      rovers: null,
    });

    const rovers = [];
    expect(
      reducer({}, {
        type: FETCH_ROVERS_FULFILLED,
        payload: rovers,
      }),
    ).toEqual({
      rovers,
      isFetching: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: FETCH_ROVERS_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isFetching: false,
    });
  });
  test('should handle REMOVE_ROVER', () => {
    expect(
      reducer(undefined, {
        type: REMOVE_ROVER,
      }),
    ).toEqual({
      isFetching: false,
      isRemoving: true,
      error: null,
      rovers: null,
    });

    expect(
      reducer({}, {
        type: REMOVE_ROVER_FULFILLED,
        payload: null,
      }),
    ).toEqual({
      isRemoving: false,
      rovers: null,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: REMOVE_ROVER_REJECTED,
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
