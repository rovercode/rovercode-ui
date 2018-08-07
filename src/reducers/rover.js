import {
  FETCH_ROVERS,
  FETCH_ROVERS_FULFILLED,
  FETCH_ROVERS_REJECTED,
} from '../actions/rover';

export default function rovers(
  state = {
    isFetching: false,
    rovers: null,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case FETCH_ROVERS:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_ROVERS_FULFILLED:
      return {
        ...state,
        isFetching: false,
        rovers: action.payload,
        error: null,
      };
    case FETCH_ROVERS_REJECTED:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
