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
    const { fetchProgram } = this.props;

    fetchProgram(e.target.id).then(() => this.setState({
      programLoaded: true,
    }));
  }

  pageChange = (page, owned) => {
    const { fetchPrograms, user } = this.props;

    if (owned) {
      fetchPrograms({
        user: user.user_id,
        page,
      });
    } else {
      fetchPrograms({
        user__not: user.user_id,
        page,
      });
    }
  }

  programSegment = (programs, label, owned) => (
    <Segment raised style={{ margin: '10px' }}>
      <ProgramCollection
        programs={programs}
        label={label}
        owned={owned}
        onProgramClick={this.loadProgram}
        onRemoveClick={this.showConfirm}
        onPageChange={this.pageChange}
      />
    </Segment>
  )

  render() {
    const {
      programs,
      programsIsFetching,
      userPrograms,
      userProgramsIsFetching,
    } = this.props;
    const { confirmOpen, focusProgram, programLoaded } = this.state;

    return (
      <Fragment>
        <Button primary as={Link} to="/mission-control" style={{ marginLeft: '10px' }}>
          <Icon name="plus" />
          New Program
        </Button>
        {
          programLoaded
            ? (<Redirect to="/mission-control" />)
            : (null)
        }
        {
          userProgramsIsFetching || userPrograms === null
            ? (<Loader active />)
            : this.programSegment(userPrograms, 'My Programs', true)
        }
        {
          programsIsFetching || programs === null
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
  programsIsFetching: false,
  userPrograms: {
    next: null,
    previous: null,
    total_pages: 1,
    results: [],
  },
  userProgramsIsFetching: false,
};

ProgramList.propTypes = {
  fetchProgram: PropTypes.func.isRequired,
  fetchPrograms: PropTypes.func.isRequired,
  removeProgram: PropTypes.func.isRequired,
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
        user: PropTypes.number.isRequired,
      }),
    ),
  }),
  programsIsFetching: PropTypes.bool,
  userPrograms: PropTypes.shape({
    next: PropTypes.string,
    previous: PropTypes.string,
    total_pages: PropTypes.number,
    results: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        user: PropTypes.number.isRequired,
      }),
    ),
  }),
  userProgramsIsFetching: PropTypes.bool,
};

export default ProgramList;
