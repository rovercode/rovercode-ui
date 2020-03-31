// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

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
