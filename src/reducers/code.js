import {
  CHANGE_EXECUTION_STATE,
  UPDATE_JSCODE,
  UPDATE_XMLCODE,
  CHANGE_NAME,
  CHANGE_ID,
  FETCH_PROGRAM,
  FETCH_PROGRAM_FULFILLED,
  FETCH_PROGRAM_REJECTED,
} from '../actions/code';

export default function code(
  state = {
    jsCode: null,
    xmlCode: null,
    execution: null,
    name: null,
    id: null,
    isFetching: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case UPDATE_JSCODE:
      return {
        ...state,
        jsCode: action.payload,
      };
    case UPDATE_XMLCODE:
      return {
        ...state,
        xmlCode: action.payload,
      };
    case CHANGE_EXECUTION_STATE:
      return {
        ...state,
        execution: action.payload,
      };
    case CHANGE_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case CHANGE_ID:
      return {
        ...state,
        id: action.payload,
      };
    case FETCH_PROGRAM:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_PROGRAM_FULFILLED:
      return {
        ...state,
        isFetching: false,
        xmlCode: action.payload.content,
        id: action.payload.id,
        name: action.payload.name,
      };
    case FETCH_PROGRAM_REJECTED:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
