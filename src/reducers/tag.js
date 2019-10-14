import {
  FETCH_TAGS_PENDING,
  FETCH_TAGS_FULFILLED,
  FETCH_TAGS_REJECTED,
} from '../actions/tag';

export default function tags(
  state = {
    isFetching: false,
    tags: [],
    error: null,
  },
  action,
) {
  switch (action.type) {
    case FETCH_TAGS_PENDING:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_TAGS_FULFILLED:
      return {
        ...state,
        isFetching: false,
        tags: action.payload,
        error: null,
      };
    case FETCH_TAGS_REJECTED:
      return {
        ...state,
        isFetching: false,
        tags: [],
        error: action.payload,
      };
    default:
      return state;
  }
}
