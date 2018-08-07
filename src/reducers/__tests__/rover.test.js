import reducer from '../rover';
import {
  FETCH_ROVERS,
  FETCH_ROVERS_FULFILLED,
  FETCH_ROVERS_REJECTED,
} from '../../actions/rover';

describe('The rover reducer', () => {
  test('should handle FETCH_ROVERS', () => {
    expect(
      reducer({}, {
        type: FETCH_ROVERS,
      }),
    ).toEqual({
      isFetching: true,
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
  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
