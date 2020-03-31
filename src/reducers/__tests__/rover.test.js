import reducer from '../rover';
import {
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
  test('should handle SCAN', () => {
    expect(
      reducer(undefined, {
        type: SCAN,
      }),
    ).toEqual({
      isConnecting: false,
      isScanning: true,
      isSending: false,
      error: null,
      rover: null,
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
      isConnecting: true,
      isScanning: false,
      isSending: false,
      error: null,
      rover: null,
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
      isConnecting: false,
      isScanning: false,
      isSending: true,
      error: null,
      rover: null,
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
      isConnecting: false,
      isScanning: false,
      isSending: false,
      error: null,
      rover: null,
      receiveChannel: null,
      transmitChannel: null,
    });
  });
});
