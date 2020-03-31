import {
  connect,
  disconnect,
  scan,
  send,
} from '../rover';


describe('Rover actions', () => {
  test('rover scan', () => {
    const mockDevice = { name: 'Sparky' };
    const mockBluetooth = {
      requestDevice: jest.fn(() => mockDevice),
    };
    global.navigator.bluetooth = mockBluetooth;
    const action = scan();
    const { type, payload } = action;

    expect(type).toEqual('SCAN');
    expect(payload).toEqual(mockDevice);
  });

  test('connect rover', async () => {
    const characteristic = {
      startNotifications: jest.fn(),
      addEventListener: jest.fn(),
    };
    const service = {
      getCharacteristic: () => Promise.resolve(characteristic),
    };
    const server = {
      getPrimaryService: () => Promise.resolve(service),
    };
    const action = connect({ gatt: { connect: () => Promise.resolve(server) } });
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('CONNECT_ROVER');
    expect(payload).toEqual([characteristic, characteristic]);
  });

  test('rover send', async () => {
    const action = send({ writeValue: () => Promise.resolve(null) });
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('SEND_ROVER');
    expect(payload).toEqual(null);
  });

  test('disconnect rover', () => {
    const action = disconnect({ gatt: { disconnect: jest.fn(() => null) } });
    const { type, payload } = action;

    expect(type).toEqual('DISCONNECT_ROVER');
    expect(payload).toEqual(null);
  });
});
