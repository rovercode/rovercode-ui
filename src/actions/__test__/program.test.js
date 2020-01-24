import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchPrograms, removeProgram } from '../program';


describe('Program actions', () => {
  test('fetch all programs', async () => {
    const mock = new MockAdapter(axios);
    const programs = [{
      id: 33,
      name: 'Unnamed_Design_3',
      content: '<xml><variables></variables></xml>',
      user: 10,
    }];

    mock.onGet('/api/v1/block-diagrams/').reply(200, programs);

    const action = fetchPrograms();
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('FETCH_PROGRAMS');
    expect(payload).toEqual(programs);
    mock.restore();
  });

  test('fetch programs for user', async () => {
    const mock = new MockAdapter(axios);
    const programs = [{
      id: 33,
      name: 'Unnamed_Design_3',
      content: '<xml><variables></variables></xml>',
      user: 10,
    }];

    mock.onGet('/api/v1/block-diagrams/', {
      params: {
        user: 10,
      },
    }).reply(200, programs);

    const action = fetchPrograms({
      params: {
        user: 10,
      },
    });
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('FETCH_USER_PROGRAMS');
    expect(payload).toEqual(programs);
    mock.restore();
  });

  test('fetch featured programs', async () => {
    const mock = new MockAdapter(axios);
    const programs = [{
      id: 33,
      name: 'Unnamed_Design_3',
      content: '<xml><variables></variables></xml>',
      admin_tags: ['featured'],
    }];

    mock.onGet('/api/v1/block-diagrams/', {
      params: {
        admin_tags: ['featured'],
      },
    }).reply(200, programs);

    const action = fetchPrograms({
      params: {
        admin_tags: ['featured'],
      },
    });
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('FETCH_FEATURED_PROGRAMS');
    expect(payload).toEqual(programs);
    mock.restore();
  });

  test('remove program', async () => {
    const mock = new MockAdapter(axios);

    mock.onDelete('/api/v1/block-diagrams/1/').reply(204);

    const action = removeProgram(1);
    const { type } = action;
    await action.payload;

    expect(type).toEqual('REMOVE_PROGRAM');
    mock.restore();
  });
});
