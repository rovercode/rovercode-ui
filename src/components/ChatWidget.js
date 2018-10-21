import 'react-chat-widget/lib/styles.css';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import React from 'react';
import '@/css/chat.css';
import {
  Widget, addResponseMessage, toggleInputDisabled,
  toggleWidget, dropMessages,
} from 'react-chat-widget';

let firstresp = false;
const mapStateToProps = ({ chatapp }) => ({ chatapp });

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
    const { clientId, sessionId } = this.props;


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
    };

    addResponseMessage('Finding someone to assist you with your code :)');
  }

  componentWillUnmount() {
    // This is necessary
    toggleWidget();
  }

  handleNewUserMessage = (newMessage) => {
    // Now send the message through the backend API
    const { clientId } = this.props;
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

export default hot(module)(connect(mapStateToProps)(ChatWidget));
