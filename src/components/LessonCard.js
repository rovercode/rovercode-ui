import React from 'react';
import { hot } from 'react-hot-loader';
import {
  Card,
  CardHeader,
  CardActionArea,
  SvgIcon,
} from '@material-ui/core';
import { CheckCircle, Help, Lens } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
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

const LessonCard = ({ lesson, onClick }) => {
  const classes = useStyles();

  const { progress } = lesson.state || {};
  const unavailable = progress === 'UNAVAILABLE';

  const progressIcon = () => {
    switch (progress) {
      case 'AVAILABLE':
      case 'UNAVAILABLE':
        return (null);

      case 'IN_PROGRESS':
        return (<Lens className={classes.inProgress} />);

      case 'COMPLETE':
        return (<CheckCircle className={classes.complete} />);

      default:
        return (<Help />);
    }
  };

  return (
    <Card className={unavailable ? classes.unavailable : ''}>
      <CardActionArea
        id={lesson.active_bd}
        data-owned={lesson.active_bd_owned}
        onClick={onClick}
        disabled={unavailable}
      >
        <CardHeader
          title={lesson.reference}
          subheader={lesson.description}
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

LessonCard.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.number.isRequired,
    reference: PropTypes.string.isRequired,
    description: PropTypes.string,
    active_bd: PropTypes.number.isRequired,
    active_bd_owned: PropTypes.bool.isRequired,
    state: PropTypes.shape({
      progress: PropTypes.string,
    }),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default hot(module)(LessonCard);
