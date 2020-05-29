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
import ProgramName from '@/components/ProgramName';
import ProgramTags from '@/components/ProgramTags';
import Workspace from '@/components/Workspace';
import logger from '@/utils/logger';
import { checkAuthError, authHeader } from '@/actions/auth';
import {
  saveProgram as actionSaveProgram,
  createProgram as actionCreateProgram,
  changeReadOnly as actionChangeReadOnly,
  fetchProgram as actionFetchProgram,
} from '@/actions/code';

const mapStateToProps = ({ code }) => ({ code });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  changeReadOnly: (isReadOnly) => dispatch(actionChangeReadOnly(isReadOnly)),
  saveProgram: (id, content, name, lesson) => dispatch(
    actionSaveProgram(id, content, name, lesson, authHeader(cookies)),
  ).catch(checkAuthError(dispatch)),
  createProgram: (name) => dispatch(actionCreateProgram(name, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
  fetchProgram: (id) => dispatch(actionFetchProgram(id, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
});

class MissionControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleOnClose = () => this.setState({ open: false });

  // Need to fetch the program again since the current code has editable="false" tags
  remix = () => {
    const {
      fetchProgram,
      createProgram,
      saveProgram,
      changeReadOnly,
      code,
    } = this.props;
    return Promise.all([fetchProgram(code.id), createProgram(code.name)])
      .then(([fetchData, createData]) => {
        logger.log(JSON.stringify({
          event: 'remix', userId: createData.user_id, sourceProgramId: code.id, newProgramId: createData.value.id,
        }));
        return saveProgram(createData.value.id, fetchData.value.content,
          createData.value.name, fetchData.value.reference_of);
      })
      .then(() => {
        changeReadOnly(false);
      });
  }

  render() {
    const {
      intl,
      location,
      code,
    } = this.props;

    const {
      open,
    } = this.state;

    const readOnlyTitle = intl.formatMessage({
      id: 'app.mission_control.remix',
      description: 'Label when naming program\'s author',
      defaultMessage: 'This program is by ',
    });

    const WideBox = withStyles(() => ({
      root: {
        width: '100%',
      },
    }))(Box);

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
                <ExpansionPanelDetails>
                  <WideBox p={2} border={1} borderRadius="borderRadius" borderColor="grey.500">
                    <Indicator />
                  </WideBox>
                </ExpansionPanelDetails>
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
  }).isRequired,
  changeReadOnly: PropTypes.func.isRequired,
  fetchProgram: PropTypes.func.isRequired,
  saveProgram: PropTypes.func.isRequired,
  createProgram: PropTypes.func.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default hot(module)(
  withCookies(injectIntl(connect(mapStateToProps, mapDispatchToProps)(MissionControl))),
);
