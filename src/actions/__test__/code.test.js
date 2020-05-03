import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  updateJsCode,
  updateXmlCode,
  changeExecutionState,
  changeName,
  changeId,
  changeReadOnly,
  changeProgramTags,
  fetchProgram,
  saveProgram,
  createProgram,
  clearProgram,
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
      lesson: 2,
    };

    mock.onPut('/api/v1/block-diagrams/1/', {
      name: program.name,
      content: program.content,
      lesson: program.lesson,
    }).reply(200, program);

    const action = saveProgram(1, program.content, program.name, program.lesson);
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

  test('change program tags', async () => {
    const mock = new MockAdapter(axios);
    const program = {
      owner_tags: ['tag1', 'tag2'],
    };

    mock.onPatch('/api/v1/block-diagrams/1/', program).reply(200, program);

    const action = changeProgramTags(1, program.owner_tags);
    const { type } = action;
    const payload = await action.payload;

    expect(type).toEqual('CHANGE_PROGRAM_TAGS');
    expect(payload).toEqual(program);
    mock.restore();
  });

  test('changeReadOnly', () => {
    const action = changeReadOnly(true);
    const { type, payload } = action;

    expect(type).toEqual('CHANGE_READ_ONLY');
    expect(payload).toEqual(true);
  });

  test('clearProgram', () => {
    const action = clearProgram();
    const { type, payload } = action;

    expect(type).toEqual('CLEAR_PROGRAM');
    expect(payload).toBeUndefined();
  });
});
