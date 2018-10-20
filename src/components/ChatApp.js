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
   constructor(props){
     super(props);
   }

  setSessionId = (id) => {
    const { setSessionId } = this.props;
    setSessionId(id);
  };

  setClientId = (id) => {
    const { setClientId } = this.props;
    setClientId(id);
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
              ? <ChatForm toggleForms={this.toggleForms} setSessionId={this.setSessiontId} setClientId={this.setClientId} />
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
    formHidden: PropTypes.bool,
    chatHidden: PropTypes.bool,
  }).isRequired,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(ChatApp));
