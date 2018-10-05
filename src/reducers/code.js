import {
  CHANGE_EXECUTION_STATE,
  UPDATE_JSCODE,
  UPDATE_XMLCODE,
  CHANGE_NAME,
  CHANGE_ID,
} from '../actions/code';

export default function code(
  state = {
    jsCode: null,
    xmlCode: null,
    execution: null,
    name: null,
    id: null,
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
    default:
      return state;
  }
}
