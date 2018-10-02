import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

const mapStateToProps = ({ code }) => ({ code });

class CodeViewer extends Component {
  stripCode = () => {
    const { code } = this.props;

    if (code.jsCode) {
      return code.jsCode.replace(/highlightBlock\(.*\);/g, '');
    }

    return '';
  }

  render() {
    return (
      <Modal
        basic
        dimmer="blurring"
        trigger={(
          <Button>
            Show Me The Code!
          </Button>
        )}
      >
        <Modal.Header>
          Here is the code in
          {' '}
          <a href="https://en.wikipedia.org/wiki/JavaScript">
            JavaScript
          </a>
          :
        </Modal.Header>
        <Modal.Content>
          <AceEditor
            mode="javascript"
            theme="monokai"
            readOnly
            fontSize={14}
            width="100%"
            value={this.stripCode()}
            editorProps={{ $blockScrolling: true }}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

CodeViewer.propTypes = {
  code: PropTypes.shape({
    jsCode: PropTypes.string,
  }).isRequired,
};

export default hot(module)(connect(mapStateToProps)(CodeViewer));
