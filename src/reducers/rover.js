import {
  SCAN_PENDING,
  SCAN_FULFILLED,
  SCAN_REJECTED,
  CONNECT_ROVER_PENDING,
  CONNECT_ROVER_FULFILLED,
  CONNECT_ROVER_REJECTED,
  SEND_ROVER_PENDING,
  SEND_ROVER_FULFILLED,
  SEND_ROVER_REJECTED,
  DISCONNECT_ROVER,
} from '../actions/rover';

export default function rovers(
  state = {
    isScanning: false,
    isConnecting: false,
    isSending: false,
    rover: null,
    error: null,
    transmitChannel: null,
    receiveChannel: null,
  },
  action,
) {
  switch (action.type) {
    case SCAN_PENDING:
      return {
        ...state,
        isScanning: true,
      };
    case SCAN_FULFILLED:
      return {
        ...state,
        isScanning: false,
        error: null,
        rover: action.payload,
      };
    case SCAN_REJECTED:
      return {
        ...state,
        isScanning: false,
        error: action.payload,
      };
    case CONNECT_ROVER_PENDING:
      return {
        ...state,
        isConnecting: true,
      };
    case CONNECT_ROVER_FULFILLED:
      return {
        ...state,
        isConnecting: false,
        error: null,
        receiveChannel: action.payload[1],
        transmitChannel: action.payload[0],
      };
    case CONNECT_ROVER_REJECTED:
      return {
        ...state,
        isConnecting: false,
        error: action.payload,
      };
    case SEND_ROVER_PENDING:
      return {
        ...state,
        isSending: true,
      };
    case SEND_ROVER_FULFILLED:
      return {
        ...state,
        isSending: false,
        error: null,
      };
    case SEND_ROVER_REJECTED:
      return {
        ...state,
        isSending: false,
        error: action.payload,
      };
    case DISCONNECT_ROVER:
      return {
        ...state,
        rover: null,
        receiveChannel: null,
        transmitChannel: null,
        error: null,
      };
    default:
      return state;
  }
}
