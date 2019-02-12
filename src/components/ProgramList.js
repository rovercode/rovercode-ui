import React, { Component, Fragment } from 'react';
import {
  Button, Card, Header, Icon, Loader, Segment,
} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class ProgramList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      programLoaded: false,
    };
  }

  componentDidMount() {
    const { fetchPrograms, user } = this.props;
    return fetchPrograms(user.user_id).then(() => fetchPrograms());
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
          programs.map(program => (
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
              </Card.Content>
            </Card>
          ))
        }
      </Card.Group>
    </Segment>
  )

  render() {
    const { programs, userPrograms, user } = this.props;
    const { programLoaded } = this.state;

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
          userPrograms === null
            ? (<Loader active />)
            : this.programSegment(userPrograms, 'My Programs', user.user_id)
        }
        {
          programs === null
            ? (<Loader active />)
            : this.programSegment(programs, 'Find More', user.user_id)
        }
      </Fragment>
    );
  }
}

ProgramList.defaultProps = {
  programs: null,
  userPrograms: null,
};

ProgramList.propTypes = {
  fetchProgram: PropTypes.func.isRequired,
  fetchPrograms: PropTypes.func.isRequired,
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
  }).isRequired,
  programs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      user: PropTypes.number.isRequired,
    }),
  ),
  userPrograms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      user: PropTypes.number.isRequired,
    }),
  ),
};

export default ProgramList;
