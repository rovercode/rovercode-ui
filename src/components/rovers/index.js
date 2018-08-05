import React, { Component, Fragment } from 'react';
import { Header, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class App extends Component {
  componentDidMount() {
    const { fetchRovers } = this.props;
    fetchRovers();
  }

  render() {
    const { rovers } = this.props;
    return (
      <Fragment>
        {
            rovers !== null ? (
              <Header>
                {`Welcome to rovercode, you have ${rovers.length} rover(s)!`}
              </Header>
            ) : (
              <Loader active />
            )
        }
      </Fragment>
    );
  }
}

App.defaultProps = {
  rovers: null,
};

App.propTypes = {
  fetchRovers: PropTypes.func.isRequired,
  rovers: PropTypes.arrayOf((
    propValue,
    key,
    componentName,
    location,
    propFullName,
  ) => (
    !/rover/.test(propValue[key])
    && new Error(`Invalid prop ${propFullName} supplied
    to ${componentName}. Validation failed.`)
  )),
};

export default App;
