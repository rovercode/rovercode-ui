// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const FETCH_TAGS = 'FETCH_TAGS';
export const FETCH_TAGS_PENDING = `${FETCH_TAGS}_PENDING`;
export const FETCH_TAGS_FULFILLED = `${FETCH_TAGS}_FULFILLED`;
export const FETCH_TAGS_REJECTED = `${FETCH_TAGS}_REJECTED`;

// action creators
export const fetchTags = (xhrOptions) => ({
  type: FETCH_TAGS,
  payload: axios.get('/api/v1/tags/', xhrOptions)
    .then(({ data }) => (
      data
    )),
});
