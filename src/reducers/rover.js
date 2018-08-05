import {
  FETCH_ROVERS_REQUEST,
  FETCH_ROVERS_SUCCESS,
  FETCH_ROVERS_FAILURE,
} from '../actions/rover';

export default function rovers(
  state = {
    isFetching: false,
    rovers: [],
  },
  action,
) {
  switch (action.type) {
    case FETCH_ROVERS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_ROVERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        rovers: action.payload,
      };
    case FETCH_ROVERS_FAILURE:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
}
