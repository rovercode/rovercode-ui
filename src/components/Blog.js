import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Link,
  Paper,
  Button,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';

const useStyles = makeStyles({
  cardcontent: {
    '&:last-child': { paddingBottom: 16 },
  },
  markdown: {
    '& p': { marginBottom: 0, marginTop: 0 },
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

const Blog = ({
  questions, saveBlogAnswers, isReadOnly, programID,
}) => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(true);

  const toggleEditMode = () => {
    if (editMode) {
      const answersArr = [];
      const tempArr = [];
      questions.forEach((item) => {
        tempArr.push(item.id);
      });
      tempArr.forEach((item) => {
        answersArr.push({
          id: item,
          answer: document.getElementById(item.toString()).value
            ? document.getElementById(item.toString()).value
            : '',
        });
      });

      saveBlogAnswers(programID, answersArr);
    }
    setEditMode(!editMode);
  };

  const toggleEditModeFocus = () => {
    setEditMode(!editMode);
  };

  const getClass = () => {
    if (!isReadOnly && editMode) {
      return classes.gray;
    }
    return classes.white;
  };

  const getRequiredClass = (required, answer) => {
    if (required && !answer && !isReadOnly) {
      return classes.unfinishedRequired;
    }
    return null;
  };

  function QuestionRender({ answer, required, questionID }) {
    if (!isReadOnly && editMode) {
      return (
        <TextField
          key={questionID.toString()}
          multiline
          rowsmax={4}
          id={questionID.toString()}
          variant="outlined"
          fullWidth
          required={required}
          defaultValue={answer}
        />
      );
    }
    return (
      <CardContent
        onClick={!isReadOnly ? toggleEditModeFocus : null}
        style={!isReadOnly ? { cursor: 'pointer' } : null}
        className={`${getRequiredClass(required, answer)} ${
          classes.cardcontent
        }`}
      >
        {answer ? (
          <ReactMarkdown className={classes.markdown}>{answer}</ReactMarkdown>
        ) : (
          <Typography className={`${getClass()} noAnswer`}>
            No Response
          </Typography>
        )}
      </CardContent>
    );
  }

  return (
    <Grid container direction="column">
      {questions.length === 0 && isReadOnly ? (
        <Typography
          variant="caption"
          style={{ color: 'grey', fontStyle: 'italic' }}
        >
          No Blog Post Available
        </Typography>
      ) : (
        <>
          {!isReadOnly ? (
            <Box mb={2}>
              <Typography
                variant="caption"
                style={{ color: 'grey', fontStyle: 'italic' }}
              >
                *Required
              </Typography>
            </Box>
          ) : null}

          {questions
            .sort((a, b) => a.sequence_number - b.sequence_number)
            .map((item) => (
              <Grid item key={item.id}>
                <Box mb={0.5}>
                  <Typography
                    variant="subtitle2"
                    className={getRequiredClass(item.required, item.answer)}
                  >
                    {item.required ? `${item.question}*` : item.question}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Card
                    variant="outlined"
                    className={`${getClass()} ${getRequiredClass(
                      item.required,
                      item.answer,
                    )} cardroot`}
                  >
                    <QuestionRender
                      programID={programID}
                      answer={item.answer}
                      required={item.required}
                      questionID={item.id}
                    />
                  </Card>
                </Box>
              </Grid>
            ))}
          {!isReadOnly ? (
            <>
              <Box
                mb={2}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Link
                  variant="caption"
                  style={{ color: 'grey', textDecoration: 'underline' }}
                  rel="noopener noreferrer"
                  href="https://commonmark.org/help/"
                  target="_blank"
                >
                  Formatting Tips
                </Link>
                <Button color="primary" onClick={toggleEditMode}>
                  {editMode ? 'Save' : 'Edit'}
                </Button>
              </Box>
              <Paper
                style={{
                  backgroundColor: 'rgba(254,173,17,.25)',
                  borderColor: 'rgba(254,173,17,1)',
                  padding: '16px',
                  marginBottom: '16px',
                }}
                variant="outlined"
                padding={2}
              >
                <Typography variant="body1">
                  Blog Posts may be public, do not share personal information!
                  {' '}
                  <Link
                    style={{ color: 'black', textDecoration: 'underline' }}
                    rel="noopener noreferrer"
                    href="https://docs.rovercode.com/privacy"
                    target="_blank"
                  >
                    Learn more.
                  </Link>
                </Typography>
              </Paper>
            </>
          ) : null}
        </>
      )}
    </Grid>
  );
};

Blog.defaultProps = {
  questions: [],
  isReadOnly: false,
};

Blog.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      question: PropTypes.string,
      answer: PropTypes.string,
      sequence_number: PropTypes.number,
      required: PropTypes.bool,
    }),
  ),
  saveBlogAnswers: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool,
  programID: PropTypes.number.isRequired,
};

export default hot(module)(Blog);
