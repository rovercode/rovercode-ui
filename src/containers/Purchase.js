import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { checkAuthError, authHeader } from '@/actions/auth';
import { fetchSubscription } from '@/actions/subscription';
import { createCheckoutSession } from '@/actions/checkout';
import Purchase from '@/components/Purchase';

const mapStateToProps = ({ checkout, user, subscription }) => (
  { ...checkout, user, ...subscription }
);
const mapDispatchToProps = (dispatch, { cookies }) => ({
  createCheckoutSession: (
    userId, lineItems, successURL, cancelURL, collectShippingAddress,
  ) => dispatch(createCheckoutSession(
    userId, lineItems, successURL, cancelURL, collectShippingAddress, authHeader(cookies),
  )).catch(checkAuthError(dispatch)),
  fetchSubscription: (id) => dispatch(fetchSubscription(id, authHeader(cookies))),
});

const PurchaseContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Purchase);

PurchaseContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(PurchaseContainer));
