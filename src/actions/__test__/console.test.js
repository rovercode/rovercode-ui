import { append, clear } from '../console';


describe('Console actions', () => {
  test('append', () => {
    const action = append('message');
    const { type, payload } = action;

    expect(type).toEqual('APPEND');
    expect(payload).toEqual('message');
  });

  test('clear', () => {
    const action = clear();
    const { type, payload } = action;

    expect(type).toEqual('CLEAR');
    expect(payload).toBeUndefined();
  });
});
