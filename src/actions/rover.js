// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const FETCH_ROVERS = 'FETCH_ROVERS';
export const FETCH_ROVERS_FULFILLED = `${FETCH_ROVERS}_FULFILLED`;
export const FETCH_ROVERS_REJECTED = `${FETCH_ROVERS}_REJECTED`;
export const FETCH_ROVER = 'FETCH_ROVER';
export const FETCH_ROVER_FULFILLED = `${FETCH_ROVER}_FULFILLED`;
export const FETCH_ROVER_REJECTED = `${FETCH_ROVER}_REJECTED`;
export const EDIT_ROVER = 'EDIT_ROVER';
export const EDIT_ROVER_FULFILLED = `${EDIT_ROVER}_FULFILLED`;
export const EDIT_ROVER_REJECTED = `${EDIT_ROVER}_REJECTED`;
export const REMOVE_ROVER = 'REMOVE_ROVER';
export const REMOVE_ROVER_FULFILLED = `${REMOVE_ROVER}_FULFILLED`;
export const REMOVE_ROVER_REJECTED = `${REMOVE_ROVER}_REJECTED`;
export const CREATE_ROVER = 'CREATE_ROVER';
export const CREATE_ROVER_FULFILLED = `${CREATE_ROVER}_FULFILLED`;
export const CREATE_ROVER_REJECTED = `${CREATE_ROVER}_REJECTED`;
export const SCAN = 'SCAN';
export const SCAN_FULFILLED = `${SCAN}_FULFILLED`;
export const SCAN_REJECTED = `${SCAN}_REJECTED`;
export const CONNECT_ROVER = 'CONNECT_ROVER';
export const CONNECT_ROVER_FULFILLED = `${CONNECT_ROVER}_FULFILLED`;
export const CONNECT_ROVER_REJECTED = `${CONNECT_ROVER}_REJECTED`;
export const SEND_ROVER = 'SEND_ROVER';
export const SEND_ROVER_FULFILLED = `${SEND_ROVER}_FULFILLED`;
export const SEND_ROVER_REJECTED = `${SEND_ROVER}_REJECTED`;
export const DISCONNECT_ROVER = 'DISCONNECT_ROVER';

const UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const UART_TX_CHARACTERISTIC_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const UART_RX_CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

// action creators
export const fetchRovers = xhrOptions => ({
  type: FETCH_ROVERS,
  payload: axios.get('/api/v1/rovers/', xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const fetchRover = (id, xhrOptions) => ({
  type: FETCH_ROVER,
  payload: axios.get(`/api/v1/rovers/${id}/`, xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const editRover = (id, settings, xhrOptions) => ({
  type: EDIT_ROVER,
  payload: axios.put(`/api/v1/rovers/${id}/`, settings, xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const removeRover = (id, xhrOptions) => ({
  type: REMOVE_ROVER,
  payload: axios.delete(`/api/v1/rovers/${id}/`, xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const createRover = (settings, xhrOptions) => ({
  type: CREATE_ROVER,
  payload: axios.post('/api/v1/rovers/', settings, xhrOptions)
    .then(({ data }) => (
      data
    )),
});

export const scan = () => ({
  type: SCAN,
  payload: navigator.bluetooth.requestDevice({
    filters: [{ namePrefix: 'BBC micro:bit' }],
    optionalServices: [UART_SERVICE_UUID],
  }),
});

export const connect = (device, onMessage) => ({
  type: CONNECT_ROVER,
  payload: device.gatt.connect()
    .then(server => server.getPrimaryService(UART_SERVICE_UUID))
    .then(service => Promise.all([
      service.getCharacteristic(UART_RX_CHARACTERISTIC_UUID),
      service.getCharacteristic(UART_TX_CHARACTERISTIC_UUID)
        .then((characteristic) => {
          characteristic.startNotifications();
          characteristic.addEventListener(
            'characteristicvaluechanged',
            onMessage,
          );
          return characteristic;
        }),
    ])),
});

export const send = (channel, message) => ({
  type: SEND_ROVER,
  payload: channel.writeValue(message),
});

export const disconnect = device => ({
  type: DISCONNECT_ROVER,
  payload: device.gatt.disconnect(),
});
