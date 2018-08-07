// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const FETCH_ROVERS = 'FETCH_ROVERS';
export const FETCH_ROVERS_FULFILLED = `${FETCH_ROVERS}_FULFILLED`;
export const FETCH_ROVERS_REJECTED = `${FETCH_ROVERS}_REJECTED`;

// action creators
export const fetchRovers = xhrOptions => ({
  type: FETCH_ROVERS,
  payload: axios.get('/api/v1/rovers/', xhrOptions),
});
