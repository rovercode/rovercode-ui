// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const FETCH_ROVERS = 'FETCH_ROVERS';
export const FETCH_ROVERS_FULFILLED = `${FETCH_ROVERS}_FULFILLED`;
export const FETCH_ROVERS_REJECTED = `${FETCH_ROVERS}_REJECTED`;
export const FETCH_ROVER = 'FETCH_ROVER';
export const FETCH_ROVER_FULFILLED = `${FETCH_ROVER}_FULFILLED`;
export const FETCH_ROVER_REJECTED = `${FETCH_ROVER}_REJECTED`;
export const EDIT_ROVER = 'EDIT_ROVER';
export const EDIT_ROVER_FULFILLED = `${EDIT_ROVER}_FULFILLED`;
export const EDIT_ROVER_REJECTED = `${EDIT_ROVER}_REJECTED`;
export const REMOVE_ROVER = 'REMOVE_ROVER';
export const REMOVE_ROVER_FULFILLED = `${REMOVE_ROVER}_FULFILLED`;
export const REMOVE_ROVER_REJECTED = `${REMOVE_ROVER}_REJECTED`;
export const CREATE_ROVER = 'CREATE_ROVER';
export const CREATE_ROVER_FULFILLED = `${CREATE_ROVER}_FULFILLED`;
export const CREATE_ROVER_REJECTED = `${CREATE_ROVER}_REJECTED`;
export const CHANGE_ACTIVE_ROVER = 'CHANGE_ACTIVE_ROVER';
export const PUSH_COMMAND = 'PUSH_COMMAND';
export const POP_COMMAND = 'POP_COMMAND';

// action creators
export const fetchRovers = xhrOptions => ({
  type: FETCH_ROVERS,
  payload: axios.get('/api/v1/rovers/', xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const fetchRover = (id, xhrOptions) => ({
  type: FETCH_ROVER,
  payload: axios.get(`/api/v1/rovers/${id}/`, xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const editRover = (id, settings, xhrOptions) => ({
  type: EDIT_ROVER,
  payload: axios.put(`/api/v1/rovers/${id}/`, settings, xhrOptions)
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

export const createRover = (settings, xhrOptions) => ({
  type: CREATE_ROVER,
  payload: axios.post('/api/v1/rovers/', settings, xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const changeActiveRover = clientId => ({
  type: CHANGE_ACTIVE_ROVER,
  payload: clientId,
});

export const pushCommand = command => ({
  type: PUSH_COMMAND,
  payload: command,
});

export const popCommand = () => ({
  type: POP_COMMAND,
});
