import { updateUser } from '../user';


describe('User actions', () => {
  test('updateUser', () => {
    const user = {
      user_id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      exp: 1540178211,
    };
    const action = updateUser(user);
    const { type, payload } = action;

    expect(type).toEqual('UPDATE_USER');
    expect(payload).toEqual(user);
  });
});
