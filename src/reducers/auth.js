import { UPDATE_VALID_AUTH } from '../actions/auth';

export default function auth(
  state = {
    isValidAuth: true,
  },
  action,
) {
  switch (action.type) {
    case UPDATE_VALID_AUTH:
      return {
        ...state,
        isValidAuth: action.payload,
      };
    default:
      return state;
  }
}
