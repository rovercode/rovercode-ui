import React from 'react';
import { Typography } from '@material-ui/core';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

const NumericSensorReadout = ({ title, reading, maxReading }) => (
  <>
    <Typography>
      {`${title}: ${reading} / ${maxReading}`}
    </Typography>
  </>
);

NumericSensorReadout.propTypes = {
  title: PropTypes.string.isRequired,
  reading: PropTypes.number.isRequired,
  maxReading: PropTypes.number.isRequired,
};

export default hot(module)(NumericSensorReadout);
