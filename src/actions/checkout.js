// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const CREATE_CHECKOUT_SESSION = 'CREATE_CHECKOUT_SESSION';
export const CREATE_CHECKOUT_SESSION_PENDING = `${CREATE_CHECKOUT_SESSION}_PENDING`;
export const CREATE_CHECKOUT_SESSION_FULFILLED = `${CREATE_CHECKOUT_SESSION}_FULFILLED`;
export const CREATE_CHECKOUT_SESSION_REJECTED = `${CREATE_CHECKOUT_SESSION}_REJECTED`;

export const createCheckoutSession = (userId, lineItems, successURL, cancelURL, collectShippingAddress, xhrOptions) => ({
  type: CREATE_CHECKOUT_SESSION,
  payload: axios.post(`${SUBSCRIPTION_SERVICE}/api/v1/checkout/start/`, { // eslint-disable-line no-undef
    'id': userId,
    'line_items': lineItems,
    'success_url': successURL,
    'cancel_url': cancelURL,
    'collect_shipping_address': collectShippingAddress,
  }, xhrOptions)
    .then(({ data }) => (
      data
    )),
});