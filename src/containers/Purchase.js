import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies, Cookies } from 'react-cookie';
import { editUserPassword, editUserUsername, refreshSession } from '@/actions/user';
import { checkAuthError, authHeader } from '@/actions/auth';
import { fetchSubscription, upgradeSubscription } from '@/actions/subscription';
import { createCheckoutSession } from '@/actions/checkout';
import Purchase from '@/components/Purchase';

const mapStateToProps = ({ checkout, user, subscription }) => ({ ...checkout, user, ...subscription });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  createCheckoutSession: (userId, lineItems, successURL, cancelURL) => dispatch(
    createCheckoutSession(userId, lineItems, successURL, cancelURL, authHeader(cookies))),
  editUserUsername: (username) => dispatch(editUserUsername(username, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  editUserPassword: (password) => dispatch(editUserPassword(password, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  fetchSubscription: (id) => dispatch(fetchSubscription(id, authHeader(cookies))),
  refreshSession: () => dispatch(refreshSession(cookies)).catch(checkAuthError(dispatch)),
  upgradeSubscription: (id, accessCode) => dispatch(
    upgradeSubscription(id, accessCode, authHeader(cookies)),
  ),
});

const PurchaseContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Purchase);

PurchaseContainer.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default hot(module)(withCookies(PurchaseContainer));
