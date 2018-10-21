import {
  SET_CLIENT_ID, SET_SESSION_ID, TOGGLE_FORMS, AWAITING_SUPPORT,
} from '../actions/chatapp';

export default function chatapp(
  state = {
    clientId: null,
    sessionId: null,
    chatHidden: true,
    formHidden: false,
    supportProvider: false,
  }, action,
) {
  switch (action.type) {
    case SET_CLIENT_ID:
      return {
        ...state,
        clientId: action.payload,
      };
    case SET_SESSION_ID:
      return {
        ...state,
        sessionId: action.payload,
      };
    case TOGGLE_FORMS:
      return {
        ...state,
        chatHidden: !state.chatHidden,
        formHidden: !state.formHidden,
      };
    case AWAITING_SUPPORT:
      return {
        ...state,
        awaitingSupport: !state.awaitingSupport,
      };
    default:
      return state;
  }
}
