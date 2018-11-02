import { updateValidAuth } from '../auth';


describe('Auth actions', () => {
  test('updateValidAuth', () => {
    const action = updateValidAuth(false);
    const { type, payload } = action;

    expect(type).toEqual('UPDATE_VALID_AUTH');
    expect(payload).toEqual(false);
  });
});
