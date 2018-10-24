// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

export const UPDATE_USER = 'UPDATE_USER';

// action creators
export const updateUser = data => ({
  type: UPDATE_USER,
  payload: data,
});
