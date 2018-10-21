import {
  SET_CLIENT_ID, SET_SESSION_ID, TOGGLE_FORMS, SET_IS_SUPPORT_PROVIDER,
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
    case SET_IS_SUPPORT_PROVIDER:
      return {
        ...state,
        supportProvider: true,
      };
    default:
      return state;
  }
}
