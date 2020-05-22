import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { clearPrograms, fetchPrograms, removeProgram } from '../program';


describe('Program actions', () => {
  test('fetch all programs', (done) => {
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
    expect(type).toEqual('FETCH_PROGRAMS');
    action.payload.then((result) => {
      expect(result).toEqual(programs);
      mock.restore();
      done();
    });
  });

  test('remove program', (done) => {
    const mock = new MockAdapter(axios);

    mock.onDelete('/api/v1/block-diagrams/1/').reply(204);

    const action = removeProgram(1);
    const { type } = action;
    expect(type).toEqual('REMOVE_PROGRAM');
    action.payload.then(() => {
      mock.restore();
      done();
    });
  });

  test('clear programs', () => {
    const action = clearPrograms();
    const { type } = action;

    expect(type).toEqual('CLEAR_PROGRAMS');
  });
});
