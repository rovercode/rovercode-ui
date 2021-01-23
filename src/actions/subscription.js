// actions https://redux.js.org/basics/actions
// async actions https://redux.js.org/advanced/asyncactions

import axios from 'axios';

export const FETCH_SUBSCRIPTION = 'FETCH_SUBSCRIPTION';
export const FETCH_SUBSCRIPTION_PENDING = `${FETCH_SUBSCRIPTION}_PENDING`;
export const FETCH_SUBSCRIPTION_FULFILLED = `${FETCH_SUBSCRIPTION}_FULFILLED`;
export const FETCH_SUBSCRIPTION_REJECTED = `${FETCH_SUBSCRIPTION}_REJECTED`;
export const UPGRADE_SUBSCRIPTION = 'UPGRADE_SUBSCRIPTION';
export const UPGRADE_SUBSCRIPTION_PENDING = `${UPGRADE_SUBSCRIPTION}_PENDING`;
export const UPGRADE_SUBSCRIPTION_FULFILLED = `${UPGRADE_SUBSCRIPTION}_FULFILLED`;
export const UPGRADE_SUBSCRIPTION_REJECTED = `${UPGRADE_SUBSCRIPTION}_REJECTED`;
export const CREATE_CHECKOUT_SESSION = 'CREATE_CHECKOUT_SESSION';
export const CREATE_CHECKOUT_SESSION_PENDING = `${CREATE_CHECKOUT_SESSION}_PENDING`;
export const CREATE_CHECKOUT_SESSION_FULFILLED = `${CREATE_CHECKOUT_SESSION}_FULFILLED`;
export const CREATE_CHECKOUT_SESSION_REJECTED = `${CREATE_CHECKOUT_SESSION}_REJECTED`;

// action creators
export const fetchSubscription = (id, xhrOptions) => ({
  type: FETCH_SUBSCRIPTION,
  payload: axios.get(`${SUBSCRIPTION_SERVICE}/api/v1/customer/${id}/`, xhrOptions) // eslint-disable-line no-undef
    .then(({ data }) => (
      data
    )),
});

export const upgradeSubscription = (id, accessCode, xhrOptions) => ({
  type: UPGRADE_SUBSCRIPTION,
  payload: axios.put(`${SUBSCRIPTION_SERVICE}/api/v1/customer/${id}/`, { // eslint-disable-line no-undef
    accessCode,
  }, xhrOptions)
    .then(({ data }) => (
      data
    )),
});
