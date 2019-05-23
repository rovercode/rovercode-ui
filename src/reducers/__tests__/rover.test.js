import reducer from '../rover';
import {
  CHANGE_ACTIVE_ROVER,
  CREATE_ROVER,
  CREATE_ROVER_FULFILLED,
  CREATE_ROVER_REJECTED,
  EDIT_ROVER,
  EDIT_ROVER_FULFILLED,
  EDIT_ROVER_REJECTED,
  FETCH_ROVER,
  FETCH_ROVER_FULFILLED,
  FETCH_ROVER_REJECTED,
  FETCH_ROVERS,
  FETCH_ROVERS_FULFILLED,
  FETCH_ROVERS_REJECTED,
  POP_COMMAND,
  PUSH_COMMAND,
  REMOVE_ROVER,
  REMOVE_ROVER_FULFILLED,
  REMOVE_ROVER_REJECTED,
} from '../../actions/rover';

describe('The rover reducer', () => {
  test('should handle FETCH_ROVERS', () => {
    expect(
      reducer(undefined, {
        type: FETCH_ROVERS,
      }),
    ).toEqual({
      isEditing: false,
      isFetching: true,
      isFetchingSingle: false,
      isRemoving: false,
      isCreating: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
    });

    const rovers = [];
    expect(
      reducer({}, {
        type: FETCH_ROVERS_FULFILLED,
        payload: rovers,
      }),
    ).toEqual({
      rovers,
      isFetching: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: FETCH_ROVERS_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isFetching: false,
    });
  });

  test('should handle FETCH_ROVER', () => {
    expect(
      reducer(undefined, {
        type: FETCH_ROVER,
      }),
    ).toEqual({
      isEditing: false,
      isFetching: false,
      isFetchingSingle: true,
      isRemoving: false,
      isCreating: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
    });

    const rover = {
      name: 'Sparky',
    };
    expect(
      reducer({}, {
        type: FETCH_ROVER_FULFILLED,
        payload: rover,
      }),
    ).toEqual({
      rover,
      isFetchingSingle: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: FETCH_ROVER_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isFetchingSingle: false,
    });
  });

  test('should handle EDIT_ROVER', () => {
    expect(
      reducer(undefined, {
        type: EDIT_ROVER,
      }),
    ).toEqual({
      isEditing: true,
      isFetching: false,
      isFetchingSingle: false,
      isRemoving: false,
      isCreating: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
    });

    const rover = {
      name: 'Sparky',
    };
    expect(
      reducer({}, {
        type: EDIT_ROVER_FULFILLED,
        payload: rover,
      }),
    ).toEqual({
      rover,
      isEditing: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: EDIT_ROVER_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isEditing: false,
    });
  });
  test('should handle REMOVE_ROVER', () => {
    expect(
      reducer(undefined, {
        type: REMOVE_ROVER,
      }),
    ).toEqual({
      isEditing: false,
      isFetching: false,
      isFetchingSingle: false,
      isRemoving: true,
      isCreating: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
    });

    expect(
      reducer({}, {
        type: REMOVE_ROVER_FULFILLED,
        payload: null,
      }),
    ).toEqual({
      isRemoving: false,
      rovers: null,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: REMOVE_ROVER_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isRemoving: false,
    });
  });
  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });

  test('should handle CREATE_ROVER', () => {
    expect(
      reducer(undefined, {
        type: CREATE_ROVER,
      }),
    ).toEqual({
      isEditing: false,
      isFetching: false,
      isFetchingSingle: false,
      isRemoving: false,
      isCreating: true,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
    });

    const rover = {
      name: 'Sparky',
      config: {
        left_eye_port: 1,
        right_eye_port: 2,
        left_motor_port: 3,
        right_motor_port: 4,
      },
    };
    expect(
      reducer({}, {
        type: CREATE_ROVER_FULFILLED,
        payload: rover,
      }),
    ).toEqual({
      rover,
      isCreating: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: CREATE_ROVER_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isCreating: false,
    });
  });

  test('should handle CHANGE_ACTIVE_ROVER', () => {
    const activeRover = '1234';
    expect(
      reducer({}, {
        type: CHANGE_ACTIVE_ROVER,
        payload: activeRover,
      }),
    ).toEqual({
      activeRover,
    });
  });

  test('should handle PUSH_COMMAND', () => {
    const initialState = {
      commands: [
        'command1',
        'command2',
      ],
    };
    expect(
      reducer(undefined, {
        type: PUSH_COMMAND,
        payload: 'command3',
      }),
    ).toEqual({
      isEditing: false,
      isFetching: false,
      isFetchingSingle: false,
      isRemoving: false,
      isCreating: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [
        'command3',
      ],
    });
    expect(
      reducer(initialState, {
        type: PUSH_COMMAND,
        payload: 'command3',
      }),
    ).toEqual({
      commands: [
        'command1',
        'command2',
        'command3',
      ],
    });
  });

  test('should handle POP_COMMAND', () => {
    const initialState = {
      commands: [
        'command1',
        'command2',
        'command3',
      ],
    };
    expect(
      reducer(undefined, {
        type: POP_COMMAND,
      }),
    ).toEqual({
      isEditing: false,
      isFetching: false,
      isFetchingSingle: false,
      isRemoving: false,
      isCreating: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
    });
    expect(
      reducer(initialState, {
        type: POP_COMMAND,
      }),
    ).toEqual({
      commands: [
        'command2',
        'command3',
      ],
    });
  });
});
