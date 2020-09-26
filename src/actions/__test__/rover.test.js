import {
  connect,
  disconnect,
  scan,
  send,
} from '../rover';

describe('Rover actions', () => {
  test('rover scan', () => {
    const action = scan();
    const { type, payload } = action;

    expect(type).toEqual('SCAN');
    expect(payload.name).toEqual('Sparky');
  });

  test('connect rover', (done) => {
    const characteristic = {
      startNotifications: jest.fn(),
      addEventListener: jest.fn(),
    };
    const service = {
      getCharacteristic: jest.fn().mockResolvedValue(characteristic),
    };
    const server = {
      getPrimaryService: jest.fn().mockResolvedValue(service),
    };
    const action = connect({ gatt: { connect: jest.fn().mockResolvedValue(server) } });
    const { type } = action;
    expect(type).toEqual('CONNECT_ROVER');
    action.payload.then((result) => {
      expect(result).toEqual([characteristic, characteristic]);
      done();
    });
  });

  test('rover send', (done) => {
    const action = send({ writeValue: jest.fn().mockResolvedValue(null) });
    const { type } = action;
    expect(type).toEqual('SEND_ROVER');
    action.payload.then((result) => {
      expect(result).toEqual(null);
      done();
    });
  });

  test('disconnect rover', () => {
    const action = disconnect({ gatt: { disconnect: jest.fn(() => null) } });
    const { type, payload } = action;

    expect(type).toEqual('DISCONNECT_ROVER');
    expect(payload).toEqual(null);
  });
});
