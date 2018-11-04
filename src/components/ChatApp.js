import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { Card } from 'semantic-ui-react';
import ChatWidget from './ChatWidget';
import { withCookies, Cookies } from 'react-cookie';
import ChatForm from './ChatForm';
import {
  setSessionID as actionSetSessionId,
  setClientID as actionSetClientId,
  toggleForms as actionToggle,
  toggleOffSupportProvider as actionToggleOffSupportProvider,
  toggleAwaitingSupport as actionToggleAwaitingSupport,
} from '../actions/chatapp';

const mapStateToProps = ({ chatapp }) => ({ chatapp });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  toggleForms: () => dispatch(actionToggle()),
  setSessionId: id => dispatch(actionSetSessionId(id)),
  setClientId: id => dispatch(actionSetClientId(id)),
  toggleAwaitingSupport: () => dispatch(actionToggleAwaitingSupport()),
  deleteSupportRequest: id => dispatch(actionDeleteSupportRequest(id)),
  toggleOffSupportProvider: () =>dispatch(actionToggleOffSupportProvider()),
});

class ChatApp extends React.Component {
  setSessionId = (id) => {
    const { setSessionId } = this.props;
    setSessionId(id);
  };

  setClientId = (id) => {
    const { setClientId } = this.props;
    setClientId(id);
  };

  toggleForms = () => {
    const { toggleForms } = this.props;
    toggleForms();
  };

  toggleAwaitingSupport = () => {
    const { toggleAwaitingSupport } = this.props;
    toggleAwaitingSupport();
  }

  togglSupportProvider = () => {
    const { toggleSupportProvider } = this.props;
    toggleSupportProvider();
  }



  render() {
    const { chatapp } = this.props;
    return (
      <div style={{ marginTop: 20, marginLeft: 40, minWidth: 400 }}>
        <Card>
          <Card.Content>
            {chatapp.supportProvider
              ? (
                <div>
                  {chatapp.chatHidden && !chatapp.formHidden ? 
                    <ChatForm key="1" supportProvider toggleForms={this.toggleForms} setSessionId={this.setSessionId} setClientId={this.setClientId} />
                  : 
                    <ChatWidget key="1" setInProgress supportProvider  toggleSupportProvider = {this.togglSupportProvider} clientId={chatapp.clientId}  sessionId={chatapp.sessionId} />}  
                </div>
              ) : chatapp.chatHidden && !chatapp.formHidden
                ? <ChatForm key="2" toggleForms={this.toggleForms} setSessionId={this.setSessionId} setClientId={this.setClientId} />
                : (
                  <div>
                    <ChatWidget key="2" clientId={chatapp.clientId} toggleForms={this.toggleForms} setInProgress={false} sessionId={chatapp.sessionId} chatHeader="Finding someone to help you. Stand by!" />
                  </div>
                )}
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
  toggleAwaitingSupport: PropTypes.func.isRequired,
  chatapp: PropTypes.shape({
    formHidden: PropTypes.bool,
    chatHidden: PropTypes.bool,
  }).isRequired,
};
export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(ChatApp)));
