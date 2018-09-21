import { APPEND, CLEAR } from '../actions/console';

export default function console(
  state = {
    messages: [],
  },
  action,
) {
  switch (action.type) {
    case APPEND:
      return {
        ...state,
        messages: state.messages.concat([action.payload]),
      };
    case CLEAR:
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
}
