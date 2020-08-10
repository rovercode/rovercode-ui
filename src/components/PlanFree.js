import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { hot } from 'react-hot-loader';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const PlanFree = ({ freeSlots }) => (
  <Grid container direction="column" justify="center" alignItems="stretch">
    <Grid item>
      <Typography variant="subtitle2" align="center">
        { `${freeSlots} ` }
        <FormattedMessage
          id="app.plan_free.programs"
          description="Label for how many programs allowed"
          defaultMessage="program slots"
        />
      </Typography>
    </Grid>
    <Grid item>
      <Typography variant="subtitle2" align="center">
        <FormattedMessage
          id="app.plan_free.courses"
          description="Indicates a limited access to the courses feature"
          defaultMessage="Limited access to courses"
        />
      </Typography>
    </Grid>
  </Grid>
);

PlanFree.propTypes = {
  freeSlots: PropTypes.number.isRequired,
};

export default hot(module)(PlanFree);
