import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import { Button, Card } from 'semantic-ui-react';
import ChatWidget from './ChatWidget';
import { withCookies, Cookies } from 'react-cookie';
import axios from 'axios';
import ChatForm from './ChatForm';
import {
  setSessionID as actionSetSessionId,
  setClientID as actionSetClientId,
  toggleForms as actionToggle,
  toggleAwaitingSupport as actionToggleAwaitingSupport,
  deleteSupportRequest as actionDeleteSupportRequest,
} from '../actions/chatapp';

const mapStateToProps = ({ chatapp }) => ({ chatapp });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  toggleForms: () => dispatch(actionToggle()),
  setSessionId: id => dispatch(actionSetSessionId(id)),
  setClientId: id => dispatch(actionSetClientId(id)),
  toggleAwaitingSupport: () => dispatch(actionToggleAwaitingSupport()),
  deleteSupportRequest: id => dispatch(actionDeleteSupportRequest(id)),
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


  handleConcludeChat = () => {
    const { sessionId } = this.props.chatapp;
    const { cookies } = this.props;
    const headers = {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
        'Content-Type': 'application/json',
    };
    axios.delete(`/api/v1/support-requests/${sessionId}/`, { headers })
      .then((response) => {
        console.log(response);
        this.toggleForms();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleCancelChat = () => {
    const { sessionId } = this.props.chatapp;
    const { cookies } = this.props;
    const newobj = {};
    newobj.in_progress = false;
    const headers = {
      Authorization: `JWT ${cookies.get('auth_jwt')}`,
      'Content-Type': 'application/json',
    };
    axios.patch(`/api/v1/support-requests/${sessionId}/`, JSON.stringify(newobj), { headers })
      .then((response) => {
        console.log(response);
        this.toggleForms();
      })
      .catch((error) => {
        console.log(error);
      });
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
                  <ChatWidget setInProgress clientId={chatapp.clientId} sessionId={chatapp.sessionId} />
                  <br />
                  <br />
                  <Button className="ui negative button" onClick={this.toggleForms}>
                  Cancel chat
                  </Button>
                </div>
              ) : chatapp.chatHidden && !chatapp.formHidden
                ? <ChatForm toggleForms={this.toggleForms} setSessionId={this.setSessionId} setClientId={this.setClientId} />
                : (
                  <div>
                    <ChatWidget clientId={chatapp.clientId} setInProgress={false} sessionId={chatapp.sessionId} chatHeader="Finding someone to help you. Stand by!" />
                    <br />
                    <br />
                    <Button positive onClick={this.handleConcludeChat}>
                      My problem is fixed!
                    </Button>
                    <br />
                    <br />
                    <Button className="ui negative button" onClick={this.handleCancelChat}>
                      Find help from someone else
                    </Button>
                    <br />
                    <br />
                    <Button className="ui negative button" >
                      Report Abuse
                    </Button>
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

// export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(ChatApp));
