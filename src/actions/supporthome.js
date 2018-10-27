import axios from 'axios';

export const FETCH_SUPPORT_REQUESTS = 'FETCH_SUPPORT_REQUESTS';
export const FETCH_SUPPORT_REQUESTS_FULFILLED = `${FETCH_SUPPORT_REQUESTS}_FULFILLED`;
export const FETCH_SUPPORT_REQUESTS_REJECTED = `${FETCH_SUPPORT_REQUESTS}_REJECTED`;
export const ROW_CLICKED = 'ROW CLICKED';
export const TOGGLE_IN_PROGRESS_STATE = 'TOGGLE_IN_PROGRESS_STATE';


export const fetchSupportRequests = (headers, excludeInProgress = false) => ({
  type: FETCH_SUPPORT_REQUESTS,
  payload: axios.get(`/api/v1/support-requests/${excludeInProgress ? '?in_progress=false' : ''}`, { headers })
    .then(({ data }) => (
      data
    )),
});


export const toggleInProgressState = () => ({
  type: TOGGLE_IN_PROGRESS_STATE,
});


export const rowClicked = rowinfo => ({
  type: ROW_CLICKED,
  payload: rowinfo,
});
