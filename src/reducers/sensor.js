import {
  CHANGE_LEFT_SENSOR_STATE,
  CHANGE_RIGHT_SENSOR_STATE,
  CHANGE_LIGHT_SENSOR_READINGS,
  CHANGE_LINE_SENSOR_READINGS,
  CHANGE_BATTERY_VOLTAGE_READING,
  NOT_COVERED,
} from '../actions/sensor';

export default function sensor(
  state = {
    left: NOT_COVERED,
    right: NOT_COVERED,
    leftLightSensorReading: null,
    rightLightSensorReading: null,
    leftLineSensorReading: null,
    rightLineSensorReading: null,
    batteryVoltageReading: null,
  },
  action,
) {
  switch (action.type) {
    case CHANGE_LEFT_SENSOR_STATE:
      return {
        ...state,
        left: action.payload,
      };
    case CHANGE_RIGHT_SENSOR_STATE:
      return {
        ...state,
        right: action.payload,
      };
    case CHANGE_LIGHT_SENSOR_READINGS:
      return {
        ...state,
        leftLightSensorReading: action.payload.leftReading,
        rightLightSensorReading: action.payload.rightReading,
      };
    case CHANGE_LINE_SENSOR_READINGS:
      return {
        ...state,
        leftLineSensorReading: action.payload.leftReading,
        rightLineSensorReading: action.payload.rightReading,
      };
    case CHANGE_BATTERY_VOLTAGE_READING:
      return {
        ...state,
        batteryVoltageReading: action.payload,
      };
    default:
      return state;
  }
}
