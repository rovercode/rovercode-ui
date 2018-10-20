import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { Button, Card } from 'semantic-ui-react';
import ChatWidget from './ChatWidget';
import ChatForm from './ChatForm';
import { setSessionID as actionSetSessionId, setClientID as actionSetClientId, toggleForms as actionToggle } from '../actions/chatapp';

const mapStateToProps = ({ chatapp }) => ({ chatapp });
const mapDispatchToProps = dispatch => ({
  toggleForms: () => dispatch(actionToggle()),
  setSessionId: id => dispatch(actionSetSessionId(id)),
  setClientId: id => dispatch(actionSetClientId(id)),
});

class ChatApp extends React.Component {
  static idGenerator() {
    const S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  componentDidMount() {

  }

  setSessionId = (id) => {
    const { setSessionId } = this.props;
    setSessionId(id);
  };

  setClientId = (id) => {
    const { setClientId } = this.props;
    setClientId(id);
  };

  generateNewIds = () => {
    const clientId = this.idGenerator();
    const sessionId = this.idGenerator();
    console.log(`${clientId}\n${sessionId}`);
    this.setSessionId(sessionId);
    this.setClientId(clientId);
  };

  toggleForms = () => {
    const { toggleForms, chatapp } = this.props;
    toggleForms();
    if (!chatapp.formHidden && chatapp.chatHidden) {
      this.generateNewIds();
    }
  };

  render() {
    const { chatapp } = this.props;
    return (
      <div style={{ marginTop: 20, marginLeft: 40, minWidth: 400 }}>
        <Card>
          <Card.Content>
            {chatapp.chatHidden && !chatapp.formHidden
              ? <ChatForm toggleForms={this.toggleForms} />
              : (
                <div>
                  <ChatWidget clientId={chatapp.clientId} sessionId={chatapp.sessionId} />
                  <br />
                  <br />
                  <Button className="ui negative button" onClick={this.toggleForms}>
                    Cancel chat
                  </Button>
                </div>
              )
              }
          </Card.Content>
        </Card>
      </div>
    );
  }
}

ChatApp.propTypes = {
  setSessionId: PropTypes.func.isRequired,
  setClientId: PropTypes.func.isRequired,
  toggleForms: PropTypes.func.isRequired,
  chatapp: PropTypes.shape({
    clientId: PropTypes.string,
    sessionId: PropTypes.string,
    formHidden: PropTypes.bool,
    chatHidden: PropTypes.bool,
  }).isRequired,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(ChatApp));
