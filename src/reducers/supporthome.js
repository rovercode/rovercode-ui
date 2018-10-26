import {
  FETCH_SUPPORT_REQUESTS,
  FETCH_SUPPORT_REQUESTS_FULFILLED,
  FETCH_SUPPORT_REQUESTS_REJECTED,
  ROW_CLICKED,
  TOGGLE_IN_PROGRESS_STATE,
} from '../actions/supporthome';

export default function supporthome(
  state = {
    json: null,
    isFetching: false,
    rowInfo: {
      id: null,
      in_progress: false,
    },
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
    case TOGGLE_IN_PROGRESS_STATE:
      return {
        ...state,
        rowInfo: {
          in_progress: false,
        },
      };
    default:
      return state;
  }
}
