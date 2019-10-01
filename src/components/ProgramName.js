import React, { Component, Fragment } from 'react';
import { Confirm, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies } from 'react-cookie';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';

import { checkAuthError, authHeader } from '@/actions/auth';
import { changeName as actionChangeName } from '@/actions/code';

const mapStateToProps = ({ code }) => ({ code });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  changeName: (id, name) => dispatch(actionChangeName(id, name, authHeader(cookies)))
    .catch(checkAuthError(dispatch)),
});

class ProgramName extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmOpen: false,
      editingName: '',
      previousPropName: null, // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { code } = props;
    const { previousPropName } = state;

    if (code.name !== previousPropName) {
      return {
        editingName: code.name,
        previousPropName: code.name,
      };
    }

    return null;
  }

  closeConfirm = () => this.setState({ confirmOpen: false })

  openConfirm = () => this.setState({ confirmOpen: true })

  handleChange = (e) => {
    this.setState({
      editingName: e.target.value,
    });
  }

  handleSave = () => {
    const { changeName, code } = this.props;
    const { editingName } = this.state;

    changeName(code.id, editingName);
    this.closeConfirm();
  }

  render() {
    const { code, intl } = this.props;
    const { confirmOpen, editingName, previousPropName } = this.state;
    let actionProp = {};

    const saveAction = intl.formatMessage({
      id: 'app.program_name.save',
      description: 'Button label for saving new program name',
      defaultMessage: 'Save',
    });

    const nameLabel = intl.formatMessage({
      id: 'app.program_name.name',
      description: 'Label for new program name entry',
      defaultMessage: 'Name:',
    });

    const confirmText = intl.formatMessage({
      id: 'app.program_name.confirm',
      description: 'Confirmation of program name change',
      defaultMessage: 'Are you sure that you want to change the name of this program?',
    });

    // Only show `Save` when the name has changed
    if (editingName !== previousPropName) {
      actionProp = {
        action: {
          content: saveAction,
          onClick: this.openConfirm,
        },
      };
    }

    return (
      <Fragment>
        <Input
          type="text"
          label={nameLabel}
          value={editingName}
          disabled={code.isReadOnly}
          onChange={this.handleChange}
          {...actionProp}
        />
        <Confirm
          content={confirmText}
          open={confirmOpen}
          onCancel={this.closeConfirm}
          onConfirm={this.handleSave}
        />
      </Fragment>
    );
  }
}

ProgramName.propTypes = {
  code: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    isReadOnly: PropTypes.bool,
  }).isRequired,
  changeName: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default hot(module)(
  withCookies(
    injectIntl(
      connect(mapStateToProps, mapDispatchToProps)(ProgramName),
    ),
  ),
);
