import {
  UPDATE_USER,
  EDIT_USER_USERNAME_PENDING,
  EDIT_USER_USERNAME_FULFILLED,
  EDIT_USER_USERNAME_REJECTED,
  EDIT_USER_PASSWORD_PENDING,
  EDIT_USER_PASSWORD_FULFILLED,
  EDIT_USER_PASSWORD_REJECTED,
  EDIT_USER_SHOW_GUIDE_PENDING,
  EDIT_USER_SHOW_GUIDE_FULFILLED,
  EDIT_USER_SHOW_GUIDE_REJECTED,
  FETCH_USER_STATS_PENDING,
  FETCH_USER_STATS_FULFILLED,
  FETCH_USER_STATS_REJECTED,
  REFRESH_SESSION_PENDING,
  REFRESH_SESSION_FULFILLED,
  REFRESH_SESSION_REJECTED,
} from '../actions/user';

export default function user(
  state = {
    user_id: null,
    username: null,
    email: null,
    exp: null,
    showGuide: true,
    tier: 1,
    stats: null,
    isSocial: false,
    isEditingUsername: false,
    isEditingPassword: false,
    isEditingShowGuide: false,
    isFetchingStats: false,
    isRefreshingSession: false,
    editUsernameError: null,
    editPasswordError: null,
    editShowGuideError: null,
    fetchStatsError: null,
    refreshSessionError: null,
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
        showGuide: action.payload.show_guide,
        isSocial: action.payload.isSocial,
        tier: action.payload.tier,
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
    case EDIT_USER_SHOW_GUIDE_PENDING:
      return {
        ...state,
        isEditingShowGuide: true,
      };
    case EDIT_USER_SHOW_GUIDE_FULFILLED:
      return {
        ...state,
        isEditingShowGuide: false,
        showGuide: action.payload.show_guide,
      };
    case EDIT_USER_SHOW_GUIDE_REJECTED:
      return {
        ...state,
        isEditingShowGuide: false,
        editShowGuideError: action.payload,
      };
    case FETCH_USER_STATS_PENDING:
      return {
        ...state,
        isFetchingStats: true,
      };
    case FETCH_USER_STATS_FULFILLED:
      return {
        ...state,
        isFetchingStats: false,
        stats: action.payload,
      };
    case FETCH_USER_STATS_REJECTED:
      return {
        ...state,
        isFetchingStats: false,
        fetchStatsError: action.payload,
      };
    case REFRESH_SESSION_FULFILLED:
      return {
        ...state,
        isRefreshingSession: false,
        user_id: action.payload.user_id,
        username: action.payload.username,
        email: action.payload.email,
        exp: action.payload.exp,
        isSocial: action.payload.isSocial,
        tier: action.payload.tier,
      };
    case REFRESH_SESSION_PENDING:
      return {
        ...state,
        isRefreshingSession: true,
      };
    case REFRESH_SESSION_REJECTED:
      return {
        ...state,
        isRefreshingSession: false,
        refreshSessionError: action.payload,
      };
    default:
      return state;
  }
}
