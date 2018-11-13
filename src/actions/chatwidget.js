export const TOGGLE_IN_PROGRESS_STATE = 'TOGGLE_IN_PROGRESS_STATE';
export const ADD_TO_CHAT_LOG = 'ADD_TO_CHAT_LOG';

export const toggleInProgressState = () =>({
    type: TOGGLE_IN_PROGRESS_STATE,
});


export const addToChatLog = (message) =>({
  type: ADD_TO_CHAT_LOG,
  payload: message,
});