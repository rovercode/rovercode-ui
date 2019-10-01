import React, { Component } from 'react';
import {
  Button,
  Form,
  Icon,
  Modal,
} from 'semantic-ui-react';
import { hot } from 'react-hot-loader';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
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
      <FormattedMessage
        id="app.credential.open"
        description="Button label to open credential dialog"
        defaultMessage="Download Credentials"
      />
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
    const { intl } = this.props;
    const { downloadOpen } = this.state;

    const networkNameLabel = intl.formatMessage({
      id: 'app.credential.name',
      description: 'Label for WiFi access point name entry',
      defaultMessage: 'Network Name:',
    });

    const networkPasswordLabel = intl.formatMessage({
      id: 'app.credential.password',
      description: 'Label for WiFi access point password entry',
      defaultMessage: 'Network Password:',
    });

    return (
      <Modal trigger={this.downloadButton()} open={downloadOpen} onClose={this.handleDownloadClose}>
        <Modal.Header>
          <FormattedMessage
            id="app.credential.header"
            description="Header for entering WiFi access point and password"
            defaultMessage="Enter WiFi Credentials"
          />
        </Modal.Header>
        <Modal.Content>
          <p>
            <FormattedMessage
              id="app.credential.description"
              description="Explains to the user what happens with the entered WiFi access point and password"
              defaultMessage="The credentials entered are only used for the configuration file for the rover. This information does not leave the local browser and is not sent to the server."
            />
          </p>
          <Form id="apForm" onSubmit={this.downloadCredentials}>
            <Form.Input inline label={networkNameLabel} onChange={this.handleNameChange} required />
            <Form.Input inline label={networkPasswordLabel} type="password" onChange={this.handlePasswordChange} required />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button primary type="submit" form="apForm">
            <FormattedMessage
              id="app.credential.download"
              description="Button label to begin download of rover configuration"
              defaultMessage="Download"
            />
          </Button>
          <Button onClick={this.handleDownloadClose}>
            <FormattedMessage
              id="app.credential.cancel"
              description="Button label to cancel download of rover configuration"
              defaultMessage="Cancel"
            />
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
  intl: intlShape.isRequired,
};

export default hot(module)(injectIntl(Credential));
