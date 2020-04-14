// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

export const CHANGE_LEFT_SENSOR_STATE = 'CHANGE_LEFT_SENSOR_STATE';
export const CHANGE_RIGHT_SENSOR_STATE = 'CHANGE_RIGHT_SENSOR_STATE';

// Sensor States
export const COVERED = 1;
export const NOT_COVERED = 2;

// action creators
export const changeLeftSensorState = (state) => ({
  type: CHANGE_LEFT_SENSOR_STATE,
  payload: state,
});

export const changeRightSensorState = (state) => ({
  type: CHANGE_RIGHT_SENSOR_STATE,
  payload: state,
});
