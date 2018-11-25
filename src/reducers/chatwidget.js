

import {
  TOGGLE_IN_PROGRESS_STATE, ADD_TO_CHAT_LOG, CLOSE_TIPS,
  SET_CHATTING_WITH,
} from '../actions/chatwidget';

export default function chatwidget(
  state = {
    in_progress: false,
    chat_log: [],
    chatting_with: "",
    show_tips: true
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

    case SET_CHATTING_WITH:
      return {
        ...state,
        chatting_with: action.payload,
      };
    case CLOSE_TIPS:
      return {
        ...state,
        show_tips: false,
      };
    default:
      return state;
  }
}
