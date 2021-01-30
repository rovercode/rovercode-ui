import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { loadStripe } from '@stripe/stripe-js';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import gigglebotImage from '@/assets/images/connection-help/gigglebot.png';

const styles = (theme) => ({
  media: {
    height: 0,
    paddingTop: '70%',
  },
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
  card: {
    marginTop: theme.spacing(4),
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
  componentDidMount() {
    const { fetchSubscription, user } = this.props;
    fetchSubscription(user.user_id);
  }

  componentDidUpdate(prevProps) {
    const { isCreating: wasCreatingCheckout } = prevProps;
    const { isCreating: isCreatingCheckout } = this.props;
    if (wasCreatingCheckout && !isCreatingCheckout) {
      return this.redirectToStripe();
    }
    return null;
  }

  redirectToStripe = () => {
    const { checkoutSessionId } = this.props;
    return loadStripe(STRIPE_SHARABLE_KEY) // eslint-disable-line no-undef
      .then((stripe) => {
        stripe
          .redirectToCheckout({
            sessionId: checkoutSessionId,
          });
      });
  }

  handleCheckoutClick = () => {
    const { createCheckoutSession, user } = this.props;
    createCheckoutSession(
      user.user_id.toString(),
      [{ name: 'Individual Plan', quantity: 1 }], // In the future, this is user selectable
      `${window.location.origin}/user/settings`, // Success
      `${window.location.origin}/purchase`, // Failure
      true,
    );
  }

  render() {
    const {
      classes,
      isFetching,
      subscription,
      creationError,
      intl,
    } = this.props;

    const costText = intl.formatMessage({
      id: 'app.friends_family.cost',
      description: 'Price label',
      defaultMessage: '$150.00 billed annually',
    });

    const productTitle = intl.formatMessage({
      id: 'app.friends_family.product_title',
      description: 'Individual plan product title',
      defaultMessage: 'Individual Subscription with Rover',
    });
    

    const checkoutSessionErrorMessage = () => (
      <Grid item>
        <Alert variant="outlined" severity="error">
          <FormattedMessage
            id="app.friends_family.error_message"
            description="Message for an error creating a checkout session"
            defaultMessage="There was an error. Please contact support@rovercode.com to complete your purchase."
          />
        </Alert>
      </Grid>
    );

    const pageContent = () => {
      if (isFetching) {
        return (
          <Grid item xs={12} lg={12}>
            <CircularProgress />
          </Grid>
        );
      }
      if (subscription.plan === '3') {
        return (
          <>
            <Grid item xs={12} lg={12}>
              <Typography>
                <FormattedMessage
                  id="app.friends_family.already_purchased"
                  description="Messages explaining that the user already purchased the Individual Plan"
                  defaultMessage="You have already purchased the Individual Plan for this account"
                />
              </Typography>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/courses"
            >
              <Typography>
                <FormattedMessage
                  id="app.friends_family.already_purchased_action"
                  description="Button giving an action for those who have already purchased"
                  defaultMessage="Start your first lesson!"
                />
              </Typography>
            </Button>
          </>
        );
      }
      return (
        <>
          <Grid item xs={12} lg={12}>
            <Typography variant="subtitle1">
              <FormattedMessage
                id="app.friends_family.instructions"
                description="Paragraph explaining the friends-and-family purchase page"
                defaultMessage="We're excited to offer you early access to Rovercode!
                Shop below, and please email support@rovercode.com with any questions or issues."
              />
            </Typography>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card className={classes.card}>
              <CardHeader title={productTitle} />
              <CardMedia
                className={classes.media}
                image={gigglebotImage}
                title="Gigglebot Rover"
              />
              <CardContent>
                <Typography variant="body2">
                  <FormattedMessage
                    id="app.friends_family.item_description"
                    description="Description of the individual plan"
                    defaultMessage="One year of unlimited access to the Rovercode platform and curriculum.
                    Your first year includes a Gigglebot Rover. If you have a coupon code, you can enter it on the next screen.
                    Your subscription will automatically renew in one year."
                  />
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleCheckoutClick}
                >
                  <FormattedMessage
                    id="app.purchase.checkout"
                    description="Button label to checkout purchase"
                    defaultMessage="Check Out"
                  />
                </Button>
                <Chip label={costText} />
              </CardActions>
            </Card>
          </Grid>
        </>
      );
    };

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
        </Grid>
        <Grid className={classes.settingsSection} container spacing={2}>
          <Grid item container direction="row" alignItems="flex-start" spacing={1}>
            {creationError ? checkoutSessionErrorMessage() : <></> }
            {pageContent()}
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
  },
  creationError: null,
};

Purchase.propTypes = {
  checkoutSessionId: PropTypes.string,
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    mainContainer: PropTypes.string.isRequired,
    media: PropTypes.string.isRequired,
    settingsSection: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleArea: PropTypes.string.isRequired,
  }).isRequired,
  createCheckoutSession: PropTypes.func.isRequired,
  fetchSubscription: PropTypes.func.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
  }).isRequired,
  subscription: PropTypes.shape({
    plan: PropTypes.string,
  }),
  isFetching: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  creationError: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectIntl(withStyles(styles)(Purchase));
