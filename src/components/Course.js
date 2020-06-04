import React from 'react';
import { hot } from 'react-hot-loader';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import PropTypes from 'prop-types';

import LessonCard from './LessonCard';

const Course = ({ course, onLessonClick }) => (
  <ExpansionPanel defaultExpanded>
    <ExpansionPanelSummary expandIcon={<ExpandMore />}>
      <Typography>
        { course.name }
      </Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Grid container direction="row" spacing={2}>
        {
          course.lessons.sort((l1, l2) => l1.sequence_number - l2.sequence_number)
            .map((lesson) => (
              <Grid item xs={12} md={6} lg={3} key={lesson.id}>
                <LessonCard lesson={lesson} onClick={onLessonClick} />
              </Grid>
            ))
        }
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

Course.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    lessons: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  onLessonClick: PropTypes.func.isRequired,
};

export default hot(module)(Course);
