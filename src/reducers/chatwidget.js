

import {
  TOGGLE_IN_PROGRESS_STATE,
} from '../actions/chatwidget';

export default function chatwidget(
  state = {
    in_progress: false,
  }, action,
) {
  switch (action.type) {
    case TOGGLE_IN_PROGRESS_STATE:
      return {
        ...state,
        in_progress: !state.in_progress,
      };
    default:
      return state;
  }
}
