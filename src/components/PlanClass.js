import React from 'react';
import {
  Grid,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import { CheckCircle, School } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';

const CodeInput = withStyles((theme) => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
}))(TextField);

const LengthDisplay = withStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary,
  },
}))(Typography);

const SuccessIcon = withStyles((theme) => ({
  root: {
    color: theme.palette.success.main,
  },
}))(CheckCircle);

const PlanClass = ({
  active,
  error,
  expires,
  maxLength,
  refreshSession,
  upgradeSubscription,
  userId,
}) => {
  const [length, setLength] = React.useState(0);

  const handleCodeChange = (event) => {
    setLength(event.target.value.length);
    if (event.target.value.length === maxLength) {
      upgradeSubscription(userId, event.target.value).then(refreshSession);
    }
  };

  const generateAdornment = () => {
    if (active) {
      return (
        <InputAdornment position="start">
          <SuccessIcon />
        </InputAdornment>
      );
    }

    if (length === 0) {
      return (null);
    }

    return (
      <LengthDisplay variant="subtitle2">
        {`${length}/${maxLength}`}
      </LengthDisplay>
    );
  };

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      {
        !active ? (
          <>
            <Grid item>
              <Typography variant="subtitle2" align="center">
                <FormattedMessage
                  id="app.plan_class.code1"
                  description="Prompts the user to enter class code"
                  defaultMessage="If you have a class code, enter"
                />
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" align="center">
                <FormattedMessage
                  id="app.plan_class.code2"
                  description="Prompts the user to enter class code"
                  defaultMessage="it below to join your class plan."
                />
              </Typography>
            </Grid>
          </>
        ) : (
          <Grid item>
            <Typography variant="subtitle2" align="center">
              <FormattedMessage
                id="app.plan_class.expires"
                description="Displays the date when the subscription expires"
                defaultMessage="Your class plan expires:"
              />
              {` ${moment.unix(expires).format('M/D/YYYY')}`}
            </Typography>
          </Grid>
        )
      }
      <Grid item>
        <CodeInput
          variant="outlined"
          size="small"
          placeholder="Class Code"
          error={error !== null}
          helperText={error}
          onChange={handleCodeChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <School />
              </InputAdornment>
            ),
            endAdornment: generateAdornment(),
          }}
          inputProps={{ // eslint-disable-line react/jsx-no-duplicate-props
            maxLength,
            readOnly: active,
          }}
        />
      </Grid>
      {
        !active ? (
          <>
            <Grid item>
              <hr />
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" align="center">
                <FormattedMessage
                  id="app.plan_class.contact1"
                  description="Prompts the user to contact for sign up"
                  defaultMessage="Contact us to setup a class plan"
                />
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" align="center">
                <FormattedMessage
                  id="app.plan_class.contact2"
                  description="Prompts the user to contact for sign up"
                  defaultMessage="for your student group."
                />
              </Typography>
            </Grid>
            <Grid item container direction="column" alignItems="center">
              <Grid item>
                <Link href="mailto:sales@rovercode.com" color="secondary">
                  sales@rovercode.com
                </Link>
              </Grid>
            </Grid>
          </>
        ) : (null)
      }
    </Grid>
  );
};

PlanClass.defaultProps = {
  active: false,
  error: null,
  expires: 0,
  maxLength: 8,
};

PlanClass.propTypes = {
  active: PropTypes.bool,
  error: PropTypes.string,
  expires: PropTypes.number,
  maxLength: PropTypes.number,
  refreshSession: PropTypes.func.isRequired,
  upgradeSubscription: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default hot(module)(PlanClass);
