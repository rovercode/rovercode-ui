import {
  CHANGE_LEFT_SENSOR_STATE,
  CHANGE_RIGHT_SENSOR_STATE,
  CHANGE_LIGHT_SENSOR_READINGS,
  NOT_COVERED,
} from '../actions/sensor';

export default function sensor(
  state = {
    left: NOT_COVERED,
    right: NOT_COVERED,
    leftLightSensorReading: -1,
    rightLightSensorReading: -1,
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
    default:
      return state;
  }
}
