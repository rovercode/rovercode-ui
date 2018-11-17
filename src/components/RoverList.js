import React, { Component, Fragment } from 'react';
import { Button, Header, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class RoverList extends Component {
  componentDidMount() {
    const { fetchRovers } = this.props;
    fetchRovers();
  }

  render() {
    const { rovers } = this.props;
    return (
      <Fragment>
        {
          rovers === null
            ? (<Loader active />)
            : (
              <Header>
                {`Welcome to rovercode, you have ${rovers.length} rover(s)!`}
              </Header>
            )
        }
        <Link to="/mission-control">
          <Button>
            Mission Control
          </Button>
        </Link>
        <Link to="/Programs">
          <Button>
            Programs
          </Button>
        </Link>
        <Link to="/support">
          <Button color="purple">
            Support
          </Button>
        </Link>
      </Fragment>
    );
  }
}

RoverList.defaultProps = {
  rovers: null,
};

RoverList.propTypes = {
  fetchRovers: PropTypes.func.isRequired,
  rovers: PropTypes.array, // eslint-disable-line react/forbid-prop-types
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

export default RoverList;
