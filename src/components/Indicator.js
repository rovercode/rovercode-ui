import React from 'react';
import { Grid } from '@material-ui/core';
import { styled, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import { COVERED } from '@/actions/sensor';

const mapStateToProps = ({ sensor }) => ({ sensor });

const Circle = styled('div')({
  margin: '0 auto',
  borderRadius: '25px',
  border: '1px solid #9A9A9A',
  width: '24px',
  height: '24px',
  opacity: 1,
});

const CircleCovered = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.success.main,
  },
}))(Circle);

const CircleNotCovered = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
}))(Circle);

const Indicator = ({ sensor }) => (
  <Grid container direction="row" justify="space-evenly">
    {
      /* eslint-disable react/no-array-index-key */
      [sensor.left, sensor.right].map((s, i) => (
        <Grid item key={i}>
          {
            s === COVERED ? (
              <CircleCovered id={`covered-${i}`} />
            ) : (
              <CircleNotCovered id={`not-covered-${i}`} />
            )
          }
        </Grid>
      ))
    }
  </Grid>
);

Indicator.propTypes = {
  sensor: PropTypes.shape({
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
  }).isRequired,
};

export default hot(module)(connect(mapStateToProps)(Indicator));
