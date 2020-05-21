import React from 'react';
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
import { withStyles } from '@material-ui/core/styles';
import { ExpandMore, Close } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
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

const mapStateToProps = ({ code }) => ({ code });

const MissionControl = ({ location, code }) => {
  const [state, setState] = React.useState({
    open: false,
  });

  const handleOnClose = () => setState({ ...state, open: false });

  const WideBox = withStyles(() => ({
    root: {
      width: '100%',
    },
  }))(Box);

  return (
    <>
      <Drawer anchor="left" open={state.open} onClose={handleOnClose}>
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
                  <IconButton onClick={handleOnClose}>
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
              <Box m={1}>
                <Typography variant="h6">
                  {code.name}
                </Typography>
              </Box>
            </Grid>
            <Grid item>
              <Button color="default" onClick={() => setState({ ...state, open: true })}>
                <FormattedMessage
                  id="app.mission_control.edit"
                  description="Button to edit the project"
                  defaultMessage="Edit Project"
                />
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
};

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
    name: PropTypes.string,
  }).isRequired,
};

export default hot(module)(connect(mapStateToProps)(MissionControl));
