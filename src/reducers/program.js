import {
  FETCH_PROGRAMS_PENDING,
  FETCH_PROGRAMS_FULFILLED,
  FETCH_PROGRAMS_REJECTED,
  FETCH_USER_PROGRAMS_PENDING,
  FETCH_USER_PROGRAMS_FULFILLED,
  FETCH_USER_PROGRAMS_REJECTED,
  FETCH_FEATURED_PROGRAMS_PENDING,
  FETCH_FEATURED_PROGRAMS_FULFILLED,
  FETCH_FEATURED_PROGRAMS_REJECTED,
  REMOVE_PROGRAM_PENDING,
  REMOVE_PROGRAM_FULFILLED,
  REMOVE_PROGRAM_REJECTED,
} from '../actions/program';

export default function programs(
  state = {
    programsIsFetching: false,
    userProgramsIsFetching: false,
    featuredProgramsIsFetching: false,
    isRemoving: false,
    programs: null,
    userPrograms: null,
    featuredPrograms: null,
    programsError: null,
    userProgramsError: null,
    featuredProgramsError: null,
  },
  action,
) {
  switch (action.type) {
    case FETCH_PROGRAMS_PENDING:
      return {
        ...state,
        programsIsFetching: true,
      };
    case FETCH_USER_PROGRAMS_PENDING:
      return {
        ...state,
        userProgramsIsFetching: true,
      };
    case FETCH_FEATURED_PROGRAMS_PENDING:
      return {
        ...state,
        featuredProgramsIsFetching: true,
      };
    case FETCH_PROGRAMS_FULFILLED:
      return {
        ...state,
        programsIsFetching: false,
        programs: action.payload,
        programsError: null,
      };
    case FETCH_USER_PROGRAMS_FULFILLED:
      return {
        ...state,
        userProgramsIsFetching: false,
        userPrograms: action.payload,
        userProgramsError: null,
      };
    case FETCH_FEATURED_PROGRAMS_FULFILLED:
      return {
        ...state,
        featuredProgramsIsFetching: false,
        featuredPrograms: action.payload,
        featuredProgramsError: null,
      };
    case FETCH_PROGRAMS_REJECTED:
      return {
        ...state,
        programsIsFetching: false,
        programsError: action.payload,
      };
    case FETCH_USER_PROGRAMS_REJECTED:
      return {
        ...state,
        userProgramsIsFetching: false,
        userProgramsError: action.payload,
      };
    case FETCH_FEATURED_PROGRAMS_REJECTED:
      return {
        ...state,
        featuredProgramsIsFetching: false,
        featuredProgramsError: action.payload,
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
