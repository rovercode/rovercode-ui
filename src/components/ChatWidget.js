import 'react-chat-widget/lib/styles.css';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import React from 'react';
import { withCookies } from 'react-cookie';
import '@/css/chat.css';
import {
  Widget, addResponseMessage, toggleInputDisabled,
  toggleWidget, dropMessages,
} from 'react-chat-widget';
import { fetchProgram as actionFetchProgram } from '../actions/code';

let firstresp = false;
const mapStateToProps = ({ chatapp, code }) => ({ chatapp, code });
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
    const { clientId, sessionId } = chatapp;
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
      // TODO: implement check here from if m.data.clientID == this.state.clientID
      if (message.sender !== clientId) {
        ChatWidget.processIncoming(m);
      }
      fetchProgram(programId);
    };

    addResponseMessage('Finding someone to assist you with your code :)');
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

  render() {
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          autofocus={false}
          title="Need help with your code?"
          showCloseButton={false}
          fullScreenMode
          subtitle="Ask your question and we will find someone to help you"
        />
      </div>
    );
  }
}

ChatWidget.propTypes = {
  // clientId: PropTypes.string.isRequired,
  // sessionId: PropTypes.string.isRequired,
};

export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(ChatWidget)));
