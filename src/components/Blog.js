import React from 'react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import {
  Grid, Typography, Card, CardContent, Box, Link, Paper,
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
  true: {
    '&.cardroot': {
      backgroundColor: '#F9F9F9',

    },
    '&.noAnswer': {
      opacity: '70%',
      fontStyle: 'italic',
    },
  },
  false: {
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

const Blog = ({ questions, saveBlogAnswers, isReadOnly }) => {
  const classes = useStyles();
  const getClass = () => {
    if (isReadOnly) {
      return classes.true;
    }
    return classes.false;
  };

  const getRequiredClass = (required, answer) => {
    if (required && !answer && isReadOnly) { // switch isreadyonly before push
      return classes.unfinishedRequired;
    } return null;
  };
  console.log({ questions });
  return (
    <Grid container direction="column">
      { isReadOnly ? (
        <Box mb={2}>
          <Typography variant="caption" style={{ color: 'grey', fontStyle: 'italic' }}>*Required</Typography>
        </Box>
      ) : null }

      {questions.sort((a, b) => a.sequence_number - b.sequence_number)
        .map((item) => (
          <Grid item key={item.id}>
            <Box mb={0.5}>

              <Typography variant="subtitle2" className={getRequiredClass(item.required, item.answer)}>
                { item.required ? `${item.question}*` : item.question }
              </Typography>

            </Box>
            <Box mb={2}>
              <Card variant="outlined" className={`${getClass()} ${getRequiredClass(item.required, item.answer)} cardroot`}>

                <CardContent className={`${getRequiredClass(item.required, item.answer)} ${classes.cardcontent}`}>
                  {
                    item.answer ? (
                      <ReactMarkdown className={classes.markdown}>{item.answer}</ReactMarkdown>
                    ) : (
                      <Typography className={`${getClass()} noAnswer`}> No Response</Typography>
                    )
                  }
                </CardContent>

              </Card>
            </Box>
          </Grid>
        ))}
      { isReadOnly ? ( // switch
        <>
          <Box mb={2}>
            <Link
              variant="caption"
              style={{ color: 'grey', textDecoration: 'underline' }}
              rel="noopener noreferrer"
              href="https://www.instagram.com/_vhub/"
              target="_blank"
            >
              Formatting Tips
            </Link>

          </Box>
          <Paper
            style={{
              backgroundColor: 'rgba(254,173,17,.25)', borderColor: 'rgba(254,173,17,1)', padding: '16px', marginBottom: '16px',
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
                href="https://www.instagram.com/_vhub/"
                target="_blank"
              >

                Learn more.

              </Link>

            </Typography>
          </Paper>

        </>
      ) : null }

    </Grid>
  );
};

Blog.defaultProps = {
  questions: [],
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
};

export default hot(module)(Blog);
