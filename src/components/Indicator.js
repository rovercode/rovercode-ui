import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import { COVERED } from '@/actions/sensor';
import '@/css/indicator.css';

const mapStateToProps = ({ sensor }) => ({ sensor });

const Indicator = ({ sensor }) => (
  <Grid columns={12} centered>
    <Grid.Row>
      <Grid.Column width={6}>
        {
          sensor.left === COVERED ? (
            <div id="leftIndicator" className="indicator covered" />
          ) : (
            <div id="leftIndicator" className="indicator not-covered" />
          )
        }
      </Grid.Column>
      <Grid.Column width={6}>
        {
          sensor.right === COVERED ? (
            <div id="rightIndicator" className="indicator covered" />
          ) : (
            <div id="rightIndicator" className="indicator not-covered" />
          )
        }
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

Indicator.propTypes = {
  sensor: PropTypes.shape({
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
  }).isRequired,
};

export default hot(module)(connect(mapStateToProps)(Indicator));
