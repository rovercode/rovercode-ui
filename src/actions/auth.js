// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

export const UPDATE_VALID_AUTH = 'UPDATE_VALID_AUTH';
export const USER_LOGOUT = 'USER_LOGOUT';

// action creators
export const updateValidAuth = isValidAuth => ({
  type: UPDATE_VALID_AUTH,
  payload: isValidAuth,
});

export const logout = () => ({
  type: USER_LOGOUT,
});
