import {
  UPDATE_USER,
  EDIT_USER_USERNAME,
  EDIT_USER_USERNAME_FULFILLED,
  EDIT_USER_USERNAME_REJECTED,
  EDIT_USER_PASSWORD,
  EDIT_USER_PASSWORD_FULFILLED,
  EDIT_USER_PASSWORD_REJECTED,
} from '../actions/user';

export default function user(
  state = {
    user_id: null,
    username: null,
    email: null,
    exp: null,
    isSocial: false,
    isEditingUsername: false,
    isEditingPassword: false,
    editUsernameError: null,
    editPasswordError: null,
  },
  action,
) {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user_id: action.payload.user_id,
        username: action.payload.username,
        email: action.payload.email,
        exp: action.payload.exp,
        isSocial: action.payload.isSocial,
      };
    case EDIT_USER_USERNAME:
      return {
        ...state,
        isEditingUsername: true,
      };
    case EDIT_USER_USERNAME_FULFILLED:
      return {
        ...state,
        isEditingUsername: false,
        username: action.payload.username,
        email: action.payload.email,
      };
    case EDIT_USER_USERNAME_REJECTED:
      return {
        ...state,
        isEditingUsername: false,
        editUsernameError: action.payload,
      };
    case EDIT_USER_PASSWORD:
      return {
        ...state,
        isEditingPassword: true,
      };
    case EDIT_USER_PASSWORD_FULFILLED:
      return {
        ...state,
        isEditingPassword: false,
      };
    case EDIT_USER_PASSWORD_REJECTED:
      return {
        ...state,
        isEditingPassword: false,
        editPasswordError: action.payload,
      };
    default:
      return state;
  }
}
