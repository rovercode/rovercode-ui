// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const FETCH_PROGRAMS = 'FETCH_PROGRAMS';
export const FETCH_PROGRAMS_FULFILLED = `${FETCH_PROGRAMS}_FULFILLED`;
export const FETCH_PROGRAMS_REJECTED = `${FETCH_PROGRAMS}_REJECTED`;
export const FETCH_USER_PROGRAMS = 'FETCH_USER_PROGRAMS';
export const FETCH_USER_PROGRAMS_FULFILLED = `${FETCH_USER_PROGRAMS}_FULFILLED`;
export const FETCH_USER_PROGRAMS_REJECTED = `${FETCH_USER_PROGRAMS}_REJECTED`;

// action creators
export const fetchPrograms = (xhrOptions) => {
  let type = FETCH_PROGRAMS;

  if (xhrOptions && xhrOptions.params && xhrOptions.params.user) {
    type = FETCH_USER_PROGRAMS;
  }

  return ({
    type,
    payload: axios.get('/api/v1/block-diagrams/', xhrOptions)
      .then(({ data }) => (
        data
      )),
  });
};
