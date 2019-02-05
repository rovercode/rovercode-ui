import React, { Component, Fragment } from 'react';
import {
  Button, Card, Header, Loader,
} from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class ProgramList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      programLoaded: false,
    };
  }

  componentDidMount() {
    const { fetchPrograms } = this.props;
    return fetchPrograms();
  }

  loadProgram = (e) => {
    const { fetchProgram } = this.props;

    fetchProgram(e.target.id).then(() => this.setState({
      programLoaded: true,
    }));
  }

  render() {
    const { programs } = this.props;
    const { programLoaded } = this.state;

    return (
      <Fragment>
        {
          programLoaded
            ? (<Redirect to="/mission-control" />)
            : (null)
        }
        <Header as="h1" textAlign="center">
          Programs
        </Header>
        {
          programs === null
            ? (<Loader active />)
            : (
              <Card.Group centered>
                {
                  programs.map(program => (
                    <Card key={program.id}>
                      <Card.Content>
                        <Card.Header>
                          {program.name}
                        </Card.Header>
                        <Card.Meta>
                          {program.user}
                        </Card.Meta>
                      </Card.Content>
                      <Card.Content extra>
                        <Button primary id={program.id} onClick={this.loadProgram}>
                          Edit
                        </Button>
                      </Card.Content>
                    </Card>
                  ))
                }
              </Card.Group>
            )
        }
      </Fragment>
    );
  }
}

ProgramList.defaultProps = {
  programs: null,
};

ProgramList.propTypes = {
  fetchProgram: PropTypes.func.isRequired,
  fetchPrograms: PropTypes.func.isRequired,
  programs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      user: PropTypes.number.isRequired,
    }),
  ),
};

export default ProgramList;
