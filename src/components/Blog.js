import React from 'react';
import { Grid } from '@material-ui/core';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

const Blog = ({ questions }) => (
  <Grid container direction="column">
    {
      questions.map((item) => (
        <Grid item key={item.id}>
          {`${item.question}: ${item.answer}`}
        </Grid>
      ))
    }
  </Grid>
);

Blog.defaultProps = {
  questions: [],
};

Blog.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    question: PropTypes.string,
    answer: PropTypes.string,
    sequence_number: PropTypes.number,
    required: PropTypes.bool,
  })),
};

export default hot(module)(Blog);
