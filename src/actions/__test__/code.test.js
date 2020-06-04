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
  remixProgram,
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

  test('changeName', (done) => {
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
    expect(type).toEqual('CHANGE_NAME');
    action.payload.then((result) => {
      expect(result).toEqual(program);
      mock.restore();
      done();
    });
  });

  test('changeId', () => {
    const action = changeId(123);
    const { type, payload } = action;

    expect(type).toEqual('CHANGE_ID');
    expect(payload).toEqual(123);
  });

  test('fetch program', (done) => {
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
    expect(type).toEqual('FETCH_PROGRAM');
    action.payload.then((result) => {
      expect(result).toEqual(program);
      mock.restore();
      done();
    });
  });

  test('save program', (done) => {
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
    expect(type).toEqual('SAVE_PROGRAM');
    action.payload.then((result) => {
      expect(result).toEqual(program);
      mock.restore();
      done();
    });
  });

  test('create program', (done) => {
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
    expect(type).toEqual('CREATE_PROGRAM');
    action.payload.then((result) => {
      expect(result).toEqual(program);
      mock.restore();
      done();
    });
  });

  test('change program tags', (done) => {
    const mock = new MockAdapter(axios);
    const program = {
      owner_tags: ['tag1', 'tag2'],
    };

    mock.onPatch('/api/v1/block-diagrams/1/', program).reply(200, program);

    const action = changeProgramTags(1, program.owner_tags);
    const { type } = action;
    expect(type).toEqual('CHANGE_PROGRAM_TAGS');
    action.payload.then((result) => {
      expect(result).toEqual(program);
      mock.restore();
      done();
    });
  });

  test('remix program', (done) => {
    const mock = new MockAdapter(axios);
    const program = {
      id: 1,
      name: 'mybd',
      content: '<xml></xml>',
      user: 1,
      lesson: 2,
    };

    mock.onPost('/api/v1/block-diagrams/1/remix/').reply(200, program);

    const action = remixProgram(1);
    const { type } = action;
    expect(type).toEqual('REMIX_PROGRAM');
    action.payload.then((result) => {
      expect(result).toEqual(program);
      mock.restore();
      done();
    });
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
