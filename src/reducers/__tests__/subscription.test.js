import reducer from '../subscription';
import {
  FETCH_SUBSCRIPTION_PENDING,
  FETCH_SUBSCRIPTION_FULFILLED,
  FETCH_SUBSCRIPTION_REJECTED,
  UPGRADE_SUBSCRIPTION_PENDING,
  UPGRADE_SUBSCRIPTION_FULFILLED,
  UPGRADE_SUBSCRIPTION_REJECTED,
} from '../../actions/subscription';

describe('The subscription reducer', () => {
  test('should handle FETCH_SUBSCRIPTION', () => {
    expect(
      reducer(undefined, {
        type: FETCH_SUBSCRIPTION_PENDING,
      }),
    ).toEqual({
      isFetching: true,
      isUpgrading: false,
      fetchError: null,
      upgradeError: null,
      subscription: undefined,
      payment: undefined,
    });

    const payload = {
      id: 1,
      payment: {
        brand: 'visa',
        created: 123456,
        customerId: 'cus_1234',
        expMonth: 12,
        expYear: 2022,
        last4: '1234',
      },
      subscription: {
        customerId: 'cus_1234',
        interval: 'year',
        plan: '1',
        price: 120.00,
        start: 56789,
      },
    };
    expect(
      reducer({}, {
        type: FETCH_SUBSCRIPTION_FULFILLED,
        payload,
      }),
    ).toEqual({
      isFetching: false,
      payment: {
        brand: 'visa',
        created: 123456,
        customerId: 'cus_1234',
        expMonth: 12,
        expYear: 2022,
        last4: '1234',
      },
      subscription: {
        customerId: 'cus_1234',
        interval: 'year',
        plan: '1',
        price: 120.00,
        start: 56789,
      },
      fetchError: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: FETCH_SUBSCRIPTION_REJECTED,
        payload: error,
      }),
    ).toEqual({
      fetchError: error,
      subscription: undefined,
      payment: undefined,
      isFetching: false,
    });
  });

  test('should handle UPGRADE_SUBSCRIPTION', () => {
    expect(
      reducer(undefined, {
        type: UPGRADE_SUBSCRIPTION_PENDING,
      }),
    ).toEqual({
      isFetching: false,
      isUpgrading: true,
      fetchError: null,
      upgradeError: null,
      subscription: undefined,
      payment: undefined,
    });

    const payload = {
      id: 1,
      subscription: {
        customerId: 'cus_1234',
        interval: 'year',
        plan: '2',
        price: 120.00,
        start: 56789,
      },
    };
    expect(
      reducer({}, {
        type: UPGRADE_SUBSCRIPTION_FULFILLED,
        payload,
      }),
    ).toEqual({
      isUpgrading: false,
      subscription: {
        customerId: 'cus_1234',
        interval: 'year',
        plan: '2',
        price: 120.00,
        start: 56789,
      },
      upgradeError: null,
    });

    const error = 'woops';
    expect(
      reducer({}, {
        type: UPGRADE_SUBSCRIPTION_REJECTED,
        payload: error,
      }),
    ).toEqual({
      upgradeError: error,
      subscription: undefined,
      isUpgrading: false,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});
