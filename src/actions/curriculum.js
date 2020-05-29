// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const FETCH_COURSES = 'FETCH_COURSES';
export const FETCH_COURSES_PENDING = `${FETCH_COURSES}_PENDING`;
export const FETCH_COURSES_FULFILLED = `${FETCH_COURSES}_FULFILLED`;
export const FETCH_COURSES_REJECTED = `${FETCH_COURSES}_REJECTED`;

// action creators
export const fetchCourses = (xhrOptions) => ({
  type: FETCH_COURSES,
  meta: {
    debounce: {
      time: 500,
    },
  },
  payload: axios.get('/api/v1/courses/', xhrOptions)
    .then(({ data }) => (
      data
    )),
});
