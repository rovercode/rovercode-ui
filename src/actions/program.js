// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const CLEAR_PROGRAMS = 'CLEAR_PROGRAMS';
export const FETCH_PROGRAMS = 'FETCH_PROGRAMS';
export const FETCH_PROGRAMS_PENDING = `${FETCH_PROGRAMS}_PENDING`;
export const FETCH_PROGRAMS_FULFILLED = `${FETCH_PROGRAMS}_FULFILLED`;
export const FETCH_PROGRAMS_REJECTED = `${FETCH_PROGRAMS}_REJECTED`;
export const REMOVE_PROGRAM = 'REMOVE_PROGRAM';
export const REMOVE_PROGRAM_PENDING = `${REMOVE_PROGRAM}_PENDING`;
export const REMOVE_PROGRAM_FULFILLED = `${REMOVE_PROGRAM}_FULFILLED`;
export const REMOVE_PROGRAM_REJECTED = `${REMOVE_PROGRAM}_REJECTED`;

// action creators
export const clearPrograms = () => ({
  type: CLEAR_PROGRAMS,
});

export const fetchPrograms = (xhrOptions) => ({
  type: FETCH_PROGRAMS,
  meta: {
    debounce: {
      time: 500,
    },
  },
  payload: axios.get('/api/v1/block-diagrams/', xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const removeProgram = (id, xhrOptions) => ({
  type: REMOVE_PROGRAM,
  payload: axios.delete(`/api/v1/block-diagrams/${id}/`, xhrOptions)
    .then(({ data }) => (
      data
    )),
});
