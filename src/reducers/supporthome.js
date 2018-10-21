import {
  FETCH_SUPPORT_REQUESTS,
  FETCH_SUPPORT_REQUESTS_FULFILLED,
  FETCH_SUPPORT_REQUESTS_REJECTED,
  ROW_CLICKED,
} from '../actions/supporthome';

export default function supporthome(
  state = {
    json: null,
    isFetching: false,
    rowInfo: {},
  },
  action,
) {
  switch (action.type) {
    case FETCH_SUPPORT_REQUESTS:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_SUPPORT_REQUESTS_FULFILLED:
      return {
        ...state,
        isFetching: false,
        json: action.payload,
      };
    case FETCH_SUPPORT_REQUESTS_REJECTED:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    case ROW_CLICKED:
      return {
        ...state,
        rowInfo: action.payload,
      };
    default:
      return state;
  }
}
