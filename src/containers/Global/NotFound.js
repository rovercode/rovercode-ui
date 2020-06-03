import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

import notFoundImage from '@/assets/images/404.png';

const NotFound = () => (
  <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
    <Grid item>
      <img alt="Not Found" src={notFoundImage} />
    </Grid>
    <Grid item>
      <Typography variant="h4">
        <FormattedMessage
          id="app.global.not_exist"
          description="Notifies the user that the page does not exist"
          defaultMessage="Sorry, the page you're looking for doesn't exist."
        />
      </Typography>
    </Grid>
  </Grid>
);

export default NotFound;
