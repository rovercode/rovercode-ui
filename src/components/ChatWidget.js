import 'react-chat-widget/lib/styles.css';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import '@/css/chat.css';
import axios from 'axios';
import PropTypes from 'prop-types';

import {
  Widget, addResponseMessage, toggleInputDisabled,
  toggleWidget, dropMessages,
} from 'react-chat-widget';
import { fetchProgram as actionFetchProgram } from '../actions/code';

let firstresp = false;
const mapStateToProps = ({ chatapp, code, chatwidget }) => ({ chatapp, code, chatwidget });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchProgram: (id) => {
    const fetchProgramAction = actionFetchProgram(id, {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(fetchProgramAction);
  },
});

class ChatWidget extends React.Component {
  static processIncoming(incomingmessage) {
    if (firstresp === false) {
      firstresp = true;
    }
    const message = JSON.parse(incomingmessage.data);
    addResponseMessage(message.message);
  }

  componentDidMount() {
    // destructure props into clientID and sessionID
    const { chatapp, code, fetchProgram } = this.props;
    const { clientId, sessionId, supportProvider } = chatapp;
    const { id: programId } = code;


    // manually toggle widget -
    toggleWidget();
    // Shouldn't need this drop messages thing but safe for now
    dropMessages();

    // create WS connection
    this.socket = new WebSocket(`ws://localhost:8000/ws/support/${sessionId}/`);

    // handle message
    this.socket.onmessage = (m) => {
      const message = JSON.parse(m.data);
      if (message.sender !== clientId && message.message !== 'Toggle in_progress') {
        ChatWidget.processIncoming(m);
      }
      if (message.message === 'Toggle in_progress') {
        this.toggleInProgressState();
      }
      if (supportProvider) {
        fetchProgram(programId);
      }
    };

    // If user is support_provider, send message to support requestor to toggle in_progress
    const { setInProgress } = this.props;
    if (setInProgress) {
      this.sendMessageToUpdateInProgress();
    }

    addResponseMessage('Finding someone to assist you with your code :)');
  }

  componentWillUpdate(nextProps) {
    const { code: currentCode, chatapp: currentChatapp } = this.props;
    const { code: nextCode } = nextProps;
    console.log('In the componentWillUpdate');
    if (currentCode.isSaving && !nextCode.isSaving) {
      console.log('xml has changed');
      if (!currentChatapp.supportProvider) {
        const msg = JSON.stringify({
          message: '[Updating program...]',
          sender: currentChatapp.clientId,
        });
        this.socket.send(msg);
      }
    }
  }

  componentWillUnmount() {
    // This is necessary
    toggleWidget();
  }


  handleNewUserMessage = (newMessage) => {
    // Now send the message through the backend API
    const { chatapp } = this.props;
    const { clientId } = chatapp;
    const msg = JSON.stringify({
      message: newMessage,
      sender: clientId,
    });
    this.socket.send(msg);
  };

  sendMessageToUpdateInProgress = () => {
    // this method sends a message to support requestor to initiate a PATCH request
    // to server to toggle support request to : in_progress: true
    const { chatapp } = this.props;
    const { clientId } = chatapp;
    const msg = JSON.stringify({
      message: 'Toggle in_progress',
      sender: clientId,
    });
    this.socket.onopen = () => this.socket.send(msg);
  }


  toggleInProgressState = () => {
    const { cookies } = this.props;
    const { chatapp } = this.props;
    const { sessionId } = chatapp;
    const newobj = {};
    newobj.in_progress = true;
    const headers = {
      Authorization: `JWT ${cookies.get('auth_jwt')}`,
      'Content-Type': 'application/json',
    };

    console.log(newobj);

    axios.patch(`/api/v1/support-requests/${sessionId}/`, newobj, { headers })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    let chattingwithstring = '';
    if (this.props.chatwidget.chattingWith !== '') {
      chattingwithstring = `You are now chatting with: ${this.props.chatwidget.chattingWith}`;
    }

    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          autofocus={false}
          title="RoverCode Support"
          showCloseButton={false}
          fullScreenMode
          subtitle={chattingwithstring}
        />
      </div>
    );
  }
}

ChatWidget.propTypes = {
  setInProgress: PropTypes.bool.isRequired,
  cookies: PropTypes.instanceOf(Cookies).isRequired,
  // clientId: PropTypes.string.isRequired,
  // sessionId: PropTypes.string.isRequired,
};

export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(ChatWidget)));
