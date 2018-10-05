import {
  updateJsCode,
  updateXmlCode,
  changeExecutionState,
  changeName,
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

  test('changeName', () => {
    const action = changeName('test name');
    const { type, payload } = action;

    expect(type).toEqual('CHANGE_NAME');
    expect(payload).toEqual('test name');
  });
});
