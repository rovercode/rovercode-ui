import reducer from '../tag';
import {
  FETCH_TAGS_PENDING,
  FETCH_TAGS_FULFILLED,
  FETCH_TAGS_REJECTED,
} from '../../actions/tag';

describe('The tag reducer', () => {
  test('should handle FETCH_TAGS', () => {
    expect(
      reducer(undefined, {
        type: FETCH_TAGS_PENDING,
      }),
    ).toEqual({
      isFetching: true,
      tags: [],
      error: null,
    });

    const tags = [{
      name: 'tag1',
    }, {
      name: 'tag2',
    }];
    expect(
      reducer({}, {
        type: FETCH_TAGS_FULFILLED,
        payload: tags,
      }),
    ).toEqual({
      tags,
      isFetching: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: FETCH_TAGS_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      tags: [],
      isFetching: false,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
