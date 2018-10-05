// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

export const UPDATE_JSCODE = 'UPDATE_JSCODE';
export const UPDATE_XMLCODE = 'UPDATE_XMLCODE';
export const CHANGE_EXECUTION_STATE = 'CHANGE_EXECUTION_STATE';
export const CHANGE_NAME = 'CHANGE_NAME';
export const CHANGE_ID = 'CHANGE_ID';

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

export const updateXmlCode = xmlCode => ({
  type: UPDATE_XMLCODE,
  payload: xmlCode,
});

export const changeExecutionState = state => ({
  type: CHANGE_EXECUTION_STATE,
  payload: state,
});

export const changeName = name => ({
  type: CHANGE_NAME,
  payload: name,
});

export const changeId = id => ({
  type: CHANGE_ID,
  payload: id,
});
