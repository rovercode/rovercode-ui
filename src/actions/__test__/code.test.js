import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  updateJsCode,
  updateXmlCode,
  changeExecutionState,
  changeName,
  changeId,
  fetchProgram,
  saveProgram,
  createProgram,
  EXECUTION_RUN,
} from '../code';


describe('Code actions', () => {
  test('updateJsCode', () => {
    const action = updateJsCode('test code');
    const { type, payload } = action;

    expect(type).toEqual('UPDATE_JSCODE');
    expect(payload).toEqual('test code');
  });

  test('updateXmlCode', () => {
    const action = updateXmlCode('test code');
    const { type, payload } = action;

    expect(type).toEqual('UPDATE_XMLCODE');
    expect(payload).toEqual('test code');
  });

  test('changeExecutionState', () => {
    const action = changeExecutionState(EXECUTION_RUN);
    const { type, payload } = action;

    expect(type).toEqual('CHANGE_EXECUTION_STATE');
    expect(payload).toEqual(EXECUTION_RUN);
  });

  test('changeName', async () => {
    const mock = new MockAdapter(axios);
    const program = {
      id: 1,
      name: 'test name',
      content: '<xml></xml>',
      user: 1,
    };
    const name = {
      name: 'test name',
    };

    mock.onPatch('/api/v1/block-diagrams/1/', name).reply(200, program);

    const action = changeName(1, 'test name');
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('CHANGE_NAME');
    expect(payload).toEqual(program);

    mock.restore();
  });

  test('changeId', () => {
    const action = changeId(123);
    const { type, payload } = action;

    expect(type).toEqual('CHANGE_ID');
    expect(payload).toEqual(123);
  });

  test('fetch program', async () => {
    const mock = new MockAdapter(axios);
    const program = {
      id: 1,
      name: 'mybd',
      content: '<xml></xml>',
      user: 1,
    };

    mock.onGet('/api/v1/block-diagrams/1/').reply(200, program);

    const action = fetchProgram(1);
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('FETCH_PROGRAM');
    expect(payload).toEqual(program);
    mock.restore();
  });

  test('save program', async () => {
    const mock = new MockAdapter(axios);
    const program = {
      id: 1,
      name: 'mybd',
      content: '<xml></xml>',
      user: 1,
    };

    mock.onPut('/api/v1/block-diagrams/1/', {
      name: program.name,
      content: program.content,
    }).reply(200, program);

    const action = saveProgram(1, program.content, program.name);
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('SAVE_PROGRAM');
    expect(payload).toEqual(program);
    mock.restore();
  });

  test('create program', async () => {
    const mock = new MockAdapter(axios);
    const program = {
      name: 'mybd',
    };

    mock.onPost('/api/v1/block-diagrams/', {
      name: program.name,
      content: '<xml></xml>',
    }).reply(200, program);

    const action = createProgram(program.name);
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('CREATE_PROGRAM');
    expect(payload).toEqual(program);
    mock.restore();
  });
});
