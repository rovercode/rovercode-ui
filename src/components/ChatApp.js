import React from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Button, Card } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';
import ChatWidget from './ChatWidget';
import ChatForm from './ChatForm';


import { setSessionID as actionSetSessionId, setClientID as actionSetClientId, toggleForms as actionToggle} from '../actions/chatapp'


const mapStateToProps = ({ chatapp }) => ({ chatapp });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  toggleforms: () => dispatch(actionToggle()),
  setsessionid: id => dispatch(actionSetSessionId(id)),
  setclientid: id => dispatch(actionSetClientId(id))
});

class ChatApp extends React.Component {

  // constructor(props) {
  //     super(props)
  // }

  componentDidMount() {
  }

  setSessionId = (id) => {
    const { setsessionid } = this.props;
    setsessionid(id);
  }

  setClientId = ()=> {
    const { setclientid } = this.props;
    const { cookies } = this.props;
    const clientid = cookies.get('auth_jwt');
    const decodedjwt = decodedjwt(clientid)   
    setclientid(clientid);
  }

  decodeJWT = (jwt) => {
    const jwtdecoded = atob(jwt);
    return jwtdecoded;
  }

  generateNewIds = () =>{
    const sessionid = this.idGenerator();
    console.log(`!!!!!!!!!!!!!!!!!!\n${sessionid}`)
    this.setSessionId(sessionid);
    this.setClientId();
  }

  toggleForms = ()=> {
    const { toggleforms} = this.props;
    toggleforms();
    if ( this.props.chatapp.formHidden && !this.props.chatapp.chatHidden){
      this.generateNewIds();
    }

  }

  idGenerator = () => {
    const S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  } 

  
  render() {
    return(
      <div style={{marginTop:20, marginLeft:40, minWidth:400}} >
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

export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(ChatApp)));

