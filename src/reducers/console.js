import { APPEND, CLEAR } from '../actions/console';

export default function console(
  state = {
    messages: [],
  },
  action,
) {
  switch (action.type) {
    case APPEND:
      state.messages.push(action.payload);
      return state;
    case CLEAR:
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
}
