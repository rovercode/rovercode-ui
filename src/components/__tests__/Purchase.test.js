import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
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
      />,
    ).dive().dive().dive();
    expect(wrapper.find('WithStyles(ForwardRef(Alert))').exists()).toBe(true);
  });

  test('redirects to Stripe once the checkout session is created', () => {
    const mockStripe = jest.fn();
    const redirectToCheckout = jest.fn();
    mockStripe.redirectToCheckout = redirectToCheckout;
    loadStripe.mockImplementation(() => Promise.resolve(mockStripe));
    const user = {
      user_id: 1,
    };
    const wrapper = shallowWithIntl(
      <Purchase
        user={user}
        fetchSubscription={fetchSubscription}
        createCheckoutSession={createCheckoutSession}
      />,
    ).dive().dive();
    wrapper.setProps({
      isCreating: false,
    });
    const prevProps = {
      isCreating: true,
    };
    wrapper.dive().instance().componentDidUpdate(prevProps);
    expect(redirectToCheckout).toHaveBeenCalled();
  });
});
