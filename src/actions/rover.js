// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

const FETCH = 'FETCH';

const ROVERS = 'ROVERS';

const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

const FETCH_ROVERS = `${FETCH}_${ROVERS}`;

// actions
export const FETCH_ROVERS_REQUEST = `${FETCH_ROVERS}_${REQUEST}`;
export const FETCH_ROVERS_SUCCESS = `${FETCH_ROVERS}_${SUCCESS}`;
export const FETCH_ROVERS_FAILURE = `${FETCH_ROVERS}_${FAILURE}`;

// action creators
export const fetchRoversRequest = () => ({
  type: FETCH_ROVERS_REQUEST,
});

export const fetchRoversSuccess = rovers => ({
  type: FETCH_ROVERS_SUCCESS,
  payload: rovers,
});

export const fetchRoversFailure = () => ({
  type: FETCH_ROVERS_FAILURE,
});
