import reducer from '../code';
import {
  CHANGE_EXECUTION_STATE,
  EXECUTION_RUN,
  UPDATE_JSCODE,
  UPDATE_XMLCODE,
  CHANGE_NAME_PENDING,
  CHANGE_NAME_FULFILLED,
  CHANGE_NAME_REJECTED,
  CHANGE_PROGRAM_TAGS_PENDING,
  CHANGE_PROGRAM_TAGS_FULFILLED,
  CHANGE_PROGRAM_TAGS_REJECTED,
  CHANGE_ID,
  CHANGE_READ_ONLY,
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
  REPORT_PROGRAM_PENDING,
  REPORT_PROGRAM_FULFILLED,
  REPORT_PROGRAM_REJECTED,
  CLEAR_PROGRAM,
} from '../../actions/code';

describe('The code reducer', () => {
  test('should handle UPDATE_JSCODE', () => {
    expect(
      reducer({}, {
        type: UPDATE_JSCODE,
        payload: 'testcode',
      }),
    ).toEqual({
      jsCode: 'testcode',
    });
  });

  test('should handle UPDATE_XMLCODE', () => {
    expect(
      reducer({}, {
        type: UPDATE_XMLCODE,
        payload: 'testcode',
      }),
    ).toEqual({
      xmlCode: 'testcode',
    });
  });

  test('should handle CHANGE_EXECUTION_STATE', () => {
    expect(
      reducer({}, {
        type: CHANGE_EXECUTION_STATE,
        payload: EXECUTION_RUN,
      }),
    ).toEqual({
      execution: EXECUTION_RUN,
    });
  });

  test('should handle CHANGE_NAME_PENDING', () => {
    expect(
      reducer({}, {
        type: CHANGE_NAME_PENDING,
      }),
    ).toEqual({
      isChangingName: true,
    });
  });

  test('should handle CHANGE_NAME_FULFILLED', () => {
    const name = 'mybd';

    expect(
      reducer({}, {
        type: CHANGE_NAME_FULFILLED,
        payload: {
          name,
        },
      }),
    ).toEqual({
      isChangingName: false,
      name,
    });
  });

  test('should handle CHANGE_NAME_REJECTED', () => {
    const detail = 'Authentication credentials were not provided.';

    expect(
      reducer({}, {
        type: CHANGE_NAME_REJECTED,
        payload: {
          detail,
        },
      }),
    ).toEqual({
      isChangingName: false,
      error: { detail },
    });
  });

  test('should handle CHANGE_PROGRAM_TAGS_PENDING', () => {
    expect(
      reducer({}, {
        type: CHANGE_PROGRAM_TAGS_PENDING,
      }),
    ).toEqual({
      isChangingProgramTags: true,
    });
  });

  test('should handle CHANGE_PROGRAM_TAGS_FULFILLED', () => {
    const tags = ['tag1', 'tag2'];

    expect(
      reducer({}, {
        type: CHANGE_PROGRAM_TAGS_FULFILLED,
        payload: {
          owner_tags: tags,
        },
      }),
    ).toEqual({
      isChangingProgramTags: false,
      tags,
    });
  });

  test('should handle CHANGE_PROGRAM_TAGS_REJECTED', () => {
    const detail = 'Authentication credentials were not provided.';

    expect(
      reducer({}, {
        type: CHANGE_PROGRAM_TAGS_REJECTED,
        payload: {
          detail,
        },
      }),
    ).toEqual({
      isChangingProgramTags: false,
      error: { detail },
    });
  });

  test('should handle CHANGE_ID', () => {
    expect(
      reducer({}, {
        type: CHANGE_ID,
        payload: 123,
      }),
    ).toEqual({
      id: 123,
    });
  });

  test('should handle FETCH_PROGRAM_PENDING', () => {
    expect(
      reducer({}, {
        type: FETCH_PROGRAM_PENDING,
      }),
    ).toEqual({
      isFetching: true,
    });
  });

  test('should handle FETCH_PROGRAM_FULFILLED', () => {
    const name = 'mybd';
    const ownerName = 'phil';
    const id = 1;
    const lessonId = 2;
    const xmlCode = '<xml></xml>';
    const questions = [{
      id: 1,
      question: 'Question1',
      answer: null,
      sequence_number: 2,
      required: true,
    }, {
      id: 2,
      question: 'Question2',
      answer: null,
      sequence_number: 1,
      required: false,
    }, {
      id: 3,
      question: 'Question3',
      answer: 'Answer1',
      sequence_number: 3,
      required: false,
    }];

    expect(
      reducer({}, {
        type: FETCH_PROGRAM_FULFILLED,
        payload: {
          name,
          id,
          user: {
            username: ownerName,
          },
          content: xmlCode,
          lesson: lessonId,
          blog_questions: questions,
        },
      }),
    ).toEqual({
      isFetching: false,
      name,
      id,
      ownerName,
      xmlCode,
      lessonId,
      blog_questions: questions,
    });
  });

  test('should handle FETCH_PROGRAM_REJECTED', () => {
    const detail = 'Authentication credentials were not provided.';

    expect(
      reducer({}, {
        type: FETCH_PROGRAM_REJECTED,
        payload: {
          detail,
        },
      }),
    ).toEqual({
      isFetching: false,
      error: { detail },
    });
  });

  test('should handle SAVE_PROGRAM_PENDING', () => {
    expect(
      reducer({}, {
        type: SAVE_PROGRAM_PENDING,
      }),
    ).toEqual({
      isSaving: true,
    });
  });

  test('should handle SAVE_PROGRAM_FULFILLED where program ID matches state', () => {
    const name = 'mybd';
    const id = 1;
    const xmlCode = '<xml></xml>';
    const lessonId = 2;

    expect(
      reducer({ id: 1 }, {
        type: SAVE_PROGRAM_FULFILLED,
        payload: {
          name,
          id,
          content: xmlCode,
          lesson: lessonId,
        },
      }),
    ).toEqual({
      isSaving: false,
      name,
      id,
      xmlCode,
      lessonId,
    });
  });

  test('should handle SAVE_PROGRAM_FULFILLED where program ID doesn\'t matchstate', () => {
    const name = 'mybd';
    const id = 1;
    const xmlCode = '<xml></xml>';
    const lessonId = 2;

    expect(
      reducer({ id: 7 }, {
        type: SAVE_PROGRAM_FULFILLED,
        payload: {
          name,
          id,
          content: xmlCode,
          lesson: lessonId,
        },
      }),
    ).toEqual({
      id: 7,
      isSaving: false,
    });
  });

  test('should handle SAVE_PROGRAM_REJECTED', () => {
    const detail = 'Authentication credentials were not provided.';

    expect(
      reducer({}, {
        type: SAVE_PROGRAM_REJECTED,
        payload: {
          detail,
        },
      }),
    ).toEqual({
      isSaving: false,
      error: { detail },
    });
  });

  test('should handle CREATE_PROGRAM_PENDING', () => {
    expect(
      reducer({}, {
        type: CREATE_PROGRAM_PENDING,
      }),
    ).toEqual({
      isCreating: true,
    });
  });

  test('should handle CREATE_PROGRAM_FULFILLED', () => {
    const id = 1;
    const name = 'mybd';
    const xmlCode = '<xml></xml>';

    expect(
      reducer({}, {
        type: CREATE_PROGRAM_FULFILLED,
        payload: {
          name,
          id,
          content: xmlCode,
        },
      }),
    ).toEqual({
      isCreating: false,
      name,
      id,
      xmlCode,
    });
  });

  test('should handle CREATE_PROGRAM_REJECTED', () => {
    const detail = 'Authentication credentials were not provided.';

    expect(
      reducer({}, {
        type: CREATE_PROGRAM_REJECTED,
        payload: {
          detail,
        },
      }),
    ).toEqual({
      isCreating: false,
      error: { detail },
    });
  });

  test('should handle FETCH_LESSON_PENDING', () => {
    expect(
      reducer({}, {
        type: FETCH_LESSON_PENDING,
      }),
    ).toEqual({
      isFetchingLesson: true,
    });
  });

  test('should handle FETCH_LESSON_FULFILLED', () => {
    const lessonTutorialLink = 'youtu.be/asdf';
    const lessonGoals = 'to do a thing';

    expect(
      reducer({}, {
        type: FETCH_LESSON_FULFILLED,
        payload: {
          tutorial_link: lessonTutorialLink,
          goals: lessonGoals,
        },
      }),
    ).toEqual({
      isFetchingLesson: false,
      lessonTutorialLink,
      lessonGoals,
    });
  });

  test('should handle FETCH_LESSON_REJECTED', () => {
    const detail = 'Authentication credentials were not provided.';

    expect(
      reducer({}, {
        type: FETCH_LESSON_REJECTED,
        payload: {
          detail,
        },
      }),
    ).toEqual({
      isFetchingLesson: false,
      error: { detail },
    });
  });

  test('should handle CLEAR_LESSON', () => {
    expect(
      reducer({}, {
        type: CLEAR_LESSON,
      }),
    ).toEqual({
      lessonId: null,
      lessonTutorialLink: null,
      lessonGoals: null,
    });
  });

  test('should handle REMIX_PROGRAM_PENDING', () => {
    expect(
      reducer({}, {
        type: REMIX_PROGRAM_PENDING,
      }),
    ).toEqual({
      isRemixing: true,
    });
  });

  test('should handle REMIX_PROGRAM_FULFILLED', () => {
    const name = 'mybd';
    const id = 1;
    const xmlCode = '<xml></xml>';
    const lessonId = 2;

    expect(
      reducer({}, {
        type: REMIX_PROGRAM_FULFILLED,
        payload: {
          name,
          id,
          content: xmlCode,
          lesson: lessonId,
        },
      }),
    ).toEqual({
      isRemixing: false,
      name,
      id,
      xmlCode,
      lessonId,
    });
  });

  test('should handle REMIX_PROGRAM_REJECTED', () => {
    const detail = 'Authentication credentials were not provided.';

    expect(
      reducer({}, {
        type: REMIX_PROGRAM_REJECTED,
        payload: {
          detail,
        },
      }),
    ).toEqual({
      isRemixing: false,
      error: { detail },
    });
  });

  test('should handle REPORT_PROGRAM_PENDING', () => {
    expect(
      reducer({}, {
        type: REPORT_PROGRAM_PENDING,
      }),
    ).toEqual({
      isReporting: true,
    });
  });

  test('should handle REPORT_PROGRAM_FULFILLED', () => {
    expect(
      reducer({}, {
        type: REPORT_PROGRAM_FULFILLED,
      }),
    ).toEqual({
      isReporting: false,
    });
  });

  test('should handle REPORT_PROGRAM_REJECTED', () => {
    const detail = 'Authentication credentials were not provided.';

    expect(
      reducer({}, {
        type: REPORT_PROGRAM_REJECTED,
        payload: {
          detail,
        },
      }),
    ).toEqual({
      isReporting: false,
      error: { detail },
    });
  });

  test('should handle CHANGE_READ_ONLY', () => {
    expect(
      reducer({}, {
        type: CHANGE_READ_ONLY,
        payload: true,
      }),
    ).toEqual({
      isReadOnly: true,
    });
  });

  test('should handle CLEAR_PROGRAM', () => {
    expect(
      reducer({}, {
        type: CLEAR_PROGRAM,
        payload: undefined,
      }),
    ).toEqual({
      jsCode: null,
      xmlCode: null,
      execution: null,
      ownerName: null,
      name: null,
      id: null,
      tags: [],
      isFetching: false,
      isSaving: false,
      isCreating: false,
      isChangingName: false,
      isChangingProgramTags: false,
      isRemixing: false,
      isReporting: false,
      error: null,
      isReadOnly: false,
      isFetchingLesson: false,
      lessonId: null,
      lessonTutorialLink: null,
      lessonGoals: null,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
