import 'react-chat-widget/lib/styles.css';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import '@/css/chat.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import {
  toggleInProgressState as actionToggleInProgressState,
  addToChatLog as actionAddToChatLog,
} from '../actions/chatwidget';
import {
  Widget, addResponseMessage, toggleInputDisabled,
  toggleWidget, dropMessages,
} from 'react-chat-widget';
import { fetchProgram as actionFetchProgram } from '../actions/code';
import { SSL_OP_EPHEMERAL_RSA } from 'constants';
import { join } from 'upath';

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
  toggleInProgressState: () =>dispatch(actionToggleInProgressState()),
  addToChatLog: message =>dispatch(actionAddToChatLog(message)),
});

class ChatWidget extends React.Component {
  static processIncoming(incomingmessage) {
    if (firstresp === false) {
      firstresp = true;
    }
    const message = JSON.parse(incomingmessage.data);
    addResponseMessage(message.message);
  }

  componentDidMount = () => {
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
    this.socket.onmessage = function(m) {

      const message = JSON.parse(m.data);
      this.addToChatLog(message);
      if (message.sender !== clientId
        && message.message !== 'REPORT_ABUSE'
        && message.message !== 'Toggle in_progress'
        && message.message !== 'CONCLUDE_CHAT'
        && message.message !== 'SP_DISCONNECTED') {
        //if none of above message conditions are met, we process the message and display it
        ChatWidget.processIncoming(m);
      }
      //fetch program
      if (supportProvider) {
        fetchProgram(programId);
      }

      if (message.message === 'REPORT_ABUSE') {
        addResponseMessage('This conversation has been reported to administrators. '
          + 'It will be reviewed, and action will be taken according to the policy at TODO: policy link');
      }

      //support requestor receives this message and then toggles their support request entry in_progress
      if (message.message === 'Toggle in_progress') {
        this.toggleInProgressState();
      }

      //notify support requestor support provider has disconnected
      if(message.message === 'SP_DISCONNECTED' && message.sender !== clientId ){
        this.toggleInProgressState();
        addResponseMessage("The support provider has disconnected. Finding you another support provider")
      }

      //Whether chat is successfully concluded or support requestor requests help from someone else, we process these messages on end of suport provider
      if (message.message === 'CONCLUDE_CHAT' && message.sender !== clientId ){
        addResponseMessage("The support session has ended. Thanks for your help!");
        this. sleep(5000).then(() => {
          this.handleCancelChatForSP();
        })
      }
    }.bind(this);

    // If user is support_provider, send message to support requestor to toggle in_progress
    if (supportProvider) {
      this.sendMessageToUpdateInProgress();
      addResponseMessage('You are now in a support session. Feel free to start chatting!');
    } else{
      addResponseMessage('Finding someone to assist you with your code :)');
    }
  };

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
    const { toggleInProgressState } = this.props;
    toggleInProgressState();
    
    const { cookies } = this.props;
    const { chatapp } = this.props;
    const { sessionId } = chatapp;
    const newobj = {};
    newobj.in_progress = this.props.chatwidget.in_progress;
    const headers = {
      Authorization: `JWT ${cookies.get('auth_jwt')}`,
      'Content-Type': 'application/json',
    };

    axios.patch(`/api/v1/support-requests/${sessionId}/`, newobj, { headers })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  handleCancelChatForSP = (sendmessage) =>{
    const { chatapp } = this.props
    if (sendmessage){
      const msg = JSON.stringify({
        message: 'SP_DISCONNECTED',
        sender: chatapp.clientId,
      });
      this.socket.send(msg);
    }
    dropMessages();
    this.props.toggleOffSupportProvider();
  }

  handleConcludeChat = () => {
    const { sessionId } = this.props.chatapp;
    const { cookies } = this.props;
    const { chatapp } = this.props;
    const headers = {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
        'Content-Type': 'application/json',
    };
    axios.delete(`/api/v1/support-requests/${sessionId}/`, { headers })
      .then(function() { 
        addResponseMessage("This concludes your chat session!");
        this. sleep(5000).then(() => {
          dropMessages();
          this.props.toggleForms();
        })

      }.bind(this)).catch(function(error) {
        console.log(error);
      });
    const msg = JSON.stringify({
      message: 'CONCLUDE_CHAT',
      sender: chatapp.clientId,
    });
    this.socket.send(msg);
  };

  handleCancelChat = () => {
    const { sessionId } = this.props.chatapp;
    const { chatapp } = this.props;
    const { cookies } = this.props;
    const newobj = {};
    newobj.in_progress = false;
    const headers = {
      Authorization: `JWT ${cookies.get('auth_jwt')}`,
      'Content-Type': 'application/json',
    };
    axios.patch(`/api/v1/support-requests/${sessionId}/`, JSON.stringify(newobj), { headers })
      .then(function() {
        addResponseMessage("Finding you help from someone else!")
      }.bind(this)).catch(function(error) {
        console.log(error);
      }.bind(this));
    const msg = JSON.stringify({
      message: 'CONCLUDE_CHAT',
      sender: chatapp.clientId,
    });
    this.socket.send(msg);
  };

  handleReportAbuse() {
    console.log('Reporting abuse');
    const { chatapp } = this.props;
    const reportMsg = JSON.stringify({
      message: 'REPORT_ABUSE',
      sender: chatapp.clientId,
      transcript: this.props.chatwidget.chat_log,
    });
    this.socket.send(reportMsg);
    const cancelMsg = JSON.stringify({
      message: 'CONCLUDE_CHAT',
      sender: chatapp.clientId,
    });
    this.socket.send(cancelMsg);
  }

  addToChatLog = message => {
    const { addToChatLog } = this.props;
    addToChatLog(message);
  }

  render() {
    let chattingwithstring = '';
  
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          autofocus={false}
          title="Support"
          showCloseButton={false}
          fullScreenMode
          subtitle={chattingwithstring}
        />
        {this.props.supportProvider ? (
          <div>
          <br />
          <br />
          <Button className="ui negative button" onClick={this.handleCancelChatForSP}>
          Cancel chat
          </Button>
          </div>
        ) : (
          <div>
            <br />
            <br />
            <Button positive onClick={this.handleConcludeChat}>
              My problem is fixed!
            </Button>
            <br />
            <br />
            <Button className="ui negative button" onClick={() => this.handleCancelChat(true)}>
              Find help from someone else
            </Button>
            <br />
            <br />
            <Button className="ui negative button" onClick={() => this.handleReportAbuse()}>
              Report abuse
            </Button>
          </div>
        )
        }
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
