import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';
import { FormattedMessage } from 'react-intl';

const Notification = withStyles((theme) => ({
  root: {
    color: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.main,
    borderStyle: 'solid',
    borderWidth: 'thin',
    borderRadius: '4px',
    padding: theme.spacing(1),
  },
}))(Typography);

const PlanIndividual = () => (
  <Grid container direction="column" justify="center" alignItems="stretch">
    <Grid item>
      <Notification variant="subtitle1" align="center">
        <FormattedMessage
          id="app.plan_individual.coming_soon"
          description="Notifies the user the plan will be available soon"
          defaultMessage="Coming soon"
        />
      </Notification>
    </Grid>
  </Grid>
);

export default hot(module)(PlanIndividual);
