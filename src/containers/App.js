import React, { Component, Fragment } from 'react';
import { Header, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rovers: null,
    };
  }

  componentDidMount() {
    const { cookies } = this.props;

    return axios.get('/api/v1/rovers/', {
      headers: {
        Authorization: `JWT ${cookies.get('auth_jwt')}`,
      },
    })
      .then((response) => {
        this.setState({
          rovers: response.data,
        });
      })
      .catch(() => {
        this.setState({
          rovers: [],
        });
      });
  }

  render() {
    const { rovers } = this.state;

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

App.propTypes = {
  cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default withCookies(App);
