import React, { Component, Fragment } from 'react';
import {
  Button, Card, Confirm, Header, Icon, Loader, Segment,
} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

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
    return fetchPrograms(user.user_id).then(() => fetchPrograms());
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
      .then(() => fetchPrograms(user.user_id))
      .then(() => fetchPrograms());
  }

  loadProgram = (e) => {
    const { fetchProgram } = this.props;

    fetchProgram(e.target.id).then(() => this.setState({
      programLoaded: true,
    }));
  }

  programSegment = (programs, label, userId) => (
    <Segment raised style={{ margin: '10px' }}>
      <Header as="h1" textAlign="center">
        {label}
      </Header>
      <Card.Group centered>
        {
          programs.results.map(program => (
            <Card key={program.id}>
              <Card.Content>
                <Card.Header>
                  {program.name}
                </Card.Header>
                <Card.Meta>
                  { program.user === userId ? 'Mine' : program.user }
                </Card.Meta>
              </Card.Content>
              <Card.Content extra>
                <Button primary id={program.id} onClick={this.loadProgram}>
                  { program.user === userId ? 'Keep Working' : 'View' }
                </Button>
                {
                  program.user === userId ? (
                    <Button
                      negative
                      id={program.id}
                      name={program.name}
                      onClick={this.showConfirm}
                      floated="right"
                    >
                      Remove
                    </Button>
                  ) : (null)
                }
              </Card.Content>
            </Card>
          ))
        }
      </Card.Group>
    </Segment>
  )

  render() {
    const {
      programs,
      programsIsFetching,
      userPrograms,
      userProgramsIsFetching,
      user,
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
            : this.programSegment(userPrograms, 'My Programs', user.user_id)
        }
        {
          programsIsFetching || programs === null
            ? (<Loader active />)
            : this.programSegment(programs, 'Find More', user.user_id)
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
    results: [],
  },
  programsIsFetching: false,
  userPrograms: {
    next: null,
    previous: null,
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
