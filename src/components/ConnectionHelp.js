import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  IconButton,
  Dialog,
  DialogContent,
  Box,
  Button,
  Typography,
  Link,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import {
  withStyles,
} from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import { HelpOutline, ExpandMore } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { hot } from 'react-hot-loader';

import RoverConnection from '@/containers/RoverConnection';
import gigglebotImage from '@/assets/images/connection-help/gigglebot.png';
import displayImage from '@/assets/images/connection-help/display.png';
import flashingImage from '@/assets/images/connection-help/flashing.png';
import deviceWindowsImage from '@/assets/images/connection-help/device-windows.jpg';

// TODO: Use a flag on user model to launch modal immediately
const mapStateToProps = ({ user, rover }) => ({ user, rover: rover.rover });

class ConnectionHelp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      done: false,
    };
  }

  handleOpen = () => {
    this.setState({
      open: true,
    });
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  }

  handleFinishedClick = () => {
    this.handleClose();
    this.setState({
      done: true,
    });
  }

  render() {
    const { open, done } = this.state;
    const { rover } = this.props;

    const PaddedBox = withStyles((theme) => ({
      root: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
      },
    }))(Box);

    const CenteredExpansionPanelDetails = withStyles(() => ({
      root: {
        justifyContent: 'center',
      },
    }))(ExpansionPanelDetails);

    return (
      <>
        <IconButton color="inherit" onClick={this.handleOpen} aria-label="connection help">
          <HelpOutline />
        </IconButton>
        <Dialog maxWidth="sm" open={open} onClose={this.handleClose}>
          <DialogContent dividers>
            <Typography variant="h4" gutterBottom>
              <FormattedMessage
                id="app.connection_help.welcome"
                description="Introduces connection helper."
                defaultMessage="Welcome! Let's get set up."
              />
            </Typography>
            <Typography variant="h5" gutterBottom>
              <FormattedMessage
                id="app.connection_help.gigglebot_title"
                description="Introduces the Gigglebot ordering section."
                defaultMessage="1. Get your Rover"
              />
            </Typography>
            <Typography gutterBottom>
              <FormattedMessage
                id="app.connection_help.gigglebot_ordering"
                description="Tells the user they need a Gigglebot."
                defaultMessage="The Rover is your robot. Rovercode works with the Gigglebot,
                which is a robot chassis with a micro:bit computer."
              />
            </Typography>
            <PaddedBox display="flex" justifyContent="center">
              <img src={gigglebotImage} width="300px" alt="Gigglebot and micro:bit" />
            </PaddedBox>
            <PaddedBox display="flex" justifyContent="center">
              <Button
                color="primary"
                variant="outlined"
                href="https://gigglebot.io/shop/robots/gigglebot-starter-kit"
                target="_blank"
                rel="noopener"
              >
                <FormattedMessage
                  id="app.connection_help.gigglebot_link"
                  description="Links to Gigglebot kit"
                  defaultMessage="If you don't already have a Gigglebot, click here to order one"
                />
              </Button>
            </PaddedBox>
            <Typography variant="h5" gutterBottom />
            <Typography variant="h5" gutterBottom>
              <FormattedMessage
                id="app.connection_help.firmware_title"
                description="Introduces the Rover firmware flashing section."
                defaultMessage="2. Check the Rover firmware"
              />
            </Typography>
            <Typography gutterBottom>
              <FormattedMessage
                id="app.connection_help.firmware_need"
                description="Tells the user to check their micro:bit firmware"
                defaultMessage="Plug the micro:bit into Gigglebot, and turn on
                the power switch (on the front passenger side)."
              />
            </Typography>
            <PaddedBox display="flex" justifyContent="center">
              <img src={displayImage} alt="micro:bit displaying an R" />
            </PaddedBox>
            <PaddedBox>
              <ExpansionPanel>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    <FormattedMessage
                      id="app.connection_help.firmware_expansion_panel"
                      description="Tells the user to click if they don't see the R"
                      defaultMessage="If your micro:bit doesn't display an R, you need to download
                      and flash the Rovercode firmware. Click here to see how."
                    />
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography gutterBottom>
                    <FormattedMessage
                      id="app.connection_help.connect_microbit"
                      description="Tells the user to connect the micro:bit to the computer."
                      defaultMessage="Use a USB cable to connect the micro:bit to your computer."
                    />
                  </Typography>
                </ExpansionPanelDetails>
                <CenteredExpansionPanelDetails>
                  <PaddedBox>
                    <img src={flashingImage} width="300px" alt="Connecting the micro:bit to a computer" />
                  </PaddedBox>
                </CenteredExpansionPanelDetails>
                <ExpansionPanelDetails>
                  <Typography gutterBottom>
                    <FormattedMessage
                      id="app.connection_help.computer_device"
                      description="Tells the user to look for the device in their file browser."
                      defaultMessage="The micro:bit device should show up in your file browser."
                    />
                  </Typography>
                </ExpansionPanelDetails>
                <CenteredExpansionPanelDetails>
                  <PaddedBox>
                    <img src={deviceWindowsImage} alt="Connecting the micro:bit to a computer" />
                  </PaddedBox>
                </CenteredExpansionPanelDetails>
                <ExpansionPanelDetails>
                  <Typography gutterBottom>
                    <FormattedMessage
                      id="app.connection_help.firmware_save"
                      description="Tells the user how to save the firmware."
                      defaultMessage="Click the button below to download the firmware hex file,
                      and choose to save it directly to the micro:bit device."
                    />
                  </Typography>
                </ExpansionPanelDetails>
                <CenteredExpansionPanelDetails>
                  <PaddedBox>
                    <Button
                      color="primary"
                      variant="outlined"
                      href={`${PXT_HEX_URL}`} // eslint-disable-line no-undef
                    >
                      <FormattedMessage
                        id="app.connection_help.firmware_hex_button"
                        description="Links to the firmware hex file"
                        defaultMessage="Click here to download the firmware hex file"
                      />
                    </Button>
                  </PaddedBox>
                </CenteredExpansionPanelDetails>
                <ExpansionPanelDetails>
                  <Typography gutterBottom>
                    <FormattedMessage
                      id="app.connection_help.firmware_complete"
                      description="Tells the user how to see if the flash was successful"
                      defaultMessage="After a few seconds of a blinking light, you should see an R
                  displayed on the micro:bit's display."
                    />
                  </Typography>
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                  <Link
                    variant="body1"
                    href="https://support.microbit.org/support/solutions/articles/19000013986-how-do-i-transfer-my-code-onto-the-micro-bit-via-usb"
                    target="_blank"
                    rel="noopener"
                  >
                    <FormattedMessage
                      id="app.connection_help.firmware_flash_link"
                      description="Describes a link to more flashing help."
                      defaultMessage="More instructions can be found here."
                    />
                  </Link>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </PaddedBox>
            <Typography variant="h5" gutterBottom />
            <Typography variant="h5" gutterBottom>
              <FormattedMessage
                id="app.connection_help.connecting_title"
                description="Introduces the connection section"
                defaultMessage="3. Connect to your Rover"
              />
            </Typography>
            <Typography gutterBottom>
              <FormattedMessage
                id="app.connection_help.connecting"
                description="Points the user to the connection button"
                defaultMessage="With your Rover powered on and displaying the R, push the connect
                button below."
              />
            </Typography>
            <PaddedBox display="flex" justifyContent="center">
              <RoverConnection />
            </PaddedBox>
            {
              rover ? (
                <PaddedBox display="flex" justifyContent="center">
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={this.handleFinishedClick}
                  >
                    <FormattedMessage
                      id="app.connection_help.to_courses"
                      description="Links to courses"
                      defaultMessage="Congrats, you're connected! Click here, and let's write some code."
                    />
                  </Button>
                </PaddedBox>
              ) : (
                <Typography gutterBottom>
                  <FormattedMessage
                    id="app.connection_help.done"
                    description="tells the user how to select their micro:bit BLE device"
                    defaultMessage="Then, choose the BBC micro:bit device from the list and click Pair."
                  />
                </Typography>
              )
            }
            {
              done ? (
                <Redirect to={{
                  pathname: '/programs/mine',
                }}
                />
              ) : (null)
            }
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

ConnectionHelp.defaultProps = {
  rover: null,
};

ConnectionHelp.propTypes = {
  user: PropTypes.shape({
    // showConnectionHelpOnLogin: PropTypes.bool.isRequired, // TODO
  }).isRequired,
  rover: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default hot(module)(connect(mapStateToProps)(ConnectionHelp));
