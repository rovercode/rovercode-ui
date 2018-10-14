import React, { Component } from 'react';
import { Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withCookies } from 'react-cookie';
import PropTypes from 'prop-types';

import { changeName as actionChangeName } from '@/actions/code';

const mapStateToProps = ({ code }) => ({ code });
const mapDispatchToProps = (dispatch, { cookies }) => ({
  changeName: (id, name) => {
    const changeNameAction = actionChangeName(id, name, {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    });
    return dispatch(changeNameAction);
  },
});

class Console extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  handleChange = (e) => {
    this.setState({
      editingName: e.target.value,
    });
  }

  handleClick = () => {
    const { changeName, code } = this.props;
    const { editingName } = this.state;

    changeName(code.id, editingName);
  }

  render() {
    const { editingName } = this.state;

    return (
      <Input
        type="text"
        label="Name:"
        defaultValue={editingName}
        onChange={this.handleChange}
        action={{ content: 'Save', onClick: this.handleClick }}
      />
    );
  }
}

Console.propTypes = {
  code: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  changeName: PropTypes.func.isRequired,
};

export default hot(module)(withCookies(connect(mapStateToProps, mapDispatchToProps)(Console)));
