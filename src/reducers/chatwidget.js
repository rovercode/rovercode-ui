

import {
  TOGGLE_IN_PROGRESS_STATE, ADD_TO_CHAT_LOG,
} from '../actions/chatwidget';

export default function chatwidget(
  state = {
    in_progress: false,
    chat_log: [],
  }, action,
) {
  switch (action.type) {
    case TOGGLE_IN_PROGRESS_STATE:
      return {
        ...state,
        in_progress: !state.in_progress,
      };
    case ADD_TO_CHAT_LOG:
      return {
        ...state,
        chat_log: [...state.chat_log, action.payload]
      };
    default:
      return state;
  }
}
