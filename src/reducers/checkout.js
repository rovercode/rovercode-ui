import {
  CREATE_CHECKOUT_SESSION_PENDING,
  CREATE_CHECKOUT_SESSION_FULFILLED,
  CREATE_CHECKOUT_SESSION_REJECTED,
} from '../actions/checkout';

export default function subscription(
  state = {
    isCreating: false,
    creationError: null,
    checkoutSessionId: undefined,
  },
  action,
) {
  switch (action.type) {
    case CREATE_CHECKOUT_SESSION_PENDING:
      return {
        ...state,
        isCreating: true,
      };
    case CREATE_CHECKOUT_SESSION_FULFILLED:
      return {
        ...state,
        isCreating: false,
        checkoutSessionId: action.payload.id,
        creationError: null,
      };
    case CREATE_CHECKOUT_SESSION_REJECTED:
      return {
        ...state,
        isCreating: false,
        checkoutSessionId: undefined,
        creationError: action.payload,
      };
    default:
      return state;
  }
}
