import { showNotification, clearNotification } from '../notification';

describe('Notification actions', () => {
  test('showNotification', () => {
    const action = showNotification('message', 1000, 'info');
    const { type, payload } = action;

    expect(type).toEqual('SHOW_NOTIFICATION');
    expect(payload).toEqual({
      message: 'message',
      duration: 1000,
      severity: 'info',
    });
  });

  test('clearNotification', () => {
    const action = clearNotification();
    const { type, payload } = action;

    expect(type).toEqual('CLEAR_NOTIFICATION');
    expect(payload).toBeUndefined();
  });
});
