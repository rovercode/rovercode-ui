export const TOGGLE_IN_PROGRESS_STATE = 'TOGGLE_IN_PROGRESS_STATE';
export const ADD_TO_CHAT_LOG = 'ADD_TO_CHAT_LOG';
export const SET_CHATTING_WITH = 'SET_CHATTING_WITH';
export const CLOSE_TIPS = 'CLOSE_TIPS';

export const toggleInProgressState = () => ({
  type: TOGGLE_IN_PROGRESS_STATE,
});

export const addToChatLog = message => ({
  type: ADD_TO_CHAT_LOG,
  payload: message,
});

export const setChattingWith = username => ({
  type: SET_CHATTING_WITH,
  payload: username,
});

export const closeTips = () =>({
  type: CLOSE_TIPS
})
