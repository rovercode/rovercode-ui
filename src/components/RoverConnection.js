import React, { Component, Fragment } from 'react';
import { Card, Label, Icon } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import Websocket from 'react-websocket';

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
    const { changeLeftSensorState, changeRightSensorState } = this.props;
    const { online } = this.state;

    const message = JSON.parse(data);

    if (message.type === 'sensor-reading') {
      const value = message['sensor-value'];
      if (message['sensor-id'] === 'ultrasonic-left') {
        changeLeftSensorState(value);
      } else if (message['sensor-id'] === 'ultrasonic-right') {
        changeRightSensorState(value);
      }
    } else if (message.type === 'heartbeat') {
      clearTimeout(this.timeout);
      this.startHeartbeatTimer();

      if (!online) {
        this.setOnline();
      }
    }
  }

  render() {
    const { clientId, isActive, name } = this.props;
    const { online } = this.state;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsProtocol}://${window.location.hostname}/ws/realtime/${clientId}`;

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
              { isActive ? 'Active' : 'Inactive' }
            </Card.Meta>
          </Card.Content>
        </Card>
        <Websocket url={wsUrl} onMessage={this.onMessage} />
      </Fragment>
    );
  }
}

RoverConnection.propTypes = {
  isActive: PropTypes.bool.isRequired,
  clientId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  changeLeftSensorState: PropTypes.func.isRequired,
  changeRightSensorState: PropTypes.func.isRequired,
  changeActiveRover: PropTypes.func.isRequired,
};

export default hot(module)(RoverConnection);
