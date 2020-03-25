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
} from '../actions/rover';

export default function rovers(
  state = {
    isFetching: false,
    isFetchingSingle: false,
    isEditing: false,
    isRemoving: false,
    isCreating: false,
    isScanning: false,
    isConnecting: false,
    rovers: null,
    rover: null,
    error: null,
    activeRover: null,
    commands: [],
    transmitChannel: null,
    receiveChannel: null,
  },
  action,
) {
  switch (action.type) {
    case FETCH_ROVERS:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_ROVERS_FULFILLED:
      return {
        ...state,
        isFetching: false,
        rovers: action.payload,
        error: null,
      };
    case FETCH_ROVERS_REJECTED:
      return {
        ...state,
        isFetching: false,
        error: action.payload,
      };
    case FETCH_ROVER:
      return {
        ...state,
        isFetchingSingle: true,
      };
    case FETCH_ROVER_FULFILLED:
      return {
        ...state,
        isFetchingSingle: false,
        rover: action.payload,
        error: null,
      };
    case FETCH_ROVER_REJECTED:
      return {
        ...state,
        isFetchingSingle: false,
        error: action.payload,
      };
    case EDIT_ROVER:
      return {
        ...state,
        isEditing: true,
      };
    case EDIT_ROVER_FULFILLED:
      return {
        ...state,
        isEditing: false,
        rover: action.payload,
        error: null,
      };
    case EDIT_ROVER_REJECTED:
      return {
        ...state,
        isEditing: false,
        error: action.payload,
      };
    case REMOVE_ROVER:
      return {
        ...state,
        isRemoving: true,
      };
    case REMOVE_ROVER_FULFILLED:
      return {
        ...state,
        isRemoving: false,
        rovers: null,
        error: null,
      };
    case REMOVE_ROVER_REJECTED:
      return {
        ...state,
        isRemoving: false,
        error: action.payload,
      };
    case CREATE_ROVER:
      return {
        ...state,
        isCreating: true,
      };
    case CREATE_ROVER_FULFILLED:
      return {
        ...state,
        isCreating: false,
        rover: action.payload,
        error: null,
      };
    case CREATE_ROVER_REJECTED:
      return {
        ...state,
        isCreating: false,
        error: action.payload,
      };
    case CHANGE_ACTIVE_ROVER:
      return {
        ...state,
        activeRover: action.payload,
      };
    case SCAN:
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
    case CONNECT_ROVER:
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
    case SEND_ROVER:
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
