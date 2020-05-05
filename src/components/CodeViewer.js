import React, { Component } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Link,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

const mapStateToProps = ({ code }) => ({ code });

class CodeViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  stripCode = () => {
    const { code } = this.props;

    if (code.jsCode) {
      return code.jsCode.replace(/highlightBlock\(.*\);/g, '');
    }

    return '';
  }

  handleOpen = () => {
    this.setState({
      open: true,
    });
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  }

  render() {
    const { children } = this.props;
    const { open } = this.state;

    return (
      <>
        <Button variant="contained" color="primary" onClick={this.handleOpen}>
          { children }
        </Button>
        <Dialog maxWidth="md" open={open} onClose={this.handleClose}>
          <DialogTitle>
            <FormattedMessage
              id="app.code_viewer.description"
              description="Describes the programming language in the code viewer"
              defaultMessage="Here is the code in"
            />
            {' '}
            <Link href="https://en.wikipedia.org/wiki/JavaScript">
              JavaScript
            </Link>
            :
          </DialogTitle>
          <DialogContent dividers>
            <AceEditor
              mode="javascript"
              theme="github"
              readOnly
              fontSize={14}
              width="750px"
              value={this.stripCode()}
              editorProps={{ $blockScrolling: true }}
            />
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

CodeViewer.propTypes = {
  code: PropTypes.shape({
    jsCode: PropTypes.string,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(FormattedMessage),
    PropTypes.string,
  ]).isRequired,
};

export default hot(module)(connect(mapStateToProps)(CodeViewer));
