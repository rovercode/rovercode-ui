import React, { Component } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
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
import { ExpandMore, Close } from '@material-ui/icons';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import CodeViewer from '@/components/CodeViewer';
import Console from '@/components/Console';
import Control from '@/components/Control';
import Indicator from '@/components/Indicator';
import NumericSensorReadout from '@/components/NumericSensorReadout';
import ProgramName from '@/components/ProgramName';
import ProgramTags from '@/components/ProgramTags';
import Workspace from '@/components/Workspace';
import { checkAuthError, authHeader } from '@/actions/auth';
import {
  changeReadOnly as actionChangeReadOnly,
  fetchLesson as actionFetchLesson,
  remixProgram as actionRemixProgram,
} from '@/actions/code';

const mapStateToProps = ({ code, sensor }) => ({ code, sensor });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  changeReadOnly: (isReadOnly) => dispatch(actionChangeReadOnly(isReadOnly)),
  remixProgram: (id) => dispatch(actionRemixProgram(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  fetchLesson: (id) => dispatch(actionFetchLesson(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
});

class MissionControl extends Component {
  constructor(props) {
    super(props);
    const { code, fetchLesson } = props;

    fetchLesson(code.lessonId);

    this.state = {
      open: false,
    };
  }

  handleOnClose = () => this.setState({ open: false });

  remix = () => {
    const {
      changeReadOnly,
      code,
      remixProgram,
    } = this.props;

    return remixProgram(code.id).then(() => {
      changeReadOnly(false);
    });
  }

  render() {
    const {
      intl,
      location,
      code,
      sensor,
    } = this.props;

    const {
      open,
    } = this.state;

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

    const lightSensorsTitle = intl.formatMessage({
      id: 'app.mission_control.light_sensors',
      description: 'Describes the light sensors section',
      defaultMessage: 'Light Sensors',
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

    const WideBox = withStyles(() => ({
      root: {
        width: '100%',
      },
    }))(Box);

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

    const batteryVoltageReading = [
      {
        label: voltageLabel,
        reading: sensor.batteryVoltageReading,
        maxReading: 4500,
      },
    ];

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
              <Grid item>
                <Box>
                  <Typography variant="h6">
                    {code.lessonGoals}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Box>
                  <Typography variant="h6">
                    {code.lessonTutoralLink}
                  </Typography>
                </Box>
              </Grid>
              {
                code.isReadOnly ? (
                  <Grid item>
                    <Box m={0}>
                      <Alert
                        severity="info"
                        action={(
                          <Button color="primary" variant="contained" size="huge" onClick={this.remix}>
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
              <Workspace location={location}>
                <Control />
              </Workspace>
            </Grid>
          </Grid>
          <Grid item container xs={2} direction="column" alignItems="stretch" spacing={2}>
            <Grid item>
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography>
                    <FormattedMessage
                      id="app.mission_control.sensors"
                      description="Header for list of the user's sensors"
                      defaultMessage="Sensors"
                    />
                  </Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails>
                  <Typography>
                    <FormattedMessage
                      id="app.mission_control.buttons"
                      description="Describes the buttons sensor section"
                      defaultMessage="Buttons"
                    />
                  </Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                  <WideBox p={2} border={1} borderRadius="borderRadius" borderColor="grey.500">
                    <Indicator />
                  </WideBox>
                </ExpansionPanelDetails>
                <Divider />
                <NumericSensorReadout
                  title={lightSensorsTitle}
                  readings={lightSensorReadings}
                  unit={unitsLabel}
                />
                <Divider />
                <NumericSensorReadout
                  title={batteryTitle}
                  readings={batteryVoltageReading}
                  unit={milliVoltsLabel}
                />
              </ExpansionPanel>
            </Grid>
            <Grid item>
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                  <Typography>
                    <FormattedMessage
                      id="app.mission_control.console"
                      description="Header for debug console"
                      defaultMessage="Debug Console"
                    />
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Console />
                </ExpansionPanelDetails>
              </ExpansionPanel>
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
          </Grid>
        </Grid>
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
    lessonTutoralLink: PropTypes.string,
    lessonGoals: PropTypes.string,
  }).isRequired,
  sensor: PropTypes.shape({
    leftLightSensorReading: PropTypes.number,
    rightLightSensorReading: PropTypes.number,
    batteryVoltageReading: PropTypes.number,
  }).isRequired,
  changeReadOnly: PropTypes.func.isRequired,
  fetchLesson: PropTypes.func.isRequired,
  remixProgram: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default hot(module)(
  withCookies(injectIntl(connect(mapStateToProps, mapDispatchToProps)(MissionControl))),
);
