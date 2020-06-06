import React from 'react';
import { Typography, ExpansionPanelDetails } from '@material-ui/core';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

const NumericSensorReadout = ({ title, readings, unit }) => (
  <>
    <ExpansionPanelDetails>
      <Typography>
        {title}
      </Typography>
    </ExpansionPanelDetails>
    {
      readings.map((reading) => (
        <ExpansionPanelDetails>
          <Typography variant="body2">
            {
              reading.reading === null ? (
                'Not connected'
              ) : (
                `${reading.label}: ${reading.reading} / ${reading.maxReading} ${unit}`
              )
            }
          </Typography>
        </ExpansionPanelDetails>
      ))
    }
  </>
);

NumericSensorReadout.defaultProps = {
  unit: null,
};

NumericSensorReadout.propTypes = {
  title: PropTypes.string.isRequired,
  readings: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    reading: PropTypes.number.isRequired,
    maxReading: PropTypes.number.isRequired,
  })).isRequired,
  unit: PropTypes.string,
};

export default hot(module)(NumericSensorReadout);
