// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const FETCH_PROGRAM = 'FETCH_PROGRAM';
export const FETCH_PROGRAM_FULFILLED = `${FETCH_PROGRAM}_FULFILLED`;
export const FETCH_PROGRAM_REJECTED = `${FETCH_PROGRAM}_REJECTED`;
export const SAVE_PROGRAM = 'SAVE_PROGRAM';
export const SAVE_PROGRAM_FULFILLED = `${SAVE_PROGRAM}_FULFILLED`;
export const SAVE_PROGRAM_REJECTED = `${SAVE_PROGRAM}_REJECTED`;
export const CREATE_PROGRAM = 'CREATE_PROGRAM';
export const CREATE_PROGRAM_FULFILLED = `${CREATE_PROGRAM}_FULFILLED`;
export const CREATE_PROGRAM_REJECTED = `${CREATE_PROGRAM}_REJECTED`;

export const UPDATE_JSCODE = 'UPDATE_JSCODE';
export const UPDATE_XMLCODE = 'UPDATE_XMLCODE';
export const CHANGE_EXECUTION_STATE = 'CHANGE_EXECUTION_STATE';
export const CHANGE_NAME = 'CHANGE_NAME';
export const CHANGE_NAME_FULFILLED = `${CHANGE_NAME}_FULFILLED`;
export const CHANGE_NAME_REJECTED = `${CHANGE_NAME}_REJECTED`;
export const CHANGE_ID = 'CHANGE_ID';
export const CHANGE_READ_ONLY = 'CHANGE_READ_ONLY';

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

export const changeName = (id, name, xhroptions) => ({
  type: CHANGE_NAME,
  payload: axios.patch(`/api/v1/block-diagrams/${id}/`, {
    name,
  }, xhroptions)
    .then(({ data }) => (
      data
    )),
});

export const changeId = id => ({
  type: CHANGE_ID,
  payload: id,
});

export const fetchProgram = (id, xhroptions) => ({
  type: FETCH_PROGRAM,
  payload: axios.get(`/api/v1/block-diagrams/${id}/`, xhroptions)
    .then(({ data }) => (
      data
    )),
});

export const saveProgram = (id, content, name, xhroptions) => ({
  type: SAVE_PROGRAM,
  payload: axios.put(`/api/v1/block-diagrams/${id}/`, {
    content,
    name,
  }, xhroptions)
    .then(({ data }) => (
      data
    )),
});

export const createProgram = (name, xhroptions) => ({
  type: CREATE_PROGRAM,
  payload: axios.post('/api/v1/block-diagrams/', {
    name,
    content: '<xml></xml>',
  }, xhroptions)
    .then(({ data }) => (
      data
    )),
});

export const changeReadOnly = isReadOnly => ({
  type: CHANGE_READ_ONLY,
  payload: isReadOnly,
});
