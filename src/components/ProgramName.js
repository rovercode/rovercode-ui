import React, { Component } from 'react';
import { Save } from '@material-ui/icons';
import {
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies } from 'react-cookie';
import { injectIntl } from 'react-intl';
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

  handleChange = (e) => {
    this.setState({
      editingName: e.target.value,
    });
  }

  handleSave = () => {
    const { changeName, code } = this.props;
    const { editingName } = this.state;

    changeName(code.id, editingName);
  }

  saveAdornment = () => {
    const { editingName, previousPropName } = this.state;

    return editingName !== previousPropName ? (
      <InputAdornment position="end">
        <IconButton color="secondary" onClick={this.handleSave}>
          <Save />
        </IconButton>
      </InputAdornment>
    ) : (null);
  }

  render() {
    const { code, intl } = this.props;
    const { editingName } = this.state;

    const nameLabel = intl.formatMessage({
      id: 'app.program_name.name',
      description: 'Label for new program name entry',
      defaultMessage: 'Name:',
    });

    return (
      <>
        <InputLabel htmlFor="program-name">{nameLabel}</InputLabel>
        <Input
          id="program-name"
          value={editingName}
          disabled={code.isReadOnly}
          onChange={this.handleChange}
          endAdornment={this.saveAdornment()}
        />
      </>
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
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

export default hot(module)(
  withCookies(
    injectIntl(
      connect(mapStateToProps, mapDispatchToProps)(ProgramName),
    ),
  ),
);
