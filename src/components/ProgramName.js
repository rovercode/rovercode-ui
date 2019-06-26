import React, { Component, Fragment } from 'react';
import { Confirm, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies } from 'react-cookie';
import PropTypes from 'prop-types';

import { updateValidAuth } from '@/actions/auth';
import { changeName as actionChangeName } from '@/actions/code';

const mapStateToProps = ({ code }) => ({ code });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  changeName: (id, name) => {
    const changeNameAction = actionChangeName(id, name, {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(changeNameAction).catch((error) => {
      if (error.response.status === 401) {
        // Authentication is no longer valid
        dispatch(updateValidAuth(false));
      }
    });
  },
});

class ProgramName extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmOpen: false,
      editingName: null,
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
    const { code } = this.props;
    const { confirmOpen, editingName, previousPropName } = this.state;
    let actionProp = {};

    // Only show `Save` when the name has changed
    if (editingName !== previousPropName) {
      actionProp = {
        action: {
          content: 'Save',
          onClick: this.openConfirm,
        },
      };
    }

    return (
      <Fragment>
        <Input
          type="text"
          label="Name:"
          defaultValue={editingName}
          disabled={code.isReadOnly}
          onChange={this.handleChange}
          {...actionProp}
        />
        <Confirm
          content="Are you sure that you want to change the name of this program?"
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
};

export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(ProgramName)));
