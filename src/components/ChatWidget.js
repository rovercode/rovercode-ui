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
import { setChattingWith as actionSetChattingWith } from '../actions/chatwidget';

let firstresp = false;
const mapStateToProps = ({ chatapp, code, chatwidget }) => ({ chatapp, code, chatwidget });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  setChattingWith: id => dispatch(actionSetChattingWith(id)),
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
      // TODO: implement check here from if m.data.clientID == this.state.clientID
      if (message.sender !== clientId) {
        ChatWidget.processIncoming(m);
        // this.setChattingWith(message.sender);
      }
      if (supportProvider) {
        fetchProgram(programId);
      }
    };

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

  setChattingWith = (id) => {
    const { setChattingWith } = this.props;
    setChattingWith(id);
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
  // clientId: PropTypes.string.isRequired,
  // sessionId: PropTypes.string.isRequired,
};

export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(ChatWidget)));
