import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchSubscription, upgradeSubscription } from '../subscription';

describe('Subscription actions', () => {
  test('fetch subscription', (done) => {
    const mock = new MockAdapter(axios);
    const subscription = {
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

    mock.onGet(`${SUBSCRIPTION_SERVICE}/api/v1/customer/1/`).reply(200, subscription); // eslint-disable-line no-undef

    const action = fetchSubscription(1);
    const { type } = action;
    expect(type).toEqual('FETCH_SUBSCRIPTION');
    action.payload.then((result) => {
      expect(result).toEqual(subscription);
      mock.restore();
      done();
    });
  });

  test('upgrade subscription', (done) => {
    const mock = new MockAdapter(axios);
    const subscription = {
      id: 1,
      subscription: {
        customerId: 'cus_1234',
        interval: 'year',
        plan: '2',
        price: 120.00,
        start: 56789,
      },
    };
    const accessCode = 'abcd';

    mock.onPut(`${SUBSCRIPTION_SERVICE}/api/v1/customer/1/`, { accessCode }).reply(200, subscription); // eslint-disable-line no-undef

    const action = upgradeSubscription(1, accessCode);
    const { type } = action;
    expect(type).toEqual('UPGRADE_SUBSCRIPTION');
    action.payload.then((result) => {
      expect(result).toEqual(subscription);
      mock.restore();
      done();
    });
  });
});
