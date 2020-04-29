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
    const id = 1;
    const xmlCode = '<xml></xml>';

    expect(
      reducer({}, {
        type: FETCH_PROGRAM_FULFILLED,
        payload: {
          name,
          id,
          content: xmlCode,
        },
      }),
    ).toEqual({
      isFetching: false,
      name,
      id,
      xmlCode,
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

  test('should handle SAVE_PROGRAM_FULFILLED', () => {
    const name = 'mybd';
    const id = 1;
    const xmlCode = '<xml></xml>';
    const lesson = 2;

    expect(
      reducer({}, {
        type: SAVE_PROGRAM_FULFILLED,
        payload: {
          name,
          id,
          content: xmlCode,
          lesson,
        },
      }),
    ).toEqual({
      isSaving: false,
      name,
      id,
      xmlCode,
      lesson,
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
      name: null,
      id: null,
      tags: [],
      isFetching: false,
      isSaving: false,
      isCreating: false,
      isChangingName: false,
      isChangingProgramTags: false,
      error: null,
      isReadOnly: false,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
