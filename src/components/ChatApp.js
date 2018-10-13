import React from 'react'
import { Button, Card, Select } from 'semantic-ui-react'
import ChatWidget from './ChatWidget'
import ChatForm from './ChatForm'
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import {setSessionId, setClientId, toggleForms} from '../actions/chatapp'

// const mapStateToProps = ({ chatapp }) => ({ chatapp });
// const mapDispatchToProps = dispatch => ({
//   toggleforms: () => dispatch(toggleForms()),
  
// });

class ChatApp extends React.Component {

  constructor(props){
      super(props)
      this.state = {
        formHidden: false,
        chatHidden: true,
        clientId: null, 
        sessionId: null
      }
      this.toggleForms = this.toggleForms.bind(this)
  }

  componentDidMount(){
    let client= this.idGenerator();
    console.log(client + " endpoint is!")
    this.setState({clientId:client})
  }

  toggleForms () {
    // const { toggleforms} = this.props;
    // toggleforms();

    //OLD CODE
    this.setState({
      formHidden: !this.state.formHidden,
      chatHidden: !this.state.chatHidden
    });

    //register a new session 
    if (this.state.chatHidden){
      this.setState({sessionId:this.idGenerator()})
    }
  }

  registerChatSession(){

    //code here for registing session via Fetch

  }

  idGenerator() {
    let S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  } 

  
  render(){
    return(
      <div style={{marginTop:20, marginLeft:40, minWidth:300}} >
        <Card>
          <Card.Content>
            {this.state.chatHidden && !this.state.formHidden ? 
              <ChatForm toggleForms={this.toggleForms}></ChatForm>
              : 
              <div>
                <ChatWidget clientId={this.state.clientId} sessionId={this.state.sessionId}></ChatWidget>
                <br />
                <br />
                <Button className="ui negative button" onClick={this.toggleForms.bind(this)}>Cancel chat</Button> 
              </div> 
              } 
          </Card.Content>
        </Card> 
      </div>
    );
  }
}

// ChatApp.propTypes={
  
// }

//export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(ChatApp));
export default ChatApp;