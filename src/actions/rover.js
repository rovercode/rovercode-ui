// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const FETCH_ROVERS = 'FETCH_ROVERS';
export const FETCH_ROVERS_FULFILLED = `${FETCH_ROVERS}_FULFILLED`;
export const FETCH_ROVERS_REJECTED = `${FETCH_ROVERS}_REJECTED`;
export const REMOVE_ROVER = 'REMOVE_ROVER';
export const REMOVE_ROVER_FULFILLED = `${REMOVE_ROVER}_FULFILLED`;
export const REMOVE_ROVER_REJECTED = `${REMOVE_ROVER}_REJECTED`;

// action creators
export const fetchRovers = xhrOptions => ({
  type: FETCH_ROVERS,
  payload: axios.get('/api/v1/rovers/', xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const removeRover = (id, xhrOptions) => ({
  type: REMOVE_ROVER,
  payload: axios.delete(`/api/v1/rovers/${id}/`, xhrOptions)
    .then(({ data }) => (
      data
    )),
});
