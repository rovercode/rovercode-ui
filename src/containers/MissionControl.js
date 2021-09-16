import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  IconButton,
  List,
  ListItem,
  ListSubheader,
  Typography,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import { withCookies } from 'react-cookie';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ExpandMore, Close, OndemandVideo } from '@material-ui/icons';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import Blog from '@/components/Blog';
import CodeViewer from '@/components/CodeViewer';
import Console from '@/components/Console';
import Control from '@/components/Control';
import Indicator from '@/components/Indicator';
import NumericSensorReadout from '@/components/NumericSensorReadout';
import ProgramName from '@/components/ProgramName';
import ProgramTags from '@/components/ProgramTags';
import ProblemReporter from '@/components/ProblemReporter';
import Workspace from '@/components/Workspace';
import { checkAuthError, authHeader } from '@/actions/auth';
import {
  changeReadOnly as actionChangeReadOnly,
  fetchLesson as actionFetchLesson,
  clearLesson as actionClearLesson,
  createProgram as actionCreateProgram,
  fetchProgram as actionFetchProgram,
  remixProgram as actionRemixProgram,
  saveBlogAnswers as actionSaveBlogAnswers,
} from '@/actions/code';

const mapStateToProps = ({ code, sensor, user }) => ({ code, sensor, user });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  changeReadOnly: (isReadOnly) => dispatch(actionChangeReadOnly(isReadOnly)),
  remixProgram: (id) => dispatch(actionRemixProgram(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  fetchLesson: (id) => dispatch(actionFetchLesson(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  clearLesson: () => dispatch(actionClearLesson()),
  fetchProgram: (id) => dispatch(actionFetchProgram(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  createProgram: (name) => dispatch(actionCreateProgram(name, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  saveBlogAnswers: (id, answers) => dispatch(
    actionSaveBlogAnswers(id, answers, authHeader(cookies)),
  ).catch(checkAuthError(dispatch)),
});

class MissionControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      programCreated: null,
      programLoaded: false,
    };
  }

  componentDidMount() {
    const {
      changeReadOnly,
      createProgram,
      fetchProgram,
      fetchLesson,
      clearLesson,
      match,
      user,
    } = this.props;

    if (match && match.params && match.params.id) {
      fetchProgram(match.params.id).then((result) => {
        changeReadOnly(user.username !== result.value.user.username);
        this.setState({
          programLoaded: true,
        });
        if (result.value.lesson) {
          fetchLesson(result.value.lesson);
        } else {
          clearLesson();
        }
      });
    } else {
      // No program already loaded, create a new one
      clearLesson();
      const number = (Math.floor(Math.random() * 1000));
      createProgram(`Unnamed_Design_${number}`).then((result) => {
        changeReadOnly(false);
        this.setState({
          programCreated: result.value.id,
          programLoaded: true,
        });
      });
    }
  }

  handleOnClose = () => this.setState({ open: false });

  remix = () => {
    const {
      changeReadOnly,
      code,
      remixProgram,
      fetchLesson,
      history,
    } = this.props;

    return remixProgram(code.id).then(() => {
      const { code: newCode } = this.props;

      if (newCode.lessonId) {
        fetchLesson(newCode.lessonId);
      }
      history.push(`${newCode.id}`);
      changeReadOnly(false);
    });
  }

  render() {
    const {
      intl,
      location,
      code,
      sensor,
      user,
      saveBlogAnswers,
    } = this.props;

    const {
      open,
      programCreated,
      programLoaded,
    } = this.state;

    const goalLabel = intl.formatMessage({
      id: 'app.mission_control.goal_label',
      description: 'Label for the lesson\'s goal',
      defaultMessage: 'Goal',
    });

    const readOnlyTitle = intl.formatMessage({
      id: 'app.mission_control.program_owner',
      description: 'Label when naming program\'s author',
      defaultMessage: 'This program is by ',
    });

    const batteryTitle = intl.formatMessage({
      id: 'app.mission_control.battery',
      description: 'Describes the battery sensor section',
      defaultMessage: 'Battery',
    });

    const distanceSensorTitle = intl.formatMessage({
      id: 'app.mission_control.distance_sensor',
      description: 'Describes the distance sensor section',
      defaultMessage: 'Distance Sensor',
    });

    const lightSensorsTitle = intl.formatMessage({
      id: 'app.mission_control.light_sensors',
      description: 'Describes the light sensors section',
      defaultMessage: 'Light Sensors',
    });

    const lineSensorsTitle = intl.formatMessage({
      id: 'app.mission_control.line_sensors',
      description: 'Describes the line sensors section',
      defaultMessage: 'Line Sensors',
    });

    const unitsLabel = intl.formatMessage({
      id: 'app.mission_control.units',
      description: 'Describes a value in units',
      defaultMessage: 'units',
    });

    const milliVoltsLabel = intl.formatMessage({
      id: 'app.mission_control.milliVolts',
      description: 'The unit milliVolts',
      defaultMessage: 'milliVolts',
    });

    const centimetersLabel = intl.formatMessage({
      id: 'app.mission_control.centimeters',
      description: 'The unit centimeters',
      defaultMessage: 'cm',
    });

    const leftLabel = intl.formatMessage({
      id: 'app.mission_control.left',
      description: 'Labels the left sensor reading',
      defaultMessage: 'Left',
    });

    const rightLabel = intl.formatMessage({
      id: 'app.mission_control.right',
      description: 'Labels the right sensor reading',
      defaultMessage: 'Right',
    });

    const voltageLabel = intl.formatMessage({
      id: 'app.mission_control.voltage',
      description: 'Labels the voltage reading',
      defaultMessage: 'Voltage',
    });

    const distanceLabel = intl.formatMessage({
      id: 'app.mission_control.distance',
      description: 'Labels the distance reading',
      defaultMessage: 'Distance',
    });

    const WideBox = withStyles(() => ({
      root: {
        width: '100%',
      },
    }))(Box);

    const GoalText = withStyles((theme) => ({
      root: {
        color: theme.palette.text.secondary,
      },
    }))(Typography);

    const lightSensorReadings = [
      {
        label: leftLabel,
        reading: sensor.leftLightSensorReading,
        maxReading: 1023,
      },
      {
        label: rightLabel,
        reading: sensor.rightLightSensorReading,
        maxReading: 1023,
      },
    ];

    const lineSensorReadings = [
      {
        label: leftLabel,
        reading: sensor.leftLineSensorReading,
        maxReading: 1023,
      },
      {
        label: rightLabel,
        reading: sensor.rightLineSensorReading,
        maxReading: 1023,
      },
    ];

    const distanceSensorReading = [
      {
        label: distanceLabel,
        reading: sensor.distanceSensorReading,
        maxReading: 500,
      },
    ];

    const batteryVoltageReading = [
      {
        label: voltageLabel,
        reading: sensor.batteryVoltageReading,
        maxReading: 4500,
      },
    ];

    let programCount = -2;
    let programLimit = -1;
    if (user.stats && user.stats.block_diagram) {
      programCount = user.stats.block_diagram.count;
      programLimit = user.stats.block_diagram.limit;
    }

    return (
      <>
        <Drawer anchor="left" open={open} onClose={this.handleOnClose}>
          <List
            subheader={(
              <ListSubheader component="div" id="nested-list-subheader">
                <Grid container direction="row" justify="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="h6">
                      <FormattedMessage
                        id="app.mission_control.details"
                        description="Header for project details"
                        defaultMessage="Project Details"
                      />
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton onClick={this.handleOnClose}>
                      <Close />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListSubheader>
            )}
          >
            <Divider />
            <ListItem>
              <ProgramName location={location} />
            </ListItem>
            <ListItem>
              <ProgramTags />
            </ListItem>
          </List>
        </Drawer>

        <Grid container direction="row" justify="space-evenly" alignItems="flex-start" spacing={0}>
          <Grid item container xs={10} direction="column" justify="center" alignItems="stretch" spacing={2}>
            <Grid item container direction="row" justify="space-between">
              <Grid item>
                <Box>
                  <Typography variant="h6">
                    {code.name}
                  </Typography>
                </Box>
              </Grid>
              {
                code.lessonGoals ? (
                  <Grid item>
                    <Box>
                      <GoalText variant="h6">
                        {`${goalLabel}: ${code.lessonGoals}`}
                      </GoalText>
                    </Box>
                  </Grid>
                ) : null
              }
              {
                code.lessonTutorialLink ? (
                  <Grid item>
                    <Box>
                      <Button
                        color="primary"
                        variant="outlined"
                        startIcon={<OndemandVideo />}
                        href={code.lessonTutorialLink}
                        target="_blank"
                        rel="noopener"
                      >
                        Tutorial
                      </Button>
                    </Box>
                  </Grid>
                ) : null
              }
              {
                code.isReadOnly ? (
                  <Grid item>
                    <Box m={0}>
                      <Alert
                        severity="info"
                        action={(
                          <Button color="primary" variant="contained" size="large" onClick={this.remix} disabled={user.tier === 1 && programCount >= programLimit}>
                            <FormattedMessage
                              id="app.mission_control.remix"
                              description="Button label to copy other user's program for this user to edit"
                              defaultMessage="Remix"
                            />
                          </Button>
                        )}
                      >
                        <AlertTitle>
                          {`${readOnlyTitle} ${code.ownerName}.`}
                        </AlertTitle>
                        <FormattedMessage
                          id="app.mission_control.read_only_content"
                          description="Informs the user that this program is another user's and cannot be edited"
                          defaultMessage="Remix it to make your own copy."
                        />
                      </Alert>
                    </Box>
                  </Grid>
                ) : (null)
              }
              <Grid item>
                <Button color="default" onClick={() => this.setState({ open: true })}>
                  {
                    code.isReadOnly ? (
                      <FormattedMessage
                        id="app.mission_control.view_details"
                        description="Button to view the project details"
                        defaultMessage="View Project Details"
                      />
                    ) : (
                      <FormattedMessage
                        id="app.mission_control.edit_details"
                        description="Button to edit the project details"
                        defaultMessage="Edit Project Details"
                      />
                    )
                  }
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              {
                programLoaded ? (
                  <Workspace location={location}>
                    <Control />
                  </Workspace>
                ) : (
                  <Grid container direction="row" alignItems="center" justify="center">
                    <CircularProgress color="secondary" />
                  </Grid>
                )
              }
            </Grid>
          </Grid>
          <Grid item container xs={2} direction="column" alignItems="stretch" spacing={2}>
            <Grid item>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>
                    <FormattedMessage
                      id="app.mission_control.sensors"
                      description="Header for list of the user's sensors"
                      defaultMessage="Sensors"
                    />
                  </Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                  <Typography>
                    <FormattedMessage
                      id="app.mission_control.buttons"
                      description="Describes the buttons sensor section"
                      defaultMessage="Buttons"
                    />
                  </Typography>
                </AccordionDetails>
                <AccordionDetails>
                  <WideBox p={2} border={1} borderRadius="borderRadius" borderColor="grey.500">
                    <Indicator />
                  </WideBox>
                </AccordionDetails>
                <Divider />
                <NumericSensorReadout
                  title={lightSensorsTitle}
                  readings={lightSensorReadings}
                  unit={unitsLabel}
                />
                <Divider />
                <NumericSensorReadout
                  title={lineSensorsTitle}
                  readings={lineSensorReadings}
                  unit={unitsLabel}
                />
                <Divider />
                <NumericSensorReadout
                  title={distanceSensorTitle}
                  readings={distanceSensorReading}
                  unit={centimetersLabel}
                />
                <Divider />
                <NumericSensorReadout
                  title={batteryTitle}
                  readings={batteryVoltageReading}
                  unit={milliVoltsLabel}
                />
              </Accordion>
            </Grid>
            <Grid item>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>
                    <FormattedMessage
                      id="app.mission_control.console"
                      description="Header for debug console"
                      defaultMessage="Debug Console"
                    />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Console />
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>
                    <FormattedMessage
                      id="app.mission_control.blog"
                      description="Header for blog"
                      defaultMessage="Blog Post"
                    />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Blog
                    questions={code.blog_questions}
                    isReadOnly={code.isReadOnly}
                    saveBlogAnswers={saveBlogAnswers}
                    programID={code.id}
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item>
              <CodeViewer>
                <FormattedMessage
                  id="app.mission_control.show_code"
                  description="Button label for displaying user's code"
                  defaultMessage="View JavaScript"
                />
              </CodeViewer>
            </Grid>
            <Grid item>
              <ProblemReporter>
                <FormattedMessage
                  id="app.mission_control.report_problem"
                  description="Button label for displaying modal to report a problem with a program"
                  defaultMessage="Problem?"
                />
              </ProblemReporter>
            </Grid>
          </Grid>
        </Grid>
        {
          programCreated ? (
            <Redirect to={{
              pathname: `/mission-control/${programCreated}`,
            }}
            />
          ) : (null)
        }
      </>
    );
  }
}

MissionControl.defaultProps = {
  location: {
    state: {
      readOnly: false,
    },
  },
};

MissionControl.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      readOnly: PropTypes.bool,
    }),
  }),
  code: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    isReadOnly: PropTypes.bool,
    ownerName: PropTypes.string,
    lessonId: PropTypes.number,
    lessonTutorialLink: PropTypes.string,
    lessonGoals: PropTypes.string,
    blog_questions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      question: PropTypes.string,
      answer: PropTypes.string,
      sequence_number: PropTypes.number,
      required: PropTypes.bool,
    })),
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    stats: PropTypes.shape({
      block_diagram: PropTypes.shape({
        count: PropTypes.number,
        limit: PropTypes.number,
      }),
    }),
    tier: PropTypes.number,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  sensor: PropTypes.shape({
    leftLightSensorReading: PropTypes.number,
    rightLightSensorReading: PropTypes.number,
    leftLineSensorReading: PropTypes.number,
    rightLineSensorReading: PropTypes.number,
    distanceSensorReading: PropTypes.number,
    batteryVoltageReading: PropTypes.number,
  }).isRequired,
  changeReadOnly: PropTypes.func.isRequired,
  fetchLesson: PropTypes.func.isRequired,
  clearLesson: PropTypes.func.isRequired,
  createProgram: PropTypes.func.isRequired,
  fetchProgram: PropTypes.func.isRequired,
  remixProgram: PropTypes.func.isRequired,
  saveBlogAnswers: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default hot(module)(
  withCookies(injectIntl(connect(mapStateToProps, mapDispatchToProps)(MissionControl))),
);
