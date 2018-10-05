import React from 'react';
import { Grid } from 'semantic-ui-react';
import { hot } from 'react-hot-loader';

import CodeViewer from '@/components/CodeViewer';
import Console from '@/components/Console';
import Control from '@/components/Control';
import Indicator from '@/components/Indicator';
import Workspace from '@/components/Workspace';
import { Button } from 'semantic-ui-react'



const MissionControl = () => (
  <Grid columns={16} divided>
    <Grid.Row>
      <Grid.Column width={6}>
        <Grid.Row>
          <Workspace />
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={6}>
        <Grid.Row>
          <CodeViewer>
            Show Me The Code!
          </CodeViewer>
        </Grid.Row>
        <hr />
        <Grid.Row>
          <Control />
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={4}>
        <Grid.Row>
          <Console />
        </Grid.Row>
        <Grid.Row>
          <Indicator />
        </Grid.Row>
        <Grid.Row>
          <ChatApp></ChatApp>
        </Grid.Row>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

import { Widget, addResponseMessage, addLinkSnippet, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
class ChatApp extends React.Component {
  componentDidMount() {
    addResponseMessage("Welcome to this awesome chat!");
  }

  handleNewUserMessage = (newMessage) => {
    console.log(`New message incomig! ${newMessage}`);
    // Now send the message throught the backend API
  }

  getCustomLauncher = (toggle) =>{
    return(
      <Button primary onClick={toggle}>Hey I need help!</Button>
    )
  }

  render() {
    return (
      <div className="App">
        <Widget
          launcher={handleToggle => this.getCustomLauncher(handleToggle)}
          handleNewUserMessage={this.handleNewUserMessage}
          title="Need help with your code?"
          subtitle="Ask your question and we will find someone to help you"
        />
      </div>
    );
  } 
}


export default hot(module)(MissionControl);
