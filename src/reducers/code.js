import {
  CHANGE_EXECUTION_STATE,
  CHANGE_READ_ONLY,
  UPDATE_JSCODE,
  UPDATE_XMLCODE,
  CHANGE_NAME_PENDING,
  CHANGE_NAME_FULFILLED,
  CHANGE_NAME_REJECTED,
  CHANGE_PROGRAM_TAGS_PENDING,
  CHANGE_PROGRAM_TAGS_FULFILLED,
  CHANGE_PROGRAM_TAGS_REJECTED,
  CHANGE_ID,
  FETCH_PROGRAM_PENDING,
  FETCH_PROGRAM_FULFILLED,
  FETCH_PROGRAM_REJECTED,
  SAVE_PROGRAM_PENDING,
  SAVE_PROGRAM_FULFILLED,
  SAVE_PROGRAM_REJECTED,
  CREATE_PROGRAM_PENDING,
  CREATE_PROGRAM_FULFILLED,
  CREATE_PROGRAM_REJECTED,
  FETCH_LESSON_PENDING,
  FETCH_LESSON_FULFILLED,
  FETCH_LESSON_REJECTED,
  CLEAR_LESSON,
  REMIX_PROGRAM_PENDING,
  REMIX_PROGRAM_FULFILLED,
  REMIX_PROGRAM_REJECTED,
  CLEAR_PROGRAM,
} from '../actions/code';

const defaultState = {
  jsCode: null,
  xmlCode: null,
  execution: null,
  name: null,
  id: null,
  tags: [],
  isFetching: false,
  isSaving: false,
  isCreating: false,
  isChangingName: false,
  isChangingProgramTags: false,
  isRemixing: false,
  error: null,
  isReadOnly: false,
  ownerName: null,
  isFetchingLesson: false,
  lessonId: null,
  lessonTutorialLink: null,
  lessonGoals: null,

};

export default function code(
  state = defaultState,
  action,
) {
  switch (action.type) {
    case UPDATE_JSCODE:
      return {
        ...state,
        jsCode: action.payload,
      };
    case UPDATE_XMLCODE:
      return {
        ...state,
        xmlCode: action.payload,
      };
    case CHANGE_EXECUTION_STATE:
      return {
        ...state,
        execution: action.payload,
      };
    case CHANGE_NAME_PENDING:
      return {
        ...state,
        isChangingName: true,
      };
    case CHANGE_NAME_FULFILLED:
      return {
        ...state,
        isChangingName: false,
        name: action.payload.name,
      };
    case CHANGE_NAME_REJECTED:
      return {
        ...state,
        isChangingName: false,
        error: action.payload,
      };
    case CHANGE_PROGRAM_TAGS_PENDING:
      return {
        ...state,
        isChangingProgramTags: true,
      };
    case CHANGE_PROGRAM_TAGS_FULFILLED:
      return {
        ...state,
        isChangingProgramTags: false,
        tags: action.payload.owner_tags,
      };
    case CHANGE_PROGRAM_TAGS_REJECTED:
      return {
        ...state,
        isChangingProgramTags: false,
        error: action.payload,
      };
    case CHANGE_ID:
      return {
        ...state,
        id: action.payload,
      };
    case FETCH_PROGRAM_PENDING:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_PROGRAM_FULFILLED:
      return {
        ...state,
        isFetching: false,
        xmlCode: action.payload.content,
        id: action.payload.id,
        name: action.payload.name,
        tags: action.payload.owner_tags,
        ownerName: action.payload.user.username,
        lessonId: action.payload.lesson,
      };
    case FETCH_PROGRAM_REJECTED:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    case SAVE_PROGRAM_PENDING:
      return {
        ...state,
        isSaving: true,
      };
    case SAVE_PROGRAM_FULFILLED:
      return {
        ...state,
        isSaving: false,
        xmlCode: action.payload.content,
        id: action.payload.id,
        name: action.payload.name,
        lessonId: action.payload.lesson,
      };
    case SAVE_PROGRAM_REJECTED:
      return {
        ...state,
        isSaving: false,
        error: action.payload,
      };
    case CREATE_PROGRAM_PENDING:
      return {
        ...state,
        isCreating: true,
      };
    case CREATE_PROGRAM_FULFILLED:
      return {
        ...state,
        isCreating: false,
        xmlCode: action.payload.content,
        id: action.payload.id,
        name: action.payload.name,
      };
    case CREATE_PROGRAM_REJECTED:
      return {
        ...state,
        isCreating: false,
        error: action.payload,
      };
    case FETCH_LESSON_PENDING:
      return {
        ...state,
        isFetchingLesson: true,
      };
    case FETCH_LESSON_FULFILLED:
      return {
        ...state,
        isFetchingLesson: false,
        lessonTutorialLink: action.payload.tutorial_link,
        lessonGoals: action.payload.goals,
      };
    case FETCH_LESSON_REJECTED:
      return {
        ...state,
        isFetchingLesson: false,
        error: action.payload,
      };
    case CLEAR_LESSON:
      return {
        ...state,
        lessonId: null,
        lessonTutorialLink: null,
        lessonGoals: null,
      };
    case REMIX_PROGRAM_PENDING:
      return {
        ...state,
        isRemixing: true,
      };
    case REMIX_PROGRAM_FULFILLED:
      return {
        ...state,
        isRemixing: false,
        xmlCode: action.payload.content,
        id: action.payload.id,
        name: action.payload.name,
        lessonId: action.payload.lesson,
      };
    case REMIX_PROGRAM_REJECTED:
      return {
        ...state,
        isRemixing: false,
        error: action.payload,
      };
    case CHANGE_READ_ONLY:
      return {
        ...state,
        isReadOnly: action.payload,
      };
    case CLEAR_PROGRAM:
      return defaultState;
    default:
      return state;
  }
}
