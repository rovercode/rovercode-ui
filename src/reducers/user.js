import { UPDATE_USER } from '../actions/user';

export default function user(
  state = {
    user_id: null,
    username: null,
    email: null,
    exp: null,
  },
  action,
) {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user_id: action.payload.user_id,
        username: action.payload.username,
        email: action.payload.email,
        exp: action.payload.exp,
      };
    default:
      return state;
  }
}
