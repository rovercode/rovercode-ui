import {
  FETCH_PROGRAMS,
  FETCH_PROGRAMS_FULFILLED,
  FETCH_PROGRAMS_REJECTED,
} from '../actions/program';

export default function programs(
  state = {
    isFetching: false,
    programs: null,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case FETCH_PROGRAMS:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_PROGRAMS_FULFILLED:
      return {
        ...state,
        isFetching: false,
        programs: action.payload,
        error: null,
      };
    case FETCH_PROGRAMS_REJECTED:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
