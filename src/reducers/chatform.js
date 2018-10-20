import {
  CATEGORY_SELECT_CHANGE, BODY_INPUT_CHANGE, EXPERIENCE_SELECT_CHANGE, SUBJECT_INPUT_CHANGE,
} from '../actions/chatform';

export default function chatform(
  state = {
    subjectValue: '',
    bodyValue: '',
    experienceValue: '',
    categoryValue: '',
  }, action,
) {
  switch (action.type) {
    case CATEGORY_SELECT_CHANGE:
      return {
        ...state,
        categoryValue: action.payload,
      };
    case SUBJECT_INPUT_CHANGE:
      return {
        ...state,
        subjectValue: action.payload,
      };
    case BODY_INPUT_CHANGE:
      return {
        ...state,
        bodyValue: action.payload,
      };
    case EXPERIENCE_SELECT_CHANGE:
      return {
        ...state,
        experienceValue: action.payload,
      };
    default:
      return state;
  }
}
