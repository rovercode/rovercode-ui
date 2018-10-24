import AuthApi from '../auth-api';

describe('Auth API', () => {
  let api = null;

  beforeEach(() => {
    api = new AuthApi();
  });

  test('provides user data from token', () => {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTQwMzQzMjIxLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwib3JpZ19pYXQiOjE1NDAzMzk2MjF9.tumcSSAbKeWXc2QDd7KFR9IGh3PCsyHnCe6JLSszWpc';
    api.getCookie = jest.fn(() => token);
    const data = api.userData();

    expect(data.user_id).toBe(1);
    expect(data.username).toBe('admin');
    expect(data.email).toBe('admin@example.com');
    expect(data.exp).toBe(1540343221);
  });

  test('handles invalid token', () => {
    api.getCookie = jest.fn(() => '1234');
    const data = api.userData();

    expect(data).toEqual({});
  });

  test('handles missing token', () => {
    api.getCookie = jest.fn(() => '');
    const data = api.userData();

    expect(data).toEqual({});
  });
});
