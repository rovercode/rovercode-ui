import React, { Component, Fragment } from 'react';
import {
  Button,
  Confirm,
  Icon,
  Loader,
  Segment,
} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import ProgramCollection from './ProgramCollection';

const defaultState = {
  programLoaded: false,
  confirmOpen: false,
  focusProgram: {
    id: null,
    name: null,
  },
};

class ProgramList extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;
  }

  componentDidMount() {
    const { fetchPrograms, user } = this.props;
    return fetchPrograms({
      user: user.user_id,
    }).then(() => fetchPrograms({
      user__not: user.user_id,
    }));
  }

  showConfirm = e => this.setState({
    confirmOpen: true,
    focusProgram: {
      id: e.target.id,
      name: e.target.name,
    },
  })

  cancelRemove = () => this.setState(defaultState)

  removeProgram = () => {
    const { fetchPrograms, removeProgram, user } = this.props;
    const { focusProgram } = this.state;

    this.setState(defaultState);

    return removeProgram(focusProgram.id)
      .then(() => fetchPrograms({
        user: user.user_id,
      }))
      .then(() => fetchPrograms({
        user__not: user.user_id,
      }));
  }

  loadProgram = (e) => {
    const { changeReadOnly, fetchProgram } = this.props;
    const readOnly = e.target.dataset.owned === 'false';


    fetchProgram(e.target.id).then(() => {
      changeReadOnly(readOnly);
      this.setState({
        programLoaded: true,
      });
    });
  }

  fetch = (params, owned) => {
    const { fetchPrograms, user } = this.props;

    if (owned) {
      fetchPrograms({
        user: user.user_id,
        ...params,
      });
    } else {
      fetchPrograms({
        user__not: user.user_id,
        ...params,
      });
    }
  }

  programSegment = (programs, label, owned) => (
    <Segment raised style={{ margin: '10px 10% 10px 10%' }}>
      <ProgramCollection
        programs={programs}
        label={label}
        owned={owned}
        onProgramClick={this.loadProgram}
        onRemoveClick={this.showConfirm}
        onUpdate={this.fetch}
      />
    </Segment>
  )

  render() {
    const { programs, userPrograms } = this.props;
    const {
      confirmOpen,
      focusProgram,
      programLoaded,
    } = this.state;

    return (
      <Fragment>
        <Button primary as={Link} to="/mission-control" style={{ marginLeft: '10%' }}>
          <Icon name="plus" />
          New Program
        </Button>
        {
          programLoaded ? (
            <Redirect to={{
              pathname: '/mission-control',
            }}
            />
          ) : (null)
        }
        {
          userPrograms === null
            ? (<Loader active />)
            : this.programSegment(userPrograms, 'My Programs', true)
        }
        {
          programs === null
            ? (<Loader active />)
            : this.programSegment(programs, 'Find More', false)
        }
        <Confirm
          header="Remove Program"
          content={`Are you sure you want to remove ${focusProgram.name}?`}
          open={confirmOpen}
          onConfirm={this.removeProgram}
          onCancel={this.cancelRemove}
          cancelButton="No"
          confirmButton="Yes"
        />
      </Fragment>
    );
  }
}

ProgramList.defaultProps = {
  programs: {
    next: null,
    previous: null,
    total_pages: 1,
    results: [],
  },
  userPrograms: {
    next: null,
    previous: null,
    total_pages: 1,
    results: [],
  },
};

ProgramList.propTypes = {
  fetchProgram: PropTypes.func.isRequired,
  fetchPrograms: PropTypes.func.isRequired,
  removeProgram: PropTypes.func.isRequired,
  changeReadOnly: PropTypes.func.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
  }).isRequired,
  programs: PropTypes.shape({
    next: PropTypes.string,
    previous: PropTypes.string,
    total_pages: PropTypes.number,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
        }).isRequired,
      }),
    ),
  }),
  userPrograms: PropTypes.shape({
    next: PropTypes.string,
    previous: PropTypes.string,
    total_pages: PropTypes.number,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        user: PropTypes.shape({
          username: PropTypes.string.isRequired,
        }).isRequired,
      }),
    ),
  }),
};

export default ProgramList;
