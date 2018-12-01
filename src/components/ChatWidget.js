import 'react-chat-widget/lib/styles.css';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import '@/css/chat.css';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Icon, Card } from 'semantic-ui-react';
import {
  Widget, addResponseMessage,
  toggleWidget, dropMessages,
} from 'react-chat-widget';
import {
  toggleInProgressState as actionToggleInProgressState,
  addToChatLog as actionAddToChatLog,
  setChattingWith as actionSetChattingWith,
  closeTips as actionCloseTips,
} from '../actions/chatwidget';
import { fetchProgram as actionFetchProgram } from '../actions/code';

let firstresp = false;
const mapStateToProps = (
  {
    chatapp, code, chatwidget, user,
  },
) => (
    {
      chatapp, code, chatwidget, user,
    }
  );

const mapDispatchToProps = (dispatch, { cookies }) => ({
  fetchProgram: (id) => {
    const fetchProgramAction = actionFetchProgram(id, {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(fetchProgramAction);
  },
  toggleInProgressState: () => dispatch(actionToggleInProgressState()),
  closeTips: () => dispatch(actionCloseTips()),
  addToChatLog: message => dispatch(actionAddToChatLog(message)),
  setChattingWith: userid => dispatch(actionSetChattingWith(userid)),
});

const sptips = [
  "Try to avoid saying \"you just need to...\". Something might be easy for you but a challenge for a first-timer!",
  "Try asking \"What do you want the Rover to do?\" and \"What do you see the Rover doing?\"",
  "Do your best to read what the other person wrote carefully.",
  "Try to be encouraging! Believe they can do it!",
  "Try to be patient after asking a question! If you can, give them some time to think",
  "Think about using the phrases \"Now you might want to...\" and \"What I would do is\"",
  "You're both in this together! Can you use the word \"we\" sometimes?",
  "Sometimes, try to help them think fro the Rover's perspective. Like, \"the Rover didn't know you wanted it to...\"",
]

const srtips = [
  "It's ok if your helper is wrong sometimes!",
  "It's ok if your helper doesn't know something!",
  "You might want to describe to your helper what you think your Rover should be doing, step by step.",
  "Be sure to say thank you afterwards!",
  "It's ok to take your time and read what your helper wrote carefully.",
]

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
    const { chatapp, code, fetchProgram, user } = this.props;
    const { sessionId, supportProvider } = chatapp;
    const { id: programId } = code;


    // manually toggle widget -
    toggleWidget();
    // Shouldn't need this drop messages thing but safe for now
    dropMessages();

    // create WS connection
    this.socket = new WebSocket(`ws://${location.host}:80/ws/support/${sessionId}/`);

    // handle message
    this.socket.onmessage = function (m) {

      const message = JSON.parse(m.data);
      this.addToChatLog(message);
      if (message.sender !== user.username
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
          + 'It will be reviewed, and action will be taken according to the policy at http://bit.ly/rovercode-coc');
      }

      //support requestor receives this message and then toggles their support request entry in_progress
      if (message.message === 'Toggle in_progress' && message.sender !== user.username) {
        this.toggleInProgressState();
        this.setChattingWith(message.sender)
      }

      //notify support requestor support provider has disconnected
      if (message.message === 'SP_DISCONNECTED' && message.sender !== user.username) {
        this.toggleInProgressState();
        // this.patchInProgressState();
        addResponseMessage("The support provider has disconnected. Finding you another support provider")
      }

      //Whether chat is successfully concluded or support requestor requests help from someone else, we process these messages on end of suport provider
      if (message.message === 'CONCLUDE_CHAT' && message.sender !== user.username) {
        addResponseMessage("The support session has ended. Thanks for your help!");
        this.sleep(5000).then(() => {
          this.handleCancelChatForSP();
        })
      }
    }.bind(this);

    // If user is support_provider, send message to support requestor to toggle in_progress
    if (supportProvider) {
      this.sendMessageToUpdateInProgress();
      addResponseMessage('You are now in a support session. Feel free to start chatting!');
      addResponseMessage('Remember, never ask for or give your real name, where you live, or any other information about the real you.');
    } else {
      addResponseMessage('Finding someone to assist you with your code :)');
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const { chatwidget } = this.props;
    const { chatapp } = this.props;
    if (nextProps.chatwidget.in_progress !== chatwidget.in_progress && chatapp.supportProvider === false) {
      this.patchInProgressState(nextProps.chatwidget.in_progress);
    }
    if (nextProps.chatwidget.chatting_with !== chatwidget.chatting_with) {
      addResponseMessage(`You are now chatting with ${nextProps.chatwidget.chatting_with}`);
      addResponseMessage('Remember, never ask for or give your real name, where you live, or any other information about the real you.');
    }
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
          sender: currentChatapp.username,
        });
        this.socket.send(msg);
      }
    }
  }

  componentWillUnmount() {
    // This is necessary
    toggleWidget();
  }

  setChattingWith = username => {
    const { setChattingWith } = this.props;
    setChattingWith(username);
  }

  handleNewUserMessage = (newMessage) => {
    // Now send the message through the backend API
    const { user } = this.props;
    const msg = JSON.stringify({
      message: newMessage,
      sender: user.username,
    });
    this.socket.send(msg);
  };

  sendMessageToUpdateInProgress = () => {
    // this method sends a message to support requestor to initiate a PATCH request
    // to server to toggle support request to : in_progress: true
    const { user } = this.props;
    const msg = JSON.stringify({
      message: 'Toggle in_progress',
      sender: user.username,
    });
    this.socket.onopen = () => this.socket.send(msg);
  }


  toggleInProgressState = () => {
    const { toggleInProgressState } = this.props;
    toggleInProgressState();
  }

  patchInProgressState = (in_progress_state) => {
    const { cookies } = this.props;
    const { chatapp } = this.props;
    const { sessionId } = chatapp;
    const newobj = {};
    newobj.in_progress = in_progress_state;
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

  handleCancelChatForSP = (sendmessage) => {
    const { user } = this.props
    if (sendmessage) {
      const msg = JSON.stringify({
        message: 'SP_DISCONNECTED',
        sender: user.username,
      });
      this.socket.send(msg);
    }
    dropMessages();
    this.props.toggleOffSupportProvider();
    window.location = '/support'
  }

  handleConcludeChat = () => {
    const { sessionId } = this.props.chatapp;
    const { cookies } = this.props;
    const { user } = this.props;
    const headers = {
      Authorization: `JWT ${cookies.get('auth_jwt')}`,
      'Content-Type': 'application/json',
    };
    axios.delete(`/api/v1/support-requests/${sessionId}/`, { headers })
      .then(function () {
        addResponseMessage("This concludes your chat session!");
        this.sleep(5000).then(() => {
          dropMessages();
          this.props.toggleForms();
        })

      }.bind(this)).catch(function (error) {
        console.log(error);
      });
    const msg = JSON.stringify({
      message: 'CONCLUDE_CHAT',
      sender: user.username,
    });
    this.socket.send(msg);
    this.setChattingWith("");
  };

  handleCancelChat = () => {
    const { sessionId } = this.props.chatapp;
    const { user } = this.props;
    const { cookies } = this.props;
    const newobj = {};
    newobj.in_progress = false;
    const headers = {
      Authorization: `JWT ${cookies.get('auth_jwt')}`,
      'Content-Type': 'application/json',
    };
    axios.patch(`/api/v1/support-requests/${sessionId}/`, JSON.stringify(newobj), { headers })
      .then(function () {
        addResponseMessage("Finding you help from someone else!")
      }.bind(this)).catch(function (error) {
        console.log(error);
      }.bind(this));
    const msg = JSON.stringify({
      message: 'CONCLUDE_CHAT',
      sender: user.username,
    });
    this.socket.send(msg);
    this.setChattingWith("");
  };

  handleReportAbuse = () => {
    console.log('Reporting abuse');
    const { user } = this.props;
    const reportMsg = JSON.stringify({
      message: 'REPORT_ABUSE',
      sender: user.username,
      transcript: this.props.chatwidget.chat_log,
    });
    this.socket.send(reportMsg);
    const cancelMsg = JSON.stringify({
      message: 'CONCLUDE_CHAT',
      sender: user.username,
    });
    this.socket.send(cancelMsg);
    this.toggleInProgressState();
    //this.patchInProgressState();
  }

  addToChatLog = message => {
    const { addToChatLog } = this.props;
    addToChatLog(message);
  }

  closeTips = () =>{
    const { closeTips } = this.props;
    closeTips();
  }


  getTip = () =>{
    if (this.props.supportProvider){
      let item = sptips[Math.floor(Math.random()*sptips.length)];
      return(<p>{item}</p>);
    } else{
      let item = srtips[Math.floor(Math.random()*sptips.length)];
      return(<p>{item}</p>);
    }

  }

  render() {
    let chattingwithstring = '';

    return (
      <div className="App" >
        {this.props.chatwidget.show_tips ? <Card
            header={<div><Icon color='red' link name='close' onClick={this.closeTips} style={{textAlign: 'right', marginLeft:200}}></Icon></div>}
            color='purple'
            description={this.getTip}/> : null}
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          autofocus={false}
          title="Rover Support"
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
              <Button positive style={{ width: '100%' }} onClick={this.handleConcludeChat}>
                <p>My problem is fixed! <Icon name='check' /></p>
              </Button>
              <br />
              <br />
              <Button className="ui primary button" style={{ width: '100%' }} onClick={() => this.handleCancelChat(true)}>
                <p>Find help from someone else <Icon name='hand paper outline' /></p>
              </Button>
              <br />
              <br />
              <Button style={{ width: '100%' }} className="ui negative button" onClick={() => this.handleReportAbuse()}>
                <p>Report Abuse  <Icon name='exclamation' /></p>
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
  // sessionId: PropTypes.string.isRequired,
};

export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(ChatWidget)));
