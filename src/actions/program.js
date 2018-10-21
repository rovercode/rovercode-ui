// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const FETCH_PROGRAMS = 'FETCH_PROGRAMS';
export const FETCH_PROGRAMS_PENDING = `${FETCH_PROGRAMS}_PENDING`;
export const FETCH_PROGRAMS_FULFILLED = `${FETCH_PROGRAMS}_FULFILLED`;
export const FETCH_PROGRAMS_REJECTED = `${FETCH_PROGRAMS}_REJECTED`;

// action creators
export const fetchPrograms = xhrOptions => ({
  type: FETCH_PROGRAMS,
  payload: axios.get('/api/v1/block-diagrams/', xhrOptions)
    .then(({ data }) => (
      data
    )),
});
