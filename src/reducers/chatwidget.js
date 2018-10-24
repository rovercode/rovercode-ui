

import {
  SET_CHATTING_WITH,
} from '../actions/chatwidget';

export default function chatwidget(
  state = {
    chattingWith: '',
  }, action,
) {
  switch (action.type) {
    case SET_CHATTING_WITH:
      return {
        ...state,
        chattingWith: action.payload,
      };
    default:
      return state;
  }
}
