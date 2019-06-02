// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

export const UPDATE_VALID_AUTH = 'UPDATE_VALID_AUTH';

// action creators
export const updateValidAuth = isValidAuth => ({
  type: UPDATE_VALID_AUTH,
  payload: isValidAuth,
});
