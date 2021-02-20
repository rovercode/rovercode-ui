// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export const UPDATE_USER = 'UPDATE_USER';
export const EDIT_USER_USERNAME = 'EDIT_USER_USERNAME';
export const EDIT_USER_USERNAME_PENDING = `${EDIT_USER_USERNAME}_PENDING`;
export const EDIT_USER_USERNAME_FULFILLED = `${EDIT_USER_USERNAME}_FULFILLED`;
export const EDIT_USER_USERNAME_REJECTED = `${EDIT_USER_USERNAME}_REJECTED`;
export const EDIT_USER_PASSWORD = 'EDIT_USER_PASSWORD';
export const EDIT_USER_PASSWORD_PENDING = `${EDIT_USER_PASSWORD}_PENDING`;
export const EDIT_USER_PASSWORD_FULFILLED = `${EDIT_USER_PASSWORD}_FULFILLED`;
export const EDIT_USER_PASSWORD_REJECTED = `${EDIT_USER_PASSWORD}_REJECTED`;
export const EDIT_USER_SHOW_GUIDE = 'EDIT_USER_SHOW_GUIDE';
export const EDIT_USER_SHOW_GUIDE_PENDING = `${EDIT_USER_SHOW_GUIDE}_PENDING`;
export const EDIT_USER_SHOW_GUIDE_FULFILLED = `${EDIT_USER_SHOW_GUIDE}_FULFILLED`;
export const EDIT_USER_SHOW_GUIDE_REJECTED = `${EDIT_USER_SHOW_GUIDE}_REJECTED`;
export const FETCH_USER_STATS = 'FETCH_USER_STATS';
export const FETCH_USER_STATS_PENDING = `${FETCH_USER_STATS}_PENDING`;
export const FETCH_USER_STATS_FULFILLED = `${FETCH_USER_STATS}_FULFILLED`;
export const FETCH_USER_STATS_REJECTED = `${FETCH_USER_STATS}_REJECTED`;
export const REFRESH_SESSION = 'REFRESH_SESSION';
export const REFRESH_SESSION_PENDING = `${REFRESH_SESSION}_PENDING`;
export const REFRESH_SESSION_FULFILLED = `${REFRESH_SESSION}_FULFILLED`;
export const REFRESH_SESSION_REJECTED = `${REFRESH_SESSION}_REJECTED`;

// action creators
export const updateUser = (data) => ({
  type: UPDATE_USER,
  payload: data,
});

export const refreshSession = (cookies) => ({
  type: REFRESH_SESSION,
  payload: axios.post('/api/api-token-refresh/', {
    refresh: cookies.get('refresh_jwt'),
  })
    .then(({ data }) => (
      jwtDecode(data.access)
    )),
});

export const editUserUsername = (username, xhrOptions) => ({
  type: EDIT_USER_USERNAME,
  payload: axios.put('/jwt/auth/user/', { username }, xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const editUserPassword = (password, xhrOptions) => ({
  type: EDIT_USER_PASSWORD,
  payload: axios.post('/jwt/auth/password/change/', {
    new_password1: password,
    new_password2: password,
  }, xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const editUserShowGuide = (id, show, xhrOptions) => ({
  type: EDIT_USER_SHOW_GUIDE,
  payload: axios.patch(`/api/v1/users/${id}/`, { show_guide: show }, xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const fetchUserStats = (id, xhroptions) => ({
  type: FETCH_USER_STATS,
  payload: axios.get(`/api/v1/users/${id}/stats/`, xhroptions)
    .then(({ data }) => (
      data
    )),
});
