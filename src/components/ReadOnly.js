import { Component } from 'react';
import PropTypes from 'prop-types';

class ReadOnly extends Component {
  isReadOnly = () => {
    const { location } = this.props;

    if (!location.state) {
      location.state = {
        readOnly: false,
      };
    }

    const { state: { readOnly } } = location;

    return readOnly;
  }
}

ReadOnly.defaultProps = {
  location: {
    state: {
      readOnly: false,
    },
  },
};

ReadOnly.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      readOnly: PropTypes.bool,
    }),
  }),
};

export default ReadOnly;
