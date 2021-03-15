import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Box,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import LessonCard from './LessonCard';

const Course = ({ course, userTier, onLessonClick }) => {
  const [accordionExpanded, setAccordionExpanded] = useState(true);

  function accordionChangeState() {
    setAccordionExpanded(!accordionExpanded);
  }

  return (
    <Accordion
      square
      style={{ backgroundColor: 'transparent' }}
      elevation={0}
      defaultExpanded
      onChange={() => {
        accordionChangeState();
      }}
    >
      <AccordionSummary style={{ padding: '0' }}>
        <Box display="flex" justifyContent="space-between" style={{ width: '100%' }}>
          <Box>
            <Typography variant="h3">{course.name}</Typography>
          </Box>
          <Box>
            {accordionExpanded ? (
              <Typography variant="h5" style={{ color: '#7F7272' }}>
                Hide Course
              </Typography>
            ) : (
              <Typography variant="h5" style={{ color: '#7F7272' }}>
                Show Course
              </Typography>
            )}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails style={{ padding: '0' }}>
        <Grid container direction="row" spacing={2}>
          {course.lessons
            .sort((l1, l2) => l1.sequence_number - l2.sequence_number)
            .map((lesson) => (
              <Grid item xs={12} md={6} lg={3} key={lesson.id}>
                <LessonCard lesson={lesson} userTier={userTier} onClick={onLessonClick} />
              </Grid>
            ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

Course.defaultProps = {
  userTier: 1,
};

Course.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    lessons: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        reference: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
  userTier: PropTypes.number,
  onLessonClick: PropTypes.func.isRequired,
};

export default hot(module)(Course);
