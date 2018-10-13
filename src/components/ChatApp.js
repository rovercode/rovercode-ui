import React from 'react'
import { Button, Card} from 'semantic-ui-react'
import ChatWidget from './ChatWidget'
import ChatForm from './ChatForm'
import {connect} from 'react-redux'
import { hot } from 'react-hot-loader';
import {setSessionID as actionSetSessionId, setClientID as actionSetClientId, toggleForms as actionToggle} from '../actions/chatapp'

const mapStateToProps = ({ chatapp }) => ({ chatapp });
const mapDispatchToProps = dispatch => ({
  toggleforms: () => dispatch(actionToggle()),
  setsessionid: id => dispatch(actionSetSessionId(id)),
  setclientid: id => dispatch(actionSetClientId(id))
});

class ChatApp extends React.Component {

  constructor(props){
      super(props)
  }

  setSessionId=(id)=>{
    const {setsessionid} = this.props;
    setsessionid(id);
  }
  setClientId = (id)=>{
    const {setclientid} = this.props;
    setclientid(id);
  }

  componentDidMount(){
  }

  generateNewIds = () =>{
    const clientid=this.idGenerator(), sessionid = this.idGenerator();
    console.log(`${clientid}\n${sessionid}`)
    this.setSessionId(sessionid);
    this.setClientId(clientid);
  }

  toggleForms = ()=> {
    const { toggleforms} = this.props;
    toggleforms();
    if (!this.props.chatapp.formHidden && this.props.chatapp.chatHidden){
      this.generateNewIds();
    }

  }

  registerChatSession(){
 
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
            {this.props.chatapp.chatHidden && !this.props.chatapp.formHidden ? 
              <ChatForm toggleForms={this.toggleForms}></ChatForm>
              : 
              <div>
                <ChatWidget clientId={this.props.chatapp.clientId} sessionId={this.props.chatapp.sessionId}></ChatWidget>
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

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(ChatApp));
