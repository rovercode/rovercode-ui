// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

export const CHANGE_LEFT_SENSOR_STATE = 'CHANGE_LEFT_SENSOR_STATE';
export const CHANGE_RIGHT_SENSOR_STATE = 'CHANGE_RIGHT_SENSOR_STATE';
export const CHANGE_LIGHT_SENSOR_READINGS = 'CHANGE_LIGHT_SENSOR_READINGS';
export const CHANGE_LINE_SENSOR_READINGS = 'CHANGE_LINE_SENSOR_READINGS';
export const CHANGE_BATTERY_VOLTAGE_READING = 'CHANGE_BATTERY_VOLTAGE_READING';

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

export const changeLightSensorReadings = (leftReading, rightReading) => ({
  type: CHANGE_LIGHT_SENSOR_READINGS,
  payload: { leftReading, rightReading },
});

export const changeLineSensorReadings = (leftReading, rightReading) => ({
  type: CHANGE_LINE_SENSOR_READINGS,
  payload: { leftReading, rightReading },
});

export const changeBatteryVoltageReading = (voltageReading) => ({
  type: CHANGE_BATTERY_VOLTAGE_READING,
  payload: voltageReading,
});
