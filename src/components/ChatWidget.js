import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import React from 'react';
import '@/css/chat.css';
import { toggleWidget } from 'react-chat-widget';
import { toggleInputDisabled} from 'react-chat-widget'
import {dropMessages} from 'react-chat-widget'
import {connect} from 'react-redux'
import { hot } from 'react-hot-loader';


let firstresp=false;
const mapStateToProps = ({ chatapp }) => ({ chatapp });



class ChatWidget extends React.Component {

  constructor(props){
    super(props);  
  }

  componentDidMount() {
    //destructure props into clientID and sessionID
    let {clientId, sessionId} = this.props;
    toggleInputDisabled();
    //manually toggle widget -
    toggleWidget();
    //Shouldnt need this drop messages thing but safe for now
    dropMessages();

    //create WS connection
    this.socket = new WebSocket(`ws://localhost:8000/ws/realtime/${sessionId}/`);

    //handle message
    this.socket.onmessage = m =>{
      //TODO: implement check here from if m.data.clientID == this.state.clientID
      if (!m.data.sender == this.props.clientId){
        this.processIncoming(m);
      }
    }
    addResponseMessage("Finding someone to assist you with your code :)");   
  }
    
  processIncoming(incomingmessage) {
    if (firstresp == false){
      toggleInputDisabled();
      firstresp = true;
    }
    let message = JSON.parse(incomingmessage.data)
    addResponseMessage(message.message);
  }

  componentWillUnmount(){
    //This is necessary
    toggleWidget();
  }
  handleNewUserMessage = (newMessage) => {
    // Now send the message throught the backend API
    let msg = JSON.stringify({
        message: newMessage,
        sender: this.props.clientId
    })
    this.socket.send(msg)    
  }

  render() {
    return (
      <div className="App">
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          autofocus = {false}
          title="Need help with your code?"
          showCloseButton = {false}
          fullScreenMode = {true}
          subtitle="Ask your question and we will find someone to help you"
        />
      </div>
    );
  } 
}
export default hot(module)(connect(mapStateToProps)(ChatWidget));
