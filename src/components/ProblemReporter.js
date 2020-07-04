import React, { Component } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { withCookies } from 'react-cookie';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import { checkAuthError, authHeader } from '@/actions/auth';
import { reportProgram as actionReportProgram } from '@/actions/code';

const mapStateToProps = ({ code }) => ({ code });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  reportProgram: (id, description) => dispatch(
    actionReportProgram(id, description, authHeader(cookies)),
  ).catch(checkAuthError(dispatch)),
});

class ProblemReporter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      attemptText: '',
      expectationText: '',
      resultText: '',
      submitDisabled: false,
    };
  }

  handleOpen = () => {
    this.setState({
      open: true,
      submitDisabled: false,
    });
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  }

  handleAttemptTextChange = (event) => this.setState({ attemptText: event.target.value })

  handleExpectationTextChange = (event) => this.setState({ expectationText: event.target.value })

  handleResultTextChange = (event) => this.setState({ resultText: event.target.value })

  handleSubmit = () => {
    const { code, reportProgram } = this.props;
    const { attemptText, expectationText, resultText } = this.state;

    const description = `
      What were you working on doing?
      ${attemptText}
      --------------
      What did you expect to happen?
      ${expectationText}
      --------------
      What happened instead?
      ${resultText}
    `;
    this.setState({
      submitDisabled: true,
    }, () => reportProgram(code.id, description).then(() => this.setState({ open: false })));
  }

  render() {
    const { children, intl } = this.props;
    const { open, submitDisabled } = this.state;

    const attemptLabel = intl.formatMessage({
      id: 'app.problem_reporter.attempt',
      description: 'Label for text box to describe what user was doing',
      defaultMessage: 'What were you working on doing?',
    });

    const attemptPlaceholder = intl.formatMessage({
      id: 'app.problem_reporter.attempt_placeholder',
      description: 'Placeholder for text box to describe what user was doing',
      defaultMessage: 'I was trying to write code that...',
    });

    const expectationLabel = intl.formatMessage({
      id: 'app.problem_reporter.expectation',
      description: 'Label for text box to describe what user expected',
      defaultMessage: 'What did you expect to happen?',
    });

    const expectationPlaceholder = intl.formatMessage({
      id: 'app.problem_reporter.expectation_placeholder',
      description: 'Placeholder for text box to describe what user expected',
      defaultMessage: 'I expected...',
    });

    const resultLabel = intl.formatMessage({
      id: 'app.problem_reporter.result',
      description: 'Label for text box to describe what resulted',
      defaultMessage: 'What happened instead?',
    });

    const resultPlaceholder = intl.formatMessage({
      id: 'app.problem_reporter.result_placeholder',
      description: 'Placeholder for text box to describe what resulted',
      defaultMessage: 'Instead...',
    });

    return (
      <>
        <Button variant="contained" color="secondary" onClick={this.handleOpen}>
          { children }
        </Button>
        <Dialog maxWidth="md" open={open} onClose={this.handleClose}>
          <DialogContent dividers>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography variant="h4" gutterBottom>
                  <FormattedMessage
                    id="app.problem_reporter.title"
                    description="Title for report modal"
                    defaultMessage="Something not working correctly?"
                  />
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" gutterBottom>
                  <FormattedMessage
                    id="app.problem_reporter.tell_us"
                    description="Instructs user to provide details of the problem"
                    defaultMessage="Tell us about it, and we can try to fix it."
                  />
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="outlined-multiline-static"
                  label={attemptLabel}
                  multiline
                  rows={4}
                  placeholder={attemptPlaceholder}
                  variant="outlined"
                  fullWidth
                  onChange={this.handleAttemptTextChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="outlined-multiline-static"
                  label={expectationLabel}
                  multiline
                  rows={4}
                  placeholder={expectationPlaceholder}
                  variant="outlined"
                  fullWidth
                  onChange={this.handleExpectationTextChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="outlined-multiline-static"
                  label={resultLabel}
                  multiline
                  rows={4}
                  placeholder={resultPlaceholder}
                  variant="outlined"
                  fullWidth
                  onChange={this.handleResultTextChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Typography variant="subtitle2" gutterBottom>
              <FormattedMessage
                id="app.problem_reporter.thank_you"
                description="Thanks the user for providing the information"
                defaultMessage="Thank you so much for reporting this issue.
                We will contact you via the email address on your Rovercode account with our resolution.
                In the meantime, it's possible that you can find how others have worked around this issue
                on the Community Program page."
              />
            </Typography>
            <Button color="primary" variant="contained" onClick={this.handleSubmit} disabled={submitDisabled}>
              <FormattedMessage
                id="app.problem_reporter.submit"
                description="Button label to submit problem"
                defaultMessage="Submit"
              />
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

ProblemReporter.propTypes = {
  code: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(FormattedMessage),
    PropTypes.string,
  ]).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  reportProgram: PropTypes.func.isRequired,
};

export default hot(module)(
  withCookies(injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProblemReporter))),
);
