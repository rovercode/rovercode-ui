import React, { Component } from 'react';
import {
  IconButton,
  Dialog,
  DialogContent,
  Box,
  Button,
  Typography,
  Link,
} from '@material-ui/core';
import {
  withStyles,
} from '@material-ui/core/styles';
import { HelpOutline } from '@material-ui/icons';
import { FormattedMessage, injectIntl } from 'react-intl';
import { hot } from 'react-hot-loader';

import RoverConnection from '@/containers/RoverConnection';
import gigglebotImage from '@/assets/images/connection-help/gigglebot.png';
import displayImage from '@/assets/images/connection-help/display.png';
import flashingImage from '@/assets/images/connection-help/flashing.png';
import deviceWindowsImage from '@/assets/images/connection-help/device-windows.jpg';

class ConnectionHelp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      host: window.location.host,
      open: false,
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

  render() {
    const { open, host } = this.state;
    let env;
    switch (host) {
      case 'beta.rovercode.com':
        env = 'beta';
        break;
      case 'go.rovercode.com':
        env = 'prod';
        break;
      case 'alpha.rovercode.com':
      default:
        env = 'alpha';
    }

    const PaddedBox = withStyles((theme) => ({
      root: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
      },
    }))(Box);

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
                  defaultMessage="If you don't already have a Gigglebot, click here to order one."
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
                description="Tells the user they need a Gigglebot."
                defaultMessage="Plug the micro:bit into Gigglebot, and turn on
                the power switch (on the front passenger side). If your micro:bit
                doesn't display an R, you need to download and flash the Rovercode
                firmware."
              />
            </Typography>
            <PaddedBox display="flex" justifyContent="center">
              <img src={displayImage} alt="micro:bit displaying an R" />
            </PaddedBox>
            <Typography gutterBottom>
              <FormattedMessage
                id="app.connection_help.connect_microbit"
                description="Tells the user to connect the micro:bit to the computer."
                defaultMessage="Use a USB cable to connect the micro:bit to your computer."
              />
            </Typography>
            <PaddedBox display="flex" justifyContent="center">
              <img src={flashingImage} width="300px" alt="Connecting the micro:bit to a computer" />
            </PaddedBox>
            <Typography gutterBottom>
              <FormattedMessage
                id="app.connection_help.computer_device"
                description="Tells the user to look for the device in their file browser."
                defaultMessage="The micro:bit device should show up in your file browser."
              />
            </Typography>
            <PaddedBox display="flex" justifyContent="center">
              <img src={deviceWindowsImage} alt="Connecting the micro:bit to a computer" />
            </PaddedBox>
            <Typography gutterBottom>
              <FormattedMessage
                id="app.connection_help.firmware_save"
                description="Tells the user how to save the firmware."
                defaultMessage="Click the button below to download the firmware hex file,
                and choose to save it directly to the micro:bit device."
              />
            </Typography>
            <PaddedBox display="flex" justifyContent="center">
              <Button
                color="primary"
                variant="outlined"
                href={`https://rovercode-pxt.s3.us-east-2.amazonaws.com/${env}/rovercode.hex`}
              >
                <FormattedMessage
                  id="app.connection_help.firmware_hex_button"
                  description="Links to the firmware hex file"
                  defaultMessage="Click here to download the firmware hex file"
                />
              </Button>
            </PaddedBox>
            <Typography gutterBottom>
              <FormattedMessage
                id="app.connection_help.firmware_complete"
                description="Tells the user how to save the firmware."
                defaultMessage="After a few seconds of a blinking light, you should see an R
                displayed on the micro:bit's display."
              />
            </Typography>
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
            <Typography variant="h5" gutterBottom />
            <Typography variant="h5" gutterBottom>
              <FormattedMessage
                id="app.connection_help.connecting_title"
                description="Points the user to the connection button"
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
            <Typography gutterBottom>
              <FormattedMessage
                id="app.connection_help.done"
                description="Points the user to the connection button"
                defaultMessage="Then, choose the BBC micro:bit device from the list and click Pair.
                If the Rover icon turns blue, you're connected! Click outside this
                window, and try the first lesson!"
              />
            </Typography>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

export default hot(module)(injectIntl(ConnectionHelp));
