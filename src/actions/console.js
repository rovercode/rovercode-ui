// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

export const APPEND = 'APPEND';
export const CLEAR = 'CLEAR';

// action creators
export const append = message => ({
  type: APPEND,
  payload: message,
});

export const clear = () => ({
  type: CLEAR,
});
