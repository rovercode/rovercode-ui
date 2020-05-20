import React from 'react';
import { hot } from 'react-hot-loader';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Link,
  Typography,
  Container,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="lg" className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Typography variant="body2">
            <FormattedMessage
              id="app.protected_route.conduct_message"
              description="Description and link to inform the user of the location of the Rovercode Code of Conduct"
              defaultMessage="All users must follow the "
            />
            <Link href="https://docs.rovercode.com/conduct/code-of-conduct">
              <FormattedMessage
                id="app.protected_route.conduct_link"
                description="Rovercode Code of Conduct"
                defaultMessage="Rovercode Code of Conduct."
              />
            </Link>
            <FormattedMessage
              id="app.protected_route.inappropriate_message"
              description="Instructions for what a student should do if they experience harassment"
              defaultMessage=" If you see inappropriate behavior or feel you are being harassed, please stop using Rovercode and tell your teacher"
            />
            <FormattedMessage
              id="app.protected_route.teachers_message"
              description="Description and link to inform the teacher of where to report issues"
              defaultMessage=" Teachers, visit "
            />
            <Link href="https://docs.rovercode.com/conduct/report">
              <FormattedMessage
                id="app.protected_route.teachers_link"
                description="Teacher conduct reporting link"
                defaultMessage="this page "
              />
            </Link>
            <FormattedMessage
              id="app.protected_route.teachers_secondmessage"
              description="Teacher conduct reporting link"
              defaultMessage="to report the issue."
            />
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default hot(module)(Footer);
