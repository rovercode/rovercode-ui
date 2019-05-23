import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  changeActiveRover,
  createRover,
  editRover,
  fetchRover,
  fetchRovers,
  popCommand,
  pushCommand,
  removeRover,
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

  test('change active rover', () => {
    const action = changeActiveRover('1234');
    const { type, payload } = action;

    expect(type).toEqual('CHANGE_ACTIVE_ROVER');
    expect(payload).toEqual('1234');
  });

  test('push command', () => {
    const action = pushCommand('command');
    const { type, payload } = action;

    expect(type).toEqual('PUSH_COMMAND');
    expect(payload).toEqual('command');
  });

  test('pop command', () => {
    const action = popCommand();
    const { type } = action;

    expect(type).toEqual('POP_COMMAND');
  });
});
