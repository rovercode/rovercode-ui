import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchRovers, removeRover } from '../rover';


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

  test('remove rover', async () => {
    const mock = new MockAdapter(axios);

    mock.onDelete('/api/v1/rovers/1/').reply(204);

    const action = removeRover(1);
    const { type } = action;
    await action.payload;

    expect(type).toEqual('REMOVE_ROVER');
    mock.restore();
  });
});
