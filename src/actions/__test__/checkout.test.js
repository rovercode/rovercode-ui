import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createCheckoutSession } from '../checkout';

describe('Checkout actions', () => {
  test('create checkout session', (done) => {
    const mock = new MockAdapter(axios);
    const checkoutSession = {
      id: 1,
    };

    const userId = '42';
    const lineItems = ['price_asdf'];
    const successURL = 'example.com/success';
    const cancelURL = 'example.com/cancel';
    const collectShippingAddress = true;

    mock.onPost(`${SUBSCRIPTION_SERVICE}/api/v1/checkout/start/`, // eslint-disable-line no-undef
      {
        id: userId,
        line_items: lineItems,
        success_url: successURL,
        cancel_url: cancelURL,
        collect_shipping_address: collectShippingAddress,
      })
      .reply(200, checkoutSession); // eslint-disable-line no-undef

    const action = createCheckoutSession(
      userId, lineItems, successURL, cancelURL, collectShippingAddress,
    );
    const { type } = action;
    expect(type).toEqual('CREATE_CHECKOUT_SESSION');
    action.payload.then((result) => {
      expect(result).toEqual(checkoutSession);
      mock.restore();
      done();
    });
  });
});
