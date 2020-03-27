import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  connect,
  createRover,
  disconnect,
  editRover,
  fetchRover,
  fetchRovers,
  removeRover,
  scan,
  send,
} from '../rover';


describe('Rover actions', () => {
  test('fetch rovers', async () => {
    const mock = new MockAdapter(axios);
    const rovers = [{
      id: 1,
      name: 'Mars',
    }];

    mock.onGet('/api/v1/rovers/').reply(200, rovers);

    const action = fetchRovers();
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('FETCH_ROVERS');
    expect(payload).toEqual(rovers);
    mock.restore();
  });

  test('fetch rover', async () => {
    const mock = new MockAdapter(axios);
    const rover = {
      id: 1,
      name: 'Mars',
    };

    mock.onGet('/api/v1/rovers/1/').reply(200, rover);

    const action = fetchRover(1);
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('FETCH_ROVER');
    expect(payload).toEqual(rover);
    mock.restore();
  });

  test('edit rover', async () => {
    const newSettings = {
      name: 'Sparky',
      config: {
        left_eye_port: 1,
        right_eye_port: 2,
        left_motor_port: 3,
        right_motor_port: 4,
      },
    };

    const mock = new MockAdapter(axios);

    mock.onPut('/api/v1/rovers/1/').reply(200, newSettings);

    const action = editRover(1, newSettings);
    const { type } = action;
    await action.payload;

    expect(type).toEqual('EDIT_ROVER');
    mock.restore();
  });

  test('remove rover', async () => {
    const mock = new MockAdapter(axios);

    mock.onDelete('/api/v1/rovers/1/').reply(204);

    const action = removeRover(1);
    const { type } = action;
    await action.payload;

    expect(type).toEqual('REMOVE_ROVER');
    mock.restore();
  });

  test('create rover', async () => {
    const settings = {
      name: 'Sparky',
      config: {
        left_eye_port: 1,
        right_eye_port: 2,
        left_motor_port: 3,
        right_motor_port: 4,
      },
    };

    const mock = new MockAdapter(axios);

    mock.onPost('/api/v1/rovers/').reply(200, settings);

    const action = createRover(settings);
    const { type } = action;
    await action.payload;

    expect(type).toEqual('CREATE_ROVER');
    mock.restore();
  });

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
