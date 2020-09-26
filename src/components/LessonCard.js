import React from 'react';
import { hot } from 'react-hot-loader';
import {
  Card,
  CardHeader,
  CardActionArea,
  Grid,
  Link,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import { CheckCircle, Lens, Lock } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  inProgress: {
    color: theme.palette.primary.main,
  },
  complete: {
    color: theme.palette.success.main,
  },
  unavailable: {
    color: grey[500],
  },
}));

const LessonCard = ({ lesson, userTier, onClick }) => {
  const classes = useStyles();

  const { progress } = lesson.state || {};
  const unavailable = progress === 'UNAVAILABLE';

  const progressIcon = () => {
    switch (progress) {
      case 'IN_PROGRESS':
        return (<Lens className={classes.inProgress} />);

      case 'COMPLETE':
        return (<CheckCircle className={classes.complete} />);

      default:
        return (null);
    }
  };

  const subheader = () => (
    userTier >= lesson.tier ? (
      lesson.description
    ) : (
      <Grid container direction="row">
        <Grid item xs={2}>
          <Lock fontSize="large" />
        </Grid>
        <Grid item xs={10}>
          <Typography variant="subtitle1">
            <Link href="/user/settings" color="textSecondary" underline="always">
              <FormattedMessage
                id="app.lesson_card.blocked1"
                description="Informs the user that upgrade is required to access"
                defaultMessage="Upgrade"
              />
            </Link>
            {' '}
            <FormattedMessage
              id="app.lesson_card.blocked2"
              description="Informs the user that upgrade is required to access"
              defaultMessage="your account to access this lesson."
            />
          </Typography>
        </Grid>
      </Grid>
    )
  );

  const handleOnClick = (e) => {
    if (userTier >= lesson.tier) {
      onClick(e);
    }
  };

  return (
    <Card className={unavailable ? classes.unavailable : ''}>
      <CardActionArea
        id={lesson.active_bd}
        data-owned={lesson.active_bd_owned}
        onClick={handleOnClick}
        disabled={unavailable}
      >
        <CardHeader
          title={lesson.reference}
          subheader={subheader()}
          action={(
            <SvgIcon>
              {progressIcon()}
            </SvgIcon>
          )}
        />
      </CardActionArea>
    </Card>
  );
};

LessonCard.defaultProps = {
  userTier: 1,
};

LessonCard.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    reference: PropTypes.string.isRequired,
    description: PropTypes.string,
    tier: PropTypes.number,
    active_bd: PropTypes.number.isRequired,
    active_bd_owned: PropTypes.bool.isRequired,
    state: PropTypes.shape({
      progress: PropTypes.string,
    }),
  }).isRequired,
  userTier: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};

export default hot(module)(LessonCard);
