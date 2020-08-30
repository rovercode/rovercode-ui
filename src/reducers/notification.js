import { SHOW_NOTIFICATION, CLEAR_NOTIFICATION } from '../actions/notification';

export default function notification(
  state = {
    message: undefined,
    duration: undefined,
    severity: undefined,
  },
  action,
) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        message: action.payload.message,
        duration: action.payload.duration,
        severity: action.payload.severity,
      };
    case CLEAR_NOTIFICATION:
      return {
        ...state,
        message: undefined,
        duration: undefined,
        severity: undefined,
      };
    default:
      return state;
  }
}
