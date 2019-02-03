import React, { Component, Fragment } from 'react';
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import { clear as actionClear } from '@/actions/console';

const mapStateToProps = ({ console }) => ({ console });
const mapDispatchToProps = dispatch => ({
  clear: () => dispatch(actionClear()),
});

class Console extends Component {
  constructor(props) {
    super(props);

    this.bottomRef = React.createRef();
  }

  componentDidUpdate() {
    this.bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  handleClear = () => {
    const { clear } = this.props;

    clear();
  }

  render() {
    const { console } = this.props;

    /* eslint-disable react/no-array-index-key */
    return (
      <Fragment>
        <div style={{ height: '200px', overflow: 'scroll' }}>
          {
            console.messages.map((message, index) => (
              <p key={index}>
                {`>> ${message}`}
              </p>
            ))
          }
          <div ref={this.bottomRef} />
        </div>
        <Button primary onClick={this.handleClear} style={{ marginTop: '10px' }}>
          Clear
        </Button>
      </Fragment>
    );
  }
}

Console.propTypes = {
  console: PropTypes.shape({
    messages: PropTypes.array.isRequired,
  }).isRequired,
  clear: PropTypes.func.isRequired,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(Console));
