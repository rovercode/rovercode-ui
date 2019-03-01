import React, { Component } from 'react';
import {
  Button,
  Form,
  Icon,
  Modal,
} from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';
import fileDownload from 'js-file-download';

const defaultState = {
  downloadOpen: false,
  apName: null,
  apPassword: null,
};

class Credential extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;
  }

  downloadButton = () => (
    <Button onClick={this.handleDownloadOpen}>
      <Icon name="download" />
      Download Credentials
    </Button>
  )

  handleDownloadOpen = () => this.setState({ downloadOpen: true })

  handleDownloadClose = () => this.setState({ downloadOpen: false })

  handleNameChange = e => this.setState({ apName: e.target.value })

  handlePasswordChange = e => this.setState({ apPassword: e.target.value })

  downloadCredentials = () => {
    const { rover } = this.props;
    const { apName, apPassword } = this.state;

    const credentials = {
      CLIENT_ID: rover.client_id,
      CLIENT_SECRET: rover.client_secret,
      AP_NAME: apName,
      AP_PASSWORD: apPassword,
    };
    let fileContents = '';
    Object.keys(credentials).forEach((key) => {
      fileContents += `${key}=${credentials[key]}\n`;
    });
    fileDownload(fileContents, `rovercode_${rover.name}.env`);

    this.setState(defaultState);
  }

  render() {
    const { downloadOpen } = this.state;

    return (
      <Modal trigger={this.downloadButton()} open={downloadOpen} onClose={this.handleDownloadClose}>
        <Modal.Header>
          Enter WiFi Credentials
        </Modal.Header>
        <Modal.Content>
          <p>
            The credentials entered are only used for the configuration file for the rover.
            This information does not leave the local browser and is not sent to the server.
          </p>
          <Form id="apForm" onSubmit={this.downloadCredentials}>
            <Form.Input placeholder="Access point name" onChange={this.handleNameChange} required />
            <Form.Input type="password" placeholder="Access point password" onChange={this.handlePasswordChange} required />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button primary type="submit" form="apForm">
            Download
          </Button>
          <Button onClick={this.handleDownloadClose}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

Credential.propTypes = {
  rover: PropTypes.shape({
    name: PropTypes.string.isRequired,
    client_id: PropTypes.string.isRequired,
    client_secret: PropTypes.string.isRequired,
  }).isRequired,
};

export default hot(module)(Credential);
