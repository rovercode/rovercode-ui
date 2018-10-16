import React, { Component, Fragment } from 'react';
import { Button, Header, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class ProgramList extends Component {
  componentDidMount() {
    const { fetchPrograms } = this.props;
    fetchPrograms();
  }

  launchProgram(programId) {
    const { fetchProgram } = this.props;
    console.log('launching a program, man, ', programId);
    fetchProgram(programId);
  }

  render() {
    const { programs } = this.props;
    return (
      <Fragment>
        {
          programs === null
            ? (<Loader active />)
            : (
              <Header>
                {`Welcome to rovercode, you have ${programs.length} program(s)!`}
              </Header>
            )
        }

        {programs && programs.map(program => (
          <Button key={program.id} onClick={() => this.launchProgram(program.id)}>
            {program.name}
          </Button>
        ))}

        <Link to="/">
          <Button>
            Back home
          </Button>
        </Link>
        <Link to="/mission-control">
          <Button>
            Mission Control
          </Button>
        </Link>
      </Fragment>
    );
  }
}

ProgramList.defaultProps = {
  programs: null,
};

ProgramList.propTypes = {
  fetchPrograms: PropTypes.func.isRequired,
  fetchProgram: PropTypes.func.isRequired,
  programs: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  // PropTypes.arrayOf((
  //   propValue,
  //   key,
  //   componentName,
  //   location,
  //   propFullName,
  // ) => (
  //   !/rover/.test(propValue[key])
  //   && new Error(`Invalid prop ${propFullName} supplied
  //   to ${componentName}. Validation failed.`)
  // )),
};

export default ProgramList;
