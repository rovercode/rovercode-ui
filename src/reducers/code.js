import { CHANGE_EXECUTION_STATE, UPDATE_JSCODE } from '../actions/code';

export default function code(
  state = {
    jsCode: null,
    execution: null,
  },
  action,
) {
  switch (action.type) {
    case UPDATE_JSCODE:
      return {
        ...state,
        jsCode: action.payload,
      };
    case CHANGE_EXECUTION_STATE:
      return {
        ...state,
        execution: action.payload,
      };
    default:
      return state;
  }
}
