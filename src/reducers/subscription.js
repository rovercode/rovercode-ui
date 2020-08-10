import {
  FETCH_SUBSCRIPTION_PENDING,
  FETCH_SUBSCRIPTION_FULFILLED,
  FETCH_SUBSCRIPTION_REJECTED,
  UPGRADE_SUBSCRIPTION_PENDING,
  UPGRADE_SUBSCRIPTION_FULFILLED,
  UPGRADE_SUBSCRIPTION_REJECTED,
} from '../actions/subscription';

export default function subscription(
  state = {
    isFetching: false,
    isUpgrading: false,
    fetchError: null,
    upgradeError: null,
    subscription: undefined,
    payment: undefined,
  },
  action,
) {
  switch (action.type) {
    case FETCH_SUBSCRIPTION_PENDING:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_SUBSCRIPTION_FULFILLED:
      return {
        ...state,
        isFetching: false,
        subscription: action.payload.subscription,
        payment: action.payload.payment,
        fetchError: null,
      };
    case FETCH_SUBSCRIPTION_REJECTED:
      return {
        ...state,
        isFetching: false,
        subscription: undefined,
        payment: undefined,
        fetchError: action.payload,
      };
    case UPGRADE_SUBSCRIPTION_PENDING:
      return {
        ...state,
        isUpgrading: true,
      };
    case UPGRADE_SUBSCRIPTION_FULFILLED:
      return {
        ...state,
        isUpgrading: false,
        subscription: action.payload.subscription,
        upgradeError: null,
      };
    case UPGRADE_SUBSCRIPTION_REJECTED:
      return {
        ...state,
        isUpgrading: false,
        upgradeError: action.payload,
      };
    default:
      return state;
  }
}
