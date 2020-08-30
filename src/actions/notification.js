// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION';

// action creators
export const showNotification = (message, duration, severity) => ({
  type: SHOW_NOTIFICATION,
  payload: {
    message,
    duration,
    severity,
  },
});

export const clearNotification = () => ({
  type: CLEAR_NOTIFICATION,
});
