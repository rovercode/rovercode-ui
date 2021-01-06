import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Lock, Person } from '@material-ui/icons';
import {
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {loadStripe} from '@stripe/stripe-js'
import { Alert, Skeleton } from '@material-ui/lab';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';

import PlanClass from '@/components/PlanClass';
import PlanFree from '@/components/PlanFree';
import PlanIndividual from '@/components/PlanIndividual';
import PlanItem from '@/components/PlanItem';

const styles = (theme) => ({
  mainContainer: {
    marginBottom: theme.spacing(8),
    [theme.breakpoints.up('xs')]: {
      minWidth: theme.breakpoints.values.xs,
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: theme.breakpoints.values.sm,
    },
    [theme.breakpoints.up('md')]: {
      minWidth: theme.breakpoints.values.md,
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: theme.breakpoints.values.lg,
    },
  },
  settingsSection: {
    marginBottom: theme.spacing(4),
  },
  title: {
    fontWeight: 'bold',
  },
  titleArea: {
    marginBottom: theme.spacing(4),
  },
});

class Purchase extends Component {
  constructor(props) {
    super(props);

    const { user } = props;
  }

  componentDidMount() {
    const { fetchSubscription, createCheckoutSession, user } = this.props;

    fetchSubscription(user.user_id);
    createCheckoutSession(user.user_id.toString(), [{name: "Individual Plan", quantity: 1}], "https://example.com/success", "https://example.com/cancel", true);
  }

  handleCheckoutClick = () => {
    const { checkoutSessionId } = this.props;
    console.log("Checkout clicked!");
    loadStripe('pk_test_51HFVMDDAGjnnjW0cTIvpN2q1eigGLhpgdu3hI5qwWqfd5LPgDpuvyTCFOIiyV1ink662rRNAIPkvjD1FAf5SJFY400rlIgsZ4P')
      .then((stripe) => { 
        console.log("Stripe loaded!");
        console.log(stripe);
        stripe
          .redirectToCheckout({
            sessionId: checkoutSessionId,
          })
          .then(function(result) {
            console.log(result.error.message);
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
          });
      });
  }

  render() {

    const {
      classes,
      isFetching,
      intl,
      refreshSession,
      subscription,
      upgradeError,
      upgradeSubscription,
      user,
    } = this.props;

    const usernameLabel = intl.formatMessage({
      id: 'app.user_setting.username',
      description: 'Label for username entry',
      defaultMessage: 'Username:',
    });


    return (
      <Container className={classes.mainContainer}>
        <Grid className={classes.settingsSection} container spacing={2}>
          <Grid className={classes.titleArea} item container direction="row" justify="space-between">
            <Grid item>
              <Typography className={classes.title} variant="h4">
                Friends and Family Early Access
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleCheckoutClick}
            >
              <FormattedMessage
                id="app.purchase.checkout"
                description="Button label to checkout purchase"
                defaultMessage="Checkout"
              />
            </Button>
          </Grid>
        </Grid>
        <Grid className={classes.settingsSection} container spacing={2}>
          <Grid item container direction="row" alignItems="flex-start" spacing={1}>
            {
            isFetching ? (
              <>
                <Grid item>
                  <Skeleton animation="wave" width={300} height={200} />
                </Grid>
              </>
            ) : (
              subscription.plan === '3' ? (
                <Typography>
                  Note: Your account already has purchase the Individual Plan.
                </Typography>
              ) : (
                <Typography>
                  -
                </Typography>
              )
            )
          }
          </Grid>
        </Grid>
      </Container>
    );
  }
}

Purchase.defaultProps = {
  checkoutSessionId: null,
  subscription: {
    plan: '',
    price: 0,
    interval: '',
    start: 0,
  },
  upgradeError: null,
};

Purchase.propTypes = {
  checkoutSessionId: PropTypes.string,
  classes: PropTypes.shape({
    mainContainer: PropTypes.string.isRequired,
    settingsSection: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleArea: PropTypes.string.isRequired,
  }).isRequired,
  createCheckoutSession: PropTypes.func.isRequired,
  editUserUsername: PropTypes.func.isRequired,
  editUserPassword: PropTypes.func.isRequired,
  fetchSubscription: PropTypes.func.isRequired,
  refreshSession: PropTypes.func.isRequired,
  upgradeSubscription: PropTypes.func.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  subscription: PropTypes.shape({
    plan: PropTypes.string,
    price: PropTypes.number,
    interval: PropTypes.string,
    start: PropTypes.number,
  }),
  isFetching: PropTypes.bool.isRequired,
  upgradeError: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(withStyles(styles)(Purchase));
