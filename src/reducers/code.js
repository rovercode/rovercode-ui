import {
  CHANGE_EXECUTION_STATE,
  UPDATE_JSCODE,
  UPDATE_XMLCODE,
  CHANGE_NAME,
  CHANGE_NAME_FULFILLED,
  CHANGE_NAME_REJECTED,
  CHANGE_ID,
  FETCH_PROGRAM,
  FETCH_PROGRAM_FULFILLED,
  FETCH_PROGRAM_REJECTED,
  SAVE_PROGRAM,
  SAVE_PROGRAM_FULFILLED,
  SAVE_PROGRAM_REJECTED,
  CREATE_PROGRAM,
  CREATE_PROGRAM_FULFILLED,
  CREATE_PROGRAM_REJECTED,
} from '../actions/code';

export default function code(
  state = {
    jsCode: null,
    xmlCode: null,
    execution: null,
    name: null,
    id: null,
    isFetching: false,
    isSaving: false,
    isCreating: false,
    isChangingName: false,
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
        isChangingName: true,
      };
    case CHANGE_NAME_FULFILLED:
      return {
        ...state,
        isChangingName: false,
        name: action.payload.name,
      };
    case CHANGE_NAME_REJECTED:
      return {
        ...state,
        isChangingName: false,
        error: action.payload,
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
    case SAVE_PROGRAM:
      return {
        ...state,
        isSaving: true,
      };
    case SAVE_PROGRAM_FULFILLED:
      return {
        ...state,
        isSaving: false,
        xmlCode: action.payload.content,
        id: action.payload.id,
        name: action.payload.name,
      };
    case SAVE_PROGRAM_REJECTED:
      return {
        ...state,
        isSaving: false,
        error: action.payload,
      };
    case CREATE_PROGRAM:
      return {
        ...state,
        isCreating: true,
      };
    case CREATE_PROGRAM_FULFILLED:
      return {
        ...state,
        isCreating: false,
        xmlCode: action.payload.content,
        id: action.payload.id,
        name: action.payload.name,
      };
    case CREATE_PROGRAM_REJECTED:
      return {
        ...state,
        isCreating: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
