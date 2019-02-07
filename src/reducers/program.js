import {
  FETCH_PROGRAMS,
  FETCH_PROGRAMS_FULFILLED,
  FETCH_PROGRAMS_REJECTED,
  FETCH_USER_PROGRAMS,
  FETCH_USER_PROGRAMS_FULFILLED,
  FETCH_USER_PROGRAMS_REJECTED,
} from '../actions/program';

export default function programs(
  state = {
    programsIsFetching: false,
    userProgramsIsFetching: false,
    programs: null,
    userPrograms: null,
    programsError: null,
    userProgramsError: null,
  },
  action,
) {
  switch (action.type) {
    case FETCH_PROGRAMS:
      return {
        ...state,
        programsIsFetching: true,
      };
    case FETCH_USER_PROGRAMS:
      return {
        ...state,
        userProgramsIsFetching: true,
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
    default:
      return state;
  }
}
