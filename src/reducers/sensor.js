import {
  CHANGE_LEFT_SENSOR_STATE,
  CHANGE_RIGHT_SENSOR_STATE,
  NOT_COVERED,
} from '../actions/sensor';

export default function sensor(
  state = {
    left: NOT_COVERED,
    right: NOT_COVERED,
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
    default:
      return state;
  }
}
