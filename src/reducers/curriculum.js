import {
  FETCH_COURSES_PENDING,
  FETCH_COURSES_FULFILLED,
  FETCH_COURSES_REJECTED,
} from '../actions/curriculum';

export default function curriculum(
  state = {
    isFetching: false,
    courses: null,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case FETCH_COURSES_PENDING:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_COURSES_FULFILLED:
      return {
        ...state,
        isFetching: false,
        courses: action.payload,
        error: null,
      };
    case FETCH_COURSES_REJECTED:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
