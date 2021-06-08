import React from 'react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import {
  Typography,
  CardContent,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  cardcontent: {
    '&:last-child': { paddingBottom: 16 },
  },
  markdown: {
    '& p': { marginBottom: 0, marginTop: 0, overflowWrap: 'anywhere' },
  },
  white: {
    '&.cardroot': {
      backgroundColor: 'white',
    },
    '&.noAnswer': {
      opacity: '70%',
      fontStyle: 'italic',
    },
  },
  gray: {
    '&.cardroot': {
      backgroundColor: '#F9F9F9',
    },
    '&.noAnswer': {
      opacity: '70%',
      fontStyle: 'italic',
    },
  },
  unfinishedRequired: {
    color: 'red',
    '&.cardroot': {
      borderColor: 'red',
    },
  },
});

function QuestionRender({
  answer, required, questionID, isReadOnly, editMode,
  toggleEditMode, getClass, getRequiredClass, blogQuestions,
}) {
  const classes = useStyles();

  const onChangeHandler = (e) => {
    blogQuestions.forEach((item) => {
      if (item.id === parseInt(e.target.id, 10)) {
        item.answer = e.target.value;
      }
    });
  };

  if (!isReadOnly && editMode) {
    return (
      <TextField
        multiline
        rowsmax={4}
        id={questionID.toString()}
        variant="outlined"
        fullWidth
        required={required}
        defaultValue={answer}
        onChange={onChangeHandler}
      />
    );
  }

  return (
    <CardContent
      onClick={!isReadOnly ? toggleEditMode : null}
      style={!isReadOnly ? { cursor: 'pointer' } : null}
      className={`${getRequiredClass(required, answer)} ${
        classes.cardcontent
      }`}
    >
      {
        answer ? (
          <ReactMarkdown className={classes.markdown}>{answer}</ReactMarkdown>
        ) : (
          <Typography className={`${getClass()} noAnswer`}>
            No Response
          </Typography>
        )
      }
    </CardContent>
  );
}
QuestionRender.defaultProps = {
  answer: null,
};
QuestionRender.propTypes = {
  questionID: PropTypes.number.isRequired,
  answer: PropTypes.string,
  required: PropTypes.bool.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  toggleEditMode: PropTypes.func.isRequired,
  getClass: PropTypes.func.isRequired,
  getRequiredClass: PropTypes.func.isRequired,
  blogQuestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      question: PropTypes.string,
      answer: PropTypes.string,
      sequence_number: PropTypes.number,
      required: PropTypes.bool,
    }),
  ).isRequired,

};

export default hot(module)(QuestionRender);
