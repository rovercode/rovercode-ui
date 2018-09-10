// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

export const UPDATE_JSCODE = 'UPDATE_JSCODE';

// action creators
export const updateJsCode = jsCode => ({
  type: UPDATE_JSCODE,
  payload: jsCode,
});
