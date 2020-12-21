import reducer from '../checkout';
import {
  CREATE_CHECKOUT_SESSION_PENDING,
  CREATE_CHECKOUT_SESSION_FULFILLED,
  CREATE_CHECKOUT_SESSION_REJECTED,
} from '../../actions/checkout';

describe('The checkout reducer', () => {
  test('should handle CREATE_CHECKOUT_SESSION', () => {
    expect(
      reducer(undefined, {
        type: CREATE_CHECKOUT_SESSION_PENDING,
      }),
    ).toEqual({
      isCreating: true,
      creationError: null,
      checkoutSessionId: undefined,
    });

    const payload = {
        id: 'cs_test_asdf',
    };
    expect(
      reducer({}, {
        type: CREATE_CHECKOUT_SESSION_FULFILLED,
        payload,
      }),
    ).toEqual({
      isCreating: false,
      checkoutSessionId: 42,
      creationError: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: CREATE_CHECKOUT_SESSION_REJECTED,
        payload: error,
      }),
    ).toEqual({
      creationError: error,
      checkoutSessionId: undefined,
      isCreating: false,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
