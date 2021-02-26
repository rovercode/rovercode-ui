import React from 'react';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import { updateValidAuth } from '@/actions/auth';
import Purchase from '../Purchase'; // eslint-disable-line import/order

jest.mock('@/actions/checkout');
jest.mock('@/actions/user');

import { createCheckoutSession } from '@/actions/checkout'; // eslint-disable-line import/first, import/order
import { fetchSubscription } from '@/actions/subscription'; // eslint-disable-line import/first, import/order
import { refreshSession } from '@/actions/user'; // eslint-disable-line import/first, import/order

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The PurchaseContainer', () => {
  const context = { cookies };
  let store;
  let authFailStore;
  let otherFailStore;
  let wrapper;
  beforeEach(() => {
    const defaultState = {};

    const mockStore = configureStore();
    store = mockStore(defaultState);
    store.dispatch = jest.fn().mockResolvedValue();

    const mockAuthFailStore = configureStore();
    const authError = new Error();
    authError.response = {
      status: 401,
    };
    authFailStore = mockAuthFailStore(defaultState);
    authFailStore.dispatch = jest.fn();
    authFailStore.dispatch.mockRejectedValueOnce(authError);
    authFailStore.dispatch.mockResolvedValue();

    const mockOtherFailStore = configureStore();
    const error = new Error();
    error.response = {
      status: 500,
    };
    otherFailStore = mockOtherFailStore(defaultState);
    otherFailStore.dispatch = jest.fn().mockRejectedValue(error);

    wrapper = shallow(<Purchase store={store} />, { context }).dive().dive().dive();
  });

  test('dispatches an action to create checkout session', () => {
    const userId = 1;
    const lineItems = [{ name: 'some plan', quantity: 42 }];
    const successURL = 'someurl.com/success';
    const cancelURL = 'someurl.com/cancel';
    const collectShippingAddress = true;
    wrapper.dive().props().createCheckoutSession(
      userId,
      lineItems,
      successURL,
      cancelURL,
      collectShippingAddress,
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      createCheckoutSession(userId, lineItems, successURL, cancelURL, collectShippingAddress, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );
  });

  test('handles authentication error creating a checkout session', (done) => {
    const userId = 1;
    const lineItems = [{ name: 'some plan', quantity: 42 }];
    const successURL = 'someurl.com/success';
    const cancelURL = 'someurl.com/cancel';
    const collectShippingAddress = true;
    const localWrapper = shallow(
      <Purchase store={authFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().createCheckoutSession(
      userId,
      lineItems,
      successURL,
      cancelURL,
      collectShippingAddress,
    ).then(() => {
      expect(authFailStore.dispatch.mock.calls.length).toBe(2);
      expect(authFailStore.dispatch).toHaveBeenCalledWith(
        createCheckoutSession(userId, lineItems, successURL, cancelURL, collectShippingAddress, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(authFailStore.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles other error editing user username', (done) => {
    const userId = 1;
    const lineItems = [{ name: 'some plan', quantity: 42 }];
    const successURL = 'someurl.com/success';
    const cancelURL = 'someurl.com/cancel';
    const collectShippingAddress = true;
    const localWrapper = shallow(
      <Purchase store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().createCheckoutSession(
      userId,
      lineItems,
      successURL,
      cancelURL,
      collectShippingAddress,
    ).catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
        createCheckoutSession(userId, lineItems, successURL, cancelURL, collectShippingAddress, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });

  test('dispatches an action to fetch subscription', () => {
    const userId = 1;
    wrapper.dive().props().fetchSubscription(userId);

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchSubscription(userId, {
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );
  });

  test('dispatches an action to refresh a session', () => {
    wrapper.dive().props().refreshSession(cookiesValues);

    expect(store.dispatch).toHaveBeenCalledWith(
      refreshSession(cookiesValues.auth_jwt),
    );
  });

  test('handles error fetching subscription', (done) => {
    const userId = 1;
    const localWrapper = shallow(
      <Purchase store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchSubscription(userId).catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
        fetchSubscription(userId, {
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });
});
