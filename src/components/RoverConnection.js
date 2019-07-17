import React, { Component, Fragment } from 'react';
import { Card, Label, Icon } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Websocket from 'react-websocket';
import { COVERED, NOT_COVERED } from '@/actions/sensor';

const heartbeatTimeout = 8000; // milliseconds

class RoverConnection extends Component {
  constructor(props) {
    super(props);

    this.timeout = null;
    this.state = {
      online: false,
    };
  }

  componentDidMount() {
    this.startHeartbeatTimer();
    this.sendCommand();
  }

  componentDidUpdate() {
    this.sendCommand();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  startHeartbeatTimer = () => {
    this.timeout = setTimeout(this.setOffline, heartbeatTimeout);
  }

  setActive = () => {
    const { changeActiveRover, clientId } = this.props;

    changeActiveRover(clientId);
  }

  setOffline = () => this.setState({ online: false })

  setOnline = () => this.setState({ online: true })

  onMessage = (data) => {
    const { changeLeftSensorState, changeRightSensorState, isActive } = this.props;
    const { online } = this.state;

    const message = JSON.parse(data);

    if (message.type === 'sensor-reading') {
      if (isActive) {
        const value = message['sensor-value'];
        if (message['sensor-id'] === 'ultrasonic-left') {
          changeLeftSensorState(value ? COVERED : NOT_COVERED);
        } else if (message['sensor-id'] === 'ultrasonic-right') {
          changeRightSensorState(value ? COVERED : NOT_COVERED);
        }
      }
    } else if (message.type === 'heartbeat') {
      clearTimeout(this.timeout);
      this.startHeartbeatTimer();

      if (!online) {
        this.setOnline();
      }
    }
  }

  sendCommand = () => {
    const { commands, isActive, popCommand } = this.props;

    if (commands.length && isActive) {
      this.wsRef.sendMessage(commands[0]);
      popCommand();
    }
  }

  render() {
    const { clientId, isActive, name } = this.props;
    const { online } = this.state;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsPort = window.location.protocol === 'https:' ? '443' : '8000';
    const wsUrl = `${wsProtocol}://${window.location.hostname}:${wsPort}/ws/realtime/${clientId}/`;

    return (
      <Fragment>
        <Card color={isActive ? 'blue' : null} onClick={this.setActive}>
          <Card.Content>
            <Label corner="right" style={{ borderColor: 'white' }}>
              {
                online ? (
                  <Icon name="circle" color="green" />
                ) : (
                  <Icon name="circle outline" />
                )
              }
            </Label>
            <Card.Header>
              { name }
            </Card.Header>
            <Card.Meta>
              {
                isActive ? (
                  <FormattedMessage
                    id="app.rover_connection.active"
                    description="Label indicating the rover is connected"
                    defaultMessage="Active"
                  />
                ) : (
                  <FormattedMessage
                    id="app.rover_connection.inactive"
                    description="Label indicating the rover is not connected"
                    defaultMessage="Inactive"
                  />
                )
              }
            </Card.Meta>
          </Card.Content>
        </Card>
        <Websocket
          url={wsUrl}
          onMessage={this.onMessage}
          ref={(ws) => { this.wsRef = ws; }}
        />
      </Fragment>
    );
  }
}

RoverConnection.defaultProps = {
  commands: [],
};

RoverConnection.propTypes = {
  isActive: PropTypes.bool.isRequired,
  clientId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  changeLeftSensorState: PropTypes.func.isRequired,
  changeRightSensorState: PropTypes.func.isRequired,
  changeActiveRover: PropTypes.func.isRequired,
  popCommand: PropTypes.func.isRequired,
  commands: PropTypes.arrayOf(PropTypes.string),
};

export default hot(module)(RoverConnection);
