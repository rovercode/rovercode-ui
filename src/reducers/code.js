import { UPDATE_JSCODE } from '../actions/code';

export default function code(
  state = {
    jsCode: null,
  },
  action,
) {
  switch (action.type) {
    case UPDATE_JSCODE:
      return {
        ...state,
        jsCode: action.payload,
      };
    default:
      return state;
  }
}
