import reducer from '../rover';
import {
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
  REMOVE_ROVER,
  REMOVE_ROVER_FULFILLED,
  REMOVE_ROVER_REJECTED,
  SCAN,
  SCAN_FULFILLED,
  SCAN_REJECTED,
  CONNECT_ROVER,
  CONNECT_ROVER_FULFILLED,
  CONNECT_ROVER_REJECTED,
  SEND_ROVER,
  SEND_ROVER_FULFILLED,
  SEND_ROVER_REJECTED,
  DISCONNECT_ROVER,
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
      isConnecting: false,
      isScanning: false,
      isSending: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
      receiveChannel: null,
      transmitChannel: null,
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
      isConnecting: false,
      isScanning: false,
      isSending: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
      receiveChannel: null,
      transmitChannel: null,
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
      isConnecting: false,
      isScanning: false,
      isSending: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
      receiveChannel: null,
      transmitChannel: null,
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
      isConnecting: false,
      isScanning: false,
      isSending: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
      receiveChannel: null,
      transmitChannel: null,
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
      isConnecting: false,
      isScanning: false,
      isSending: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
      receiveChannel: null,
      transmitChannel: null,
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

  test('should handle SCAN', () => {
    expect(
      reducer(undefined, {
        type: SCAN,
      }),
    ).toEqual({
      isEditing: false,
      isFetching: false,
      isFetchingSingle: false,
      isRemoving: false,
      isCreating: false,
      isConnecting: false,
      isScanning: true,
      isSending: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
      receiveChannel: null,
      transmitChannel: null,
    });

    const device = {
      name: 'abcde',
    };
    expect(
      reducer({}, {
        type: SCAN_FULFILLED,
        payload: device,
      }),
    ).toEqual({
      rover: device,
      isScanning: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: SCAN_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isScanning: false,
    });
  });

  test('should handle CONNECT_ROVER', () => {
    expect(
      reducer(undefined, {
        type: CONNECT_ROVER,
      }),
    ).toEqual({
      isEditing: false,
      isFetching: false,
      isFetchingSingle: false,
      isRemoving: false,
      isCreating: false,
      isConnecting: true,
      isScanning: false,
      isSending: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
      receiveChannel: null,
      transmitChannel: null,
    });

    const transmitChannel = { name: 'transmit' };
    const receiveChannel = { name: 'receive' };
    const result = [transmitChannel, receiveChannel];
    expect(
      reducer({}, {
        type: CONNECT_ROVER_FULFILLED,
        payload: result,
      }),
    ).toEqual({
      transmitChannel,
      receiveChannel,
      isConnecting: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: CONNECT_ROVER_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isConnecting: false,
    });
  });

  test('should handle SEND_ROVER', () => {
    expect(
      reducer(undefined, {
        type: SEND_ROVER,
      }),
    ).toEqual({
      isEditing: false,
      isFetching: false,
      isFetchingSingle: false,
      isRemoving: false,
      isCreating: false,
      isConnecting: false,
      isScanning: false,
      isSending: true,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
      receiveChannel: null,
      transmitChannel: null,
    });

    expect(
      reducer({}, {
        type: SEND_ROVER_FULFILLED,
      }),
    ).toEqual({
      isSending: false,
      error: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: SEND_ROVER_REJECTED,
        payload: error,
      }),
    ).toEqual({
      error,
      isSending: false,
    });
  });

  test('should handle DISCONNECT_ROVER', () => {
    expect(
      reducer(undefined, {
        type: DISCONNECT_ROVER,
      }),
    ).toEqual({
      isEditing: false,
      isFetching: false,
      isFetchingSingle: false,
      isRemoving: false,
      isCreating: false,
      isConnecting: false,
      isScanning: false,
      isSending: false,
      error: null,
      rovers: null,
      rover: null,
      activeRover: null,
      commands: [],
      receiveChannel: null,
      transmitChannel: null,
    });
  });
});
