import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@material-ui/core';
import Purchase from '../Purchase';

jest.mock('@stripe/stripe-js');

let fetchSubscription;
let createCheckoutSession;

describe('The Purchase component', () => {
  beforeEach(() => {
    loadStripe.mockClear();
    fetchSubscription = jest.fn().mockResolvedValue();
    createCheckoutSession = jest.fn().mockResolvedValue();
  });

  test('renders on the page with no errors', () => {
    const user = {
      user_id: 1,
    };
    const wrapper = shallowWithIntl(
      <Purchase
        user={user}
        fetchSubscription={fetchSubscription}
        createCheckoutSession={createCheckoutSession}
        isFetching={false}
        isCreating={false}
      />,
    ).dive().dive().dive();
    expect(wrapper).toMatchSnapshot();
  });

  test('shows error message on checkout session creation error', () => {
    const user = {
      user_id: 1,
    };
    const wrapper = shallowWithIntl(
      <Purchase
        user={user}
        fetchSubscription={fetchSubscription}
        createCheckoutSession={createCheckoutSession}
        creationError="Everything went super wrong."
        isFetching={false}
        isCreating={false}
      />,
    ).dive().dive().dive();
    expect(wrapper.find('WithStyles(ForwardRef(Alert))').exists()).toBe(true);
  });

  test('shows circular progress while fetching subscription', () => {
    const user = {
      user_id: 1,
    };
    const wrapper = shallowWithIntl(
      <Purchase
        user={user}
        fetchSubscription={fetchSubscription}
        createCheckoutSession={createCheckoutSession}
        isFetching
        isCreating={false}
      />,
    ).dive().dive().dive();
    expect(wrapper.find('WithStyles(ForwardRef(CircularProgress))').exists()).toBe(true);
  });

  test('shows circular progress while creating session', () => {
    const user = {
      user_id: 1,
    };
    const wrapper = shallowWithIntl(
      <Purchase
        user={user}
        fetchSubscription={fetchSubscription}
        createCheckoutSession={createCheckoutSession}
        isFetching={false}
        isCreating
      />,
    ).dive().dive().dive();
    const button = wrapper.find(Button);
    expect(button.find('WithStyles(ForwardRef(CircularProgress))').exists()).toBe(true);
  });

  test('shows already purchased message when already purchased', () => {
    const user = {
      user_id: 1,
    };
    const subscription = {
      plan: '3',
    };
    const wrapper = shallowWithIntl(
      <Purchase
        user={user}
        fetchSubscription={fetchSubscription}
        createCheckoutSession={createCheckoutSession}
        subscription={subscription}
        isFetching={false}
        isCreating={false}
      />,
    ).dive().dive().dive();
    expect(wrapper.find('FormattedMessage').at(0)
      .prop('defaultMessage'))
      .toEqual(expect.stringContaining('You have already purchased'));
  });

  test('creates a checkout session on button click', () => {
    const user = {
      user_id: 1,
    };
    const wrapper = shallowWithIntl(
      <Purchase
        user={user}
        fetchSubscription={fetchSubscription}
        createCheckoutSession={createCheckoutSession}
        isFetching={false}
        isCreating={false}
      />,
    ).dive().dive().dive();
    wrapper.find(Button).simulate('click');
    expect(createCheckoutSession).toHaveBeenCalled();
  });

  test('redirects to Stripe once the checkout session is created', (done) => {
    const redirectToCheckout = jest.fn();
    loadStripe.mockResolvedValue({ redirectToCheckout });
    const user = {
      user_id: 1,
    };
    const wrapper = shallowWithIntl(
      <Purchase
        user={user}
        fetchSubscription={fetchSubscription}
        createCheckoutSession={createCheckoutSession}
        isCreating={false}
        isFetching={false}
      />,
    ).dive().dive();
    const prevProps = {
      isCreating: true,
    };
    wrapper.dive().instance().componentDidUpdate(prevProps).then(() => {
      expect(redirectToCheckout).toHaveBeenCalled();
      done();
    });
  });

  test('does not redirect to Stripe on other updates', () => {
    const redirectToCheckout = jest.fn();
    loadStripe.mockResolvedValue({ redirectToCheckout });
    const user = {
      user_id: 1,
    };
    const wrapper = shallowWithIntl(
      <Purchase
        user={user}
        fetchSubscription={fetchSubscription}
        createCheckoutSession={createCheckoutSession}
        isCreating={false}
        isFetching={false}
      />,
    ).dive().dive();
    const prevProps = {
      isCreating: false,
    };
    expect(wrapper.dive().instance().componentDidUpdate(prevProps)).toBeNull();
    expect(redirectToCheckout).not.toHaveBeenCalled();
  });
});
