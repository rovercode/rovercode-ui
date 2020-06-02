import React from 'react';
import { Typography } from '@material-ui/core';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

const Indicator = ({ title, reading, maxReading }) => (
  <>
    <Typography>
      
    </Typography>
    <Typography>
      {`${title}: ${reading} / ${maxReading}`}
    </Typography>
  </>
);

Indicator.propTypes = {
  title: PropTypes.string.isRequired,
  reading: PropTypes.number.isRequired,
  maxReading: PropTypes.number.isRequired,
};

export default hot(module)(Indicator);
