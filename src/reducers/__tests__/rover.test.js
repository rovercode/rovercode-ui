import reducer from '../rover';
import {
  EDIT_ROVER,
  EDIT_ROVER_FULFILLED,
  EDIT_ROVER_REJECTED,
  FETCH_ROVER,
  FETCH_ROVER_FULFILLED,
  FETCH_ROVER_REJECTED,
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
      isEditing: false,
      isFetching: true,
      isFetchingSingle: false,
      isRemoving: false,
      error: null,
      rovers: null,
      rover: null,
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

  test('should handle FETCH_ROVER', () => {
    expect(
      reducer(undefined, {
        type: FETCH_ROVER,
      }),
    ).toEqual({
      isEditing: false,
      isFetching: false,
      isFetchingSingle: true,
      isRemoving: false,
      error: null,
      rovers: null,
      rover: null,
    });

    const rover = {
      name: 'Sparky',
    };
    expect(
      reducer({}, {
        type: FETCH_ROVER_FULFILLED,
        payload: rover,
      }),
    ).toEqual({
      rover,
      isFetchingSingle: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: FETCH_ROVER_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isFetchingSingle: false,
    });
  });

  test('should handle EDIT_ROVER', () => {
    expect(
      reducer(undefined, {
        type: EDIT_ROVER,
      }),
    ).toEqual({
      isEditing: true,
      isFetching: false,
      isFetchingSingle: false,
      isRemoving: false,
      error: null,
      rovers: null,
      rover: null,
    });

    const rover = {
      name: 'Sparky',
    };
    expect(
      reducer({}, {
        type: EDIT_ROVER_FULFILLED,
        payload: rover,
      }),
    ).toEqual({
      rover,
      isEditing: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: EDIT_ROVER_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isEditing: false,
    });
  });
  test('should handle REMOVE_ROVER', () => {
    expect(
      reducer(undefined, {
        type: REMOVE_ROVER,
      }),
    ).toEqual({
      isEditing: false,
      isFetching: false,
      isFetchingSingle: false,
      isRemoving: true,
      error: null,
      rovers: null,
      rover: null,
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
