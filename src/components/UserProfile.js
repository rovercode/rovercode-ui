import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';

class UserProfile extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {

    return (
      <Fragment>
        <h1>HEYYYYY</h1>
      </Fragment>
    );
  }
}

UserProfile.defaultProps = {
};

UserProfile.propTypes = {
};

export default injectIntl(UserProfile);
