// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

export const UPDATE_JSCODE = 'UPDATE_JSCODE';
export const CHANGE_EXECUTION_STATE = 'CHANGE_EXECUTION_STATE';

// Execution States
export const EXECUTION_RUN = 1;
export const EXECUTION_STEP = 2;
export const EXECUTION_STOP = 3;
export const EXECUTION_RESET = 4;

// action creators
export const updateJsCode = jsCode => ({
  type: UPDATE_JSCODE,
  payload: jsCode,
});

export const changeExecutionState = state => ({
  type: CHANGE_EXECUTION_STATE,
  payload: state,
});
