import {
  UPDATE_USER,
  EDIT_USER_USERNAME_PENDING,
  EDIT_USER_USERNAME_FULFILLED,
  EDIT_USER_USERNAME_REJECTED,
  EDIT_USER_PASSWORD_PENDING,
  EDIT_USER_PASSWORD_FULFILLED,
  EDIT_USER_PASSWORD_REJECTED,
  FETCH_USER_LIST_PENDING,
  FETCH_USER_LIST_FULFILLED,
  FETCH_USER_LIST_REJECTED,
} from '../actions/user';

export default function user(
  state = {
    user_id: null,
    username: null,
    email: null,
    exp: null,
    isSocial: false,
    userList: [],
    isEditingUsername: false,
    isEditingPassword: false,
    isFetchingUserList: false,
    editUsernameError: null,
    editPasswordError: null,
    fetchUserListError: null,
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
    case EDIT_USER_USERNAME_PENDING:
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
    case EDIT_USER_PASSWORD_PENDING:
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
    case FETCH_USER_LIST_PENDING:
      return {
        ...state,
        isFetchingUserList: true,
      };
    case FETCH_USER_LIST_FULFILLED:
      return {
        ...state,
        isFetchingUserList: false,
        userList: action.payload,
      };
    case FETCH_USER_LIST_REJECTED:
      return {
        ...state,
        isFetchingUserList: false,
        fetchUserListError: action.payload,
      };
    default:
      return state;
  }
}
