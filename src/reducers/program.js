import {
  CLEAR_PROGRAMS,
  FETCH_PROGRAMS_PENDING,
  FETCH_PROGRAMS_FULFILLED,
  FETCH_PROGRAMS_REJECTED,
  REMOVE_PROGRAM_PENDING,
  REMOVE_PROGRAM_FULFILLED,
  REMOVE_PROGRAM_REJECTED,
} from '../actions/program';

export default function programs(
  state = {
    programsIsFetching: false,
    isRemoving: false,
    programs: null,
    programsError: null,
  },
  action,
) {
  switch (action.type) {
    case CLEAR_PROGRAMS:
      return {
        ...state,
        programs: null,
      };
    case FETCH_PROGRAMS_PENDING:
      return {
        ...state,
        programsIsFetching: true,
      };
    case FETCH_PROGRAMS_FULFILLED:
      return {
        ...state,
        programsIsFetching: false,
        programs: action.payload,
        programsError: null,
      };
    case FETCH_PROGRAMS_REJECTED:
      return {
        ...state,
        programsIsFetching: false,
        programsError: action.payload,
      };
    case REMOVE_PROGRAM_PENDING:
      return {
        ...state,
        isRemoving: true,
      };
    case REMOVE_PROGRAM_FULFILLED:
      return {
        ...state,
        isRemoving: false,
        programs: null,
        error: null,
      };
    case REMOVE_PROGRAM_REJECTED:
      return {
        ...state,
        isRemoving: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
